import React, {useRef} from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import useMap from "../hooks/useMap";
import {mapConfig} from "../config/mapConfig";

const MapBox =() => {
  console.log("!!")
  const mapContainerRef = useRef(null);

  useMap(mapContainerRef, mapConfig.defaultStyle , mapConfig);

  return <div ref ={mapContainerRef} style={{width : '100%', height : '100vh'}}/>
  // 'calc(100vh - 120px)'
}

function Map() {
  return (
    <>
      <Header />
      <div className="main_container">
        <MapBox/>
      </div>
      <Footer />
    </>
  );
}

export default Map;
