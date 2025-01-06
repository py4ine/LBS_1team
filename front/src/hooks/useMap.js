import { useEffect } from "react";
import mapboxgl from 'mapbox-gl'
import MapboxLanguage from "@mapbox/mapbox-gl-language";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const useMap = (mapContainerRef , style , config) => {
    useEffect(() => {
        
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style : style,
            center : config.initialCenter,
            zoom : config.initialZoom,
        })
        // GeoLocationControl 추가 (내위치)
        const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true, // GPS 정확도를 높게 설정
        },
        trackUserLocation: true, // 사용자 위치 계속 추적
        showUserHeading: true, // 사용자의 방향 표시
        showAccuracyCircle: false,//내 위치 주위 반경 삭제코드
        });
        // 맵에 컨트롤 추가
        map.addControl(geolocateControl);
        const removeBuildingLayers = () => {
            // 빌딩 레이어가 존재하는 경우에만 제거
            if (map.getLayer('buildings')) {
                map.removeLayer('buildings');
            }
            if (map.getLayer('3d-buildings')) {
                map.removeLayer('3d-buildings');
            }
            // composite 소스의 building 레이어도 제거
            if (map.getLayer('building')) {
                map.removeLayer('building');
            }
            // 추가적인 빌딩 관련 레이어들
            const buildingLayers = [
                'building-number-label',
                'building-extrusion',
                'building-outline'
            ];
            
            buildingLayers.forEach(layer => {
                if (map.getLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
        }
            // 맵이 로드된 후 geoLocate 이벤트 리스너 추가
            map.on("load", () => {
                removeBuildingLayers();
            });
        
            // 5. 위치 찾기 성공/실패 이벤트 처리
            geolocateControl.on("geolocate", (event) => {
                console.log("현재 위치:", event.coords);
        
                // 반경 원 스타일 수정 코드 추가
                //   const accuracyCircle = document.querySelector(
                //     ".mapboxgl-user-location-accuracy-circle"
                //   );
                //   if (accuracyCircle) {
                //     accuracyCircle.style.width = "10px"; // 원하는 크기로 조절
                //     accuracyCircle.style.height = "10px";
                //     // 또는
                //     // accuracyCircle.style.display = 'none';  // 완전히 숨기기
                //   }
            });
        
            geolocateControl.on("error", (error) => {
                console.error("위치 찾기 실패:", error);
            });
        // 언어팩 설정
        const language = new MapboxLanguage({
            defaultLanguage : config.defaultLanguage,
        })
        map.addControl(language);
        // 컴포넌트가 언마운트 될때 없애라
        return () => map.remove();
    },[mapContainerRef , style , config])
}
export default useMap;