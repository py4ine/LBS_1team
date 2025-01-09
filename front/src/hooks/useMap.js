// import { useEffect } from "react";
// import mapboxgl from 'mapbox-gl'
// import MapboxLanguage from "@mapbox/mapbox-gl-language";

// mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

// const useMap = (mapContainerRef , style , config) => {
//     useEffect(() => {
        
//         const map = new mapboxgl.Map({
//             container: mapContainerRef.current,
//             style : style,
//             center : config.initialCenter,
//             zoom : config.initialZoom,
//         })
//         // GeoLocationControl 추가 (내위치)
//         const geolocateControl = new mapboxgl.GeolocateControl({
//         positionOptions: {
//           enableHighAccuracy: true, // GPS 정확도를 높게 설정
//         },
//         trackUserLocation: true, // 사용자 위치 계속 추적
//         showUserHeading: true, // 사용자의 방향 표시
//         showAccuracyCircle: false,//내 위치 주위 반경 삭제코드
//         });
//         // 맵에 컨트롤 추가
//         map.addControl(geolocateControl);
//         const removeBuildingLayers = () => {
//             // 빌딩 레이어가 존재하는 경우에만 제거
//             if (map.getLayer('buildings')) {
//                 map.removeLayer('buildings');
//             }
//             if (map.getLayer('3d-buildings')) {
//                 map.removeLayer('3d-buildings');
//             }
//             // composite 소스의 building 레이어도 제거
//             if (map.getLayer('building')) {
//                 map.removeLayer('building');
//             }
//             // 추가적인 빌딩 관련 레이어들
//             const buildingLayers = [
//                 'building-number-label',
//                 'building-extrusion',
//                 'building-outline'
//             ];
            
//             buildingLayers.forEach(layer => {
//                 if (map.getLayer(layer)) {
//                     map.removeLayer(layer);
//                 }
//             });
//         }
//             // 맵이 로드된 후 geoLocate 이벤트 리스너 추가
//             map.on("load", () => {
//                 removeBuildingLayers();
//             });
        
//             // 5. 위치 찾기 성공/실패 이벤트 처리
//             geolocateControl.on("geolocate", (event) => {
//                 console.log("현재 위치:", event.coords);
        
//                 // 반경 원 스타일 수정 코드 추가
//                 //   const accuracyCircle = document.querySelector(
//                 //     ".mapboxgl-user-location-accuracy-circle"
//                 //   );
//                 //   if (accuracyCircle) {
//                 //     accuracyCircle.style.width = "10px"; // 원하는 크기로 조절
//                 //     accuracyCircle.style.height = "10px";
//                 //     // 또는
//                 //     // accuracyCircle.style.display = 'none';  // 완전히 숨기기
//                 //   }
//             });
        
//             geolocateControl.on("error", (error) => {
//                 console.error("위치 찾기 실패:", error);
//             });
//         // 언어팩 설정
//         const language = new MapboxLanguage({
//             defaultLanguage : config.defaultLanguage,
//         })
//         map.addControl(language);
//         // 컴포넌트가 언마운트 될때 없애라
//         return () => map.remove();
//     },[mapContainerRef , style , config])
// }
// export default useMap;





import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const useMap = (mapContainerRef, style, config) => {
  const mapRef = useRef(null); // Map 객체 저장
  const loadGeoJsonRef = useRef(null); // loadGeoJson 함수 저장
  const loadWaterJsonRef = useRef(null); // loadGeoJson 함수 저장
  const loadDangerJsonRef = useRef(null); // loadGeoJson 함수 저장
  const removePointLayersRef  = useRef(null); // loadGeoJson 함수 저장

    console.log("4")
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: style,
      center: config.initialCenter,
      zoom: config.initialZoom,
    });
    console.log("5")

    mapRef.current = map;

    const geolocateControl = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
    });

    map.addControl(geolocateControl);

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

    const removePointLayers = (sourceId) => {
        console.log(`1`);
        map.removeLayer("point-layer"); // 레이어 제거
      
    
      if (map.getSource(sourceId)) {
        console.log(`2`);
        map.removeSource(sourceId); // 소스 제거
        console.log(`Source ${sourceId} removed.`);
      }
    };

    removePointLayersRef.current = removePointLayers;


    const loadGeoJson = async (longitude, latitude) => {
        console.log("loadGeoJson 호출:", { longitude, latitude });
        try {
          const response = await fetch(`http://localhost:8080/around?longitude=${longitude}&latitude=${latitude}`);
          console.log("API 요청 완료");
      
          const result = await response.json();
          const geojsonbuilding = result.data;
      
          console.log("GeoJSON 데이터 로드 성공:", geojsonbuilding);
      
          if (!geojsonbuilding.features || geojsonbuilding.features.length === 0) {
            throw new Error("유효한 GeoJSON Feature가 없습니다.");
          }
      
          if (map.getSource("polygons")) {
            map.getSource("polygons").setData(geojsonbuilding); // 기존 소스 업데이트
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
      
    // loadGeoJson()
    // loadGeoJsonRef에 함수 저장
    loadGeoJsonRef.current = loadGeoJson;

    const loadWaterJson = async (longitude, latitude) => {
      console.log("loadWaterJson 호출:", { longitude, latitude });
      try {
        const response = await fetch(`http://localhost:8080/waters?longitude=${longitude}&latitude=${latitude}`);
        console.log("API 요청 완료");
    
        const result = await response.json();
        const geojsonPoints = result.data;
    
        console.log("GeoJSON 데이터 로드 성공:", geojsonPoints);
    
        if (!geojsonPoints.features || geojsonPoints.features.length === 0) {
          throw new Error("유효한 GeoJSON Feature가 없습니다.");
        }
    
        // 이미지 추가 (type 1, 2 아이콘 추가)
        const images = [
          { id: "water-type-1-icon", src: "/water/icon_water1.png" },
          { id: "water-type-2-icon", src: "/water/icon_water2.png" },
          { id: "water-type-3-icon", src: "/water/icon_water3.png" },
          { id: "water-type-4-icon", src: "/water/icon_water4.png" },
          { id: "water-type-5-icon", src: "/water/icon_water5.png" },
          { id: "water-type-6-icon", src: "/water/icon_water6.png" },
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
    
        // 기존 소스가 있으면 업데이트
        if (map.getSource("points")) {
          map.getSource("points").setData(geojsonPoints); // 기존 소스 업데이트
          console.log("기존 포인트 소스 업데이트 완료");
        } else {
          // 새로운 소스 추가
          map.addSource("points", { type: "geojson", data: geojsonPoints });
          console.log("새로운 포인트 소스 추가 완료");
    
          // 포인트 레이어 추가
          map.addLayer({
            id: "point-layer",
            type: "symbol", // symbol 타입으로 변경
            source: "points",
            layout: {
              "icon-image": [
                "match",
                ["get", "type"], // properties.type 값을 가져옴
                1,
                "water-type-1-icon", // type이 1일 경우 이 아이콘 사용
                2,
                "water-type-2-icon", // type이 2일 경우 이 아이콘 사용
                3,
                "water-type-2-icon", // type이 2일 경우 이 아이콘 사용
                4,
                "water-type-2-icon", // type이 2일 경우 이 아이콘 사용
                5,
                "water-type-2-icon", // type이 2일 경우 이 아이콘 사용
                6,
                "water-type-2-icon", // type이 2일 경우 이 아이콘 사용
                "water-type-1-icon", // 기본값 (type이 다른 값일 경우)
              ],
              "icon-size": 0.5, // 아이콘 크기 조정
            },
          });
          console.log("포인트 레이어 추가 완료");
        }
      } catch (error) {
        console.error("GeoJSON 데이터 로드 실패:", error);
      }
    };
    
    
      
    // loadGeoJson()
    // loadGeoJsonRef에 함수 저장
    loadWaterJsonRef.current = loadWaterJson;


    const loadDangerJson = async (longitude, latitude) => {
      console.log("loadDangerJson 호출:", { longitude, latitude });
      try {
        const response = await fetch(`http://localhost:8080/danger?longitude=${longitude}&latitude=${latitude}`);
        console.log("API 요청 완료");
    
        const result = await response.json();
        const geojsonPoints = result.data;
    
        console.log("GeoJSON 데이터 로드 성공:", geojsonPoints);
    
        if (!geojsonPoints.features || geojsonPoints.features.length === 0) {
          throw new Error("유효한 GeoJSON Feature가 없습니다.");
        }
    
        if (map.getSource("points")) {
          map.getSource("points").setData(geojsonPoints); // 기존 소스 업데이트
          console.log("기존 포인트 소스 업데이트 완료");
        } else {
          map.addSource("points", { type: "geojson", data: geojsonPoints });
          console.log("새로운 포인트 소스 추가 완료");
    

          const images = [
            { id: "harmfulness-type-1-icon", src: "/harmfulness/icon_harmfulness1.png" },
            { id: "harmfulness-type-2-icon", src: "/harmfulness/icon_harmfulness2.png" }
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
          // 포인트 레이어 추가
          map.addLayer({
            id: "point-layer",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": [
                "case",
                ["!=", ["index-of", "주유소", ["get", "induty_nm"]], -1], // "주유소"가 포함되어 있는 경우
                "harmfulness-type-2-icon",
                ["!=", ["index-of", "자유", ["get", "induty_nm"]], -1], // "카페"가 포함되어 있는 경우
                "harmfulness-type-1-icon",
                "harmfulness-type-1-icon" // 기본값
              ],
              "icon-size": 0.5, // 아이콘 크기 조정
            },
          });
          console.log("포인트 레이어 추가 완료");
        }
      } catch (error) {
        console.error("GeoJSON 데이터 로드 실패:", error);
      }
    };

      
    // loadGeoJson()
    // loadGeoJsonRef에 함수 저장
    loadDangerJsonRef.current = loadDangerJson;

    

    map.on("load", () => {
      removeBuildingLayers();
    });

    return () => map.remove();
  }, [mapContainerRef, style, config]);

  return { loadGeoJsonRef, loadWaterJsonRef, loadDangerJsonRef, removePointLayersRef };// loadGeoJson 함수 반환
};

export default useMap;
