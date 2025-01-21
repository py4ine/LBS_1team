import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
console.log(import.meta.env);
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const useMap = (mapContainerRef, defaultStyle, mapConfig) => {
  const mapInstance = useRef(null);
  const loadGeoJsonRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const loadWaterJsonRef = useRef(null);
  const loadDangerJsonRef = useRef(null);
  const removePointLayersRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: defaultStyle,
      center: mapConfig.initialCenter,
      zoom: mapConfig.initialZoom,
    });

    mapInstance.current = map;

    map.on("load", () => {
      setMapLoaded(true);
      console.log("Map loaded successfully.");
    });

    map.on("click", "polygon-layer", (e) => {
      if (!e.features || e.features.length === 0) return;

      const clickedFeature = e.features[0];
      
      const properties = clickedFeature.properties;

      console.log(properties)

      // 팝업 좌표 및 내용 설정
      const coordinates = e.lngLat;
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(
          `<strong>건물명: ${properties.bldg_nm || "건물 정보 없음"}</strong><br>
           건물주소: ${properties.road_nm_addr || "유형 정보 없음"}<br>
           지상층수: ${properties.gro_flo_co || "유형 정보 없음"}`
        )
        .addTo(map);
    });

    map.on("mouseenter", "polygon-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    // 이벤트: 폴리곤에서 마우스를 벗어날 때 커서 초기화
    map.on("mouseleave", "polygon-layer", () => {
      map.getCanvas().style.cursor = "";
    });
 

    // GeoLocationControl 설정
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
        timeout: 6000,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
    });

    map.addControl(geolocate);

    // 빌딩 레이어 제거 함수
    const removeBuildingLayers = () => {
      const layersToRemove = [
        "buildings",
        "3d-buildings",
        "building",
        "building-number-label",
        "building-extrusion",
        "building-outline",
      ];

      layersToRemove.forEach((layer) => {
        if (map.getLayer(layer)) {
          map.removeLayer(layer);
        }
      });
    };

    // Point 레이어 제거 함수
    const removePointLayers = (sourceId) => {
      if (map.getLayer("point-layer")) {
        map.removeLayer("point-layer");
      }
      if (map.getSource(sourceId)) {
        map.removeSource(sourceId);
        console.log(`Source ${sourceId} removed.`);
      }
    };

    removePointLayersRef.current = removePointLayers;

    // GeoJSON 로드 함수
    const loadGeoJson = async (longitude, latitude) => {
      console.log("loadGeoJson 호출:", { longitude, latitude });
      try {
        const response = await fetch(
          `http://localhost:8080/around?longitude=${longitude}&latitude=${latitude}`
          // `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/around?longitude=${longitude}&latitude=${latitude}`
          
        );
        console.log("API 요청 완료");

        const result = await response.json();
        const geojsonbuilding = result.data;

        console.log("GeoJSON 데이터 로드 성공:", geojsonbuilding);

        if (
          !geojsonbuilding.features ||
          geojsonbuilding.features.length === 0
        ) {
          throw new Error("유효한 GeoJSON Feature가 없습니다.");
        }

        if (map.getSource("polygons")) {
          map.getSource("polygons").setData(geojsonbuilding);
          console.log("기존 소스 업데이트 완료");
        } else {
          map.addSource("polygons", { type: "geojson", data: geojsonbuilding });
          console.log("새로운 소스 추가 완료");

          map.addLayer({
            id: "polygon-layer",
            type: "fill",
            source: "polygons",
            paint: {
              "fill-color": "#888888",
              "fill-opacity": 0.4,
            },
          });
          console.log("폴리곤 레이어 추가 완료");

          map.addLayer({
            id: "polygon-outline-layer",
            type: "line",
            source: "polygons",
            paint: {
              "line-color": "#000000",
              "line-width": 2,
            },
          });
          console.log("폴리곤 아웃라인 레이어 추가 완료");
        }
      } catch (error) {
        console.error("GeoJSON 데이터 로드 실패:", error);
      }
    };

    loadGeoJsonRef.current = loadGeoJson;

    // Water JSON 로드 함수
    const loadWaterJson = async (polygon) => {
      console.log("loadWaterJson 호출:", { polygon });
      try {
        const response = await fetch(
          // `http://localhost:8080/waters?polygon=${polygon}`
          `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/waters?polygon=${polygon}`
        );
        console.log("API 요청 완료");

        const result = await response.json();
        const geojsonPoints = result.data;

        console.log("GeoJSON 데이터 로드 성공:", geojsonPoints);

        if (!geojsonPoints.features || geojsonPoints.features.length === 0) {
          throw new Error("유효한 GeoJSON Feature가 없습니다.");
        }

        const images = [
          {
            id: "water-type-1-icon",
            src: "/assets/images/map_icons/water/icon_water1.png",
          },
          {
            id: "water-type-2-icon",
            src: "/assets/images/map_icons/water/icon_water2.png",
          },
          {
            id: "water-type-3-icon",
            src: "/assets/images/map_icons/water/icon_water3.png",
          },
          {
            id: "water-type-4-icon",
            src: "/assets/images/map_icons/water/icon_water4.png",
          },
          {
            id: "water-type-5-icon",
            src: "/assets/images/map_icons/water/icon_water5.png",
          },
          {
            id: "water-type-6-icon",
            src: "/assets/images/map_icons/water/icon_water6.png",
          },
        ];

        images.forEach(({ id, src }) => {
          if (!map.hasImage(id)) {
            map.loadImage(src, (error, image) => {
              if (error) {
                console.error(`이미지 로드 실패: ${src}`, error);
                return;
              }
              map.addImage(id, image);
            });
          }
        });

        if (map.getSource("points")) {
          map.getSource("points").setData(geojsonPoints);
          console.log("기존 포인트 소스 업데이트 완료");
        } else {
          map.addSource("points", { type: "geojson", data: geojsonPoints });
          console.log("새로운 포인트 소스 추가 완료");

          map.addLayer({
            id: "point-layer",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": [
                "match",
                ["get", "type"],
                1,
                "water-type-1-icon",
                2,
                "water-type-2-icon",
                3,
                "water-type-2-icon",
                4,
                "water-type-2-icon",
                5,
                "water-type-2-icon",
                6,
                "water-type-2-icon",
                "water-type-1-icon",
              ],
              "icon-size": 1.0,
            },
          });
          console.log("포인트 레이어 추가 완료");
        }
      } catch (error) {
        console.error("GeoJSON 데이터 로드 실패:", error);
      }
    };

    loadWaterJsonRef.current = loadWaterJson;

    // Danger JSON 로드 함수
    const loadDangerJson = async (polygon) => {
      console.log("loadDangerJson 호출:", { polygon });
      try {
        const response = await fetch(
          // `http://localhost:8080/danger?polygon=${polygon}`
          `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/danger?polygon=${polygon}`
        );
        console.log("API 요청 완료");

        const result = await response.json();
        const geojsonPoints = result.data;

        console.log("GeoJSON 데이터 로드 성공:", geojsonPoints);

        if (!geojsonPoints.features || geojsonPoints.features.length === 0) {
          throw new Error("유효한 GeoJSON Feature가 없습니다.");
        }

        if (map.getSource("points")) {
          map.getSource("points").setData(geojsonPoints);
          console.log("기존 포인트 소스 업데이트 완료");
        } else {
          map.addSource("points", { type: "geojson", data: geojsonPoints });
          console.log("새로운 포인트 소스 추가 완료");

          const images = [
            {
              id: "harmfulness-type-1-icon",
              src: "/assets/images/map_icons/harmfulness/icon_harmfulness1.png",
            },
            {
              id: "harmfulness-type-2-icon",
              src: "/assets/images/map_icons/harmfulness/icon_harmfulness2.png",
            },
          ];

          images.forEach(({ id, src }) => {
            if (!map.hasImage(id)) {
              map.loadImage(src, (error, image) => {
                if (error) {
                  console.error(`이미지 로드 실패: ${src}`, error);
                  return;
                }
                map.addImage(id, image);
              });
            }
          });

          map.addLayer({
            id: "point-layer",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": [
                "case",
                ["!=", ["index-of", "주유소", ["get", "induty_nm"]], -1],
                "harmfulness-type-2-icon",
                ["!=", ["index-of", "자유", ["get", "induty_nm"]], -1],
                "harmfulness-type-1-icon",
                "harmfulness-type-1-icon",
              ],
              "icon-size": 1.0,
            },
          });
          console.log("포인트 레이어 추가 완료");
        }
      } catch (error) {
        console.error("GeoJSON 데이터 로드 실패:", error);
      }
    };

    loadDangerJsonRef.current = loadDangerJson;

    // 이벤트 리스너 설정
    map.on("load", () => {
      removeBuildingLayers();
    });

    geolocate.on("geolocate", (event) => {
      console.log("현재 위치:", event.coords);
    });

    geolocate.on("error", (error) => {
      console.error("위치 찾기 실패:", error);
    });

    // 언어팩 설정
    const language = new MapboxLanguage({
      defaultLanguage: mapConfig.defaultLanguage,
    });
    map.addControl(language);

    // 클린업 함수
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
      }
    };
  }, [mapContainerRef, defaultStyle, mapConfig]);

  return {
    map: mapInstance.current,
    mapboxgl,
    loadGeoJsonRef,
    loadWaterJsonRef,
    loadDangerJsonRef,
    removePointLayersRef,
    mapLoaded,
  };
};

export default useMap;
