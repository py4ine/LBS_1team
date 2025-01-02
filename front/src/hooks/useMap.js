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