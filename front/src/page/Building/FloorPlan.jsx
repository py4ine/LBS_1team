import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Layout/Header";
import "../../assets/css/floorplan.css";
import FloorPlanBtn from "../../components/Detail/FloorPlanBtn";
import cctvIcon from "../../assets/images/button_icons/button_icons.png";
import { useSelector } from "react-redux";

function FloorPlan() {
  const navigate = useNavigate();
  const { bldgId, flplanId } = useParams(); // URL에서 case,flplan ID 가져오기 (찬진)

  // redux store에서 데이터 가져오기
  const currentCase = useSelector((state) => state.cases.currentCase);
  const { fs_code } = useSelector((state) => state.auth);
  const bldgDetail = useSelector((state) => state.cases.bldgDetail);
  // console.log("currnetCase: ", currentCase);

  // useState (찬진)
  const [flImages, setFlImages] = useState([]); // 모든 층의 이미지 데이터 저장
  const [currentFlImage, setCurrentFlImage] = useState(null); // 현재 보고있는 층의 이미지 데이터
  const [loading, setLoading] = useState(true); // 로딩
  const [error, setError] = useState(null); // 에러
  const [currentImage, setCurrentImage] = useState(""); // 현재 표시되는 이미지 url
  const [imagesLoaded, setImagesLoaded] = useState(false); // 이미지 프리로딩 완료 상태

  const [showCCTV, setShowCCTV] = useState(false);
  const [cctvIcons, setCctvIcons] = useState([]);
  const [showCounting, setShowCounting] = useState(false);
  const [countPerson, setCountPerson] = useState([]);

  const imageContainerRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef(null);

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      const initialDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );
      lastTouchRef.current = { initialDistance, scale };
    } else if (e.touches.length === 1) {
      const { pageX, pageY } = e.touches[0];
      lastTouchRef.current = { x: pageX, y: pageY };
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && lastTouchRef.current?.initialDistance) {
      const [touch1, touch2] = e.touches;
      const currentDistance = Math.hypot(
        touch2.pageX - touch1.pageX,
        touch2.pageY - touch1.pageY
      );
      const scaleChange =
        currentDistance / lastTouchRef.current.initialDistance;
      setScale(
        Math.min(Math.max(lastTouchRef.current.scale * scaleChange, 1), 5)
      );
    } else if (
      e.touches.length === 1 &&
      lastTouchRef.current?.x !== undefined
    ) {
      const { pageX, pageY } = e.touches[0];
      const deltaX = (pageX - lastTouchRef.current.x) * 0.5;
      const deltaY = (pageY - lastTouchRef.current.y) * 0.5;

      setTranslate((prev) => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY,
      }));

      lastTouchRef.current = { x: pageX, y: pageY };
    }
  };

  const handleTouchEnd = () => {
    lastTouchRef.current = null;
  };

  const [floorInfo, setFloorInfo] = useState({
    gro_flo_co: bldgDetail?.gro_flo_co || 1,
    und_flo_co: bldgDetail?.und_flo_co || 0,
  });
  // const [floorInfo, setFloorInfo] = useState({
  //   gro_flo_co: location.state?.gro_flo_co || 1,
  //   und_flo_co: location.state?.und_flo_co || 0,
  // });

  const currentFloor = flplanId ? Number(flplanId) : 1;

  useEffect(() => {
    const fetchFlImages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://node-kimhojun-dot-winged-woods-442503-f1.du.r.appspot.com/images/${bldgId}`
          // `https://lbsteam1.duckdns.org/api//images/${bldgId}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch fl images");
        }
        const result = await res.json();

        if (result.success) {
          setFlImages(result.data);

          const currentFlImage = result.data.find(
            (floor) => floor.flo_co === currentFloor
          );
          setCurrentFlImage(currentFlImage);

          const allImageUrls = result.data.reduce((urls, floor) => {
            return [
              ...urls,
              floor.flo_pl,
              floor.flo_stair,
              floor.flo_hydrant,
              floor.flo_elevator,
              floor.flo_window,
              floor.flo_enterance,
            ].filter(Boolean);
          }, []);

          const uniqueImageUrls = [...new Set(allImageUrls)];

          const imagePromises = uniqueImageUrls.map((url) => {
            if (!url) return Promise.resolve();
            return new Promise((resolve, reject) => {
              const img = new Image();
              img.onload = () => resolve(url);
              img.onerror = () => resolve(url);
              img.src = url;
            });
          });

          await Promise.all(imagePromises)
            .then(() => {
              setImagesLoaded(true);
              if (currentFlImage) {
                setCurrentImage(currentFlImage.flo_pl);
              }
            })
            .catch((err) => {
              console.error("Some images failed load:", err);
              setImagesLoaded(true);
              if (currentFlImage) {
                setCurrentImage(currentFlImage.flo_pl);
              }
            });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFlImages();
  }, [bldgId, currentFloor]);

  // url , location.state가 변경될때마다 층수정보 업데이트 useEffect (찬진)
  // useEffect(() => {
  //   if (!currentCase) {
  //     navigate("/main");
  //     return;
  //   }
  // }, [currentCase, navigate]);

  // useEffect(() => {
  //   if (
  //     location.state?.gro_flo_co !== undefined &&
  //     location.state?.und_flo_co !== undefined
  //   ) {
  //     setFloorInfo({
  //       gro_flo_co: Number(location.state.gro_flo_co),
  //       und_flo_co: Number(location.state.und_flo_co),
  //     });
  //   }
  // }, [location.state]);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleIconBtnClick = async (iconType) => {
    if (!currentFlImage) return;

    switch (iconType) {
      case "비상구":
        setCurrentImage(currentFlImage.flo_stair);
        setShowCCTV(false);
        setShowCounting(false);
        break;
      case "엘리베이터":
        setCurrentImage(currentFlImage.flo_elevator);
        setShowCCTV(false);
        setShowCounting(false);
        break;
      case "소화전":
        setCurrentImage(currentFlImage.flo_hydrant);
        setShowCCTV(false);
        setShowCounting(false);
        break;
      case "창문":
        setCurrentImage(currentFlImage.flo_window);
        setShowCCTV(false);
        setShowCounting(false);
        break;
      case "출입구":
        setCurrentImage(currentFlImage.flo_enterance);
        setShowCCTV(false);
        setShowCounting(false);
        break;
      case "CCTV":
        setShowCCTV(true);
        setShowCounting(false);
        const newCCTVIcon1 = {
          id: 1,
          x: "80%",
          y: "85.5%",
        };
        const newCCTVIcon2 = {
          id: 2,
          x: "65%",
          y: "60%",
        };
        setCctvIcons([newCCTVIcon1, newCCTVIcon2]);
        setCurrentImage(currentFlImage.flo_pl);
        break;
      case "인원수":
        setShowCCTV(false);
        setShowCounting(true);
        try {
          const count_response_1 = await fetch(
            "http://localhost:8000/counting/stream1"
          );
          const count_response_2 = await fetch(
            "http://localhost:8000/counting/stream2"
          );

          if (!count_response_1.ok) {
            throw new Error("Failed to fetch counting1");
          }
          if (!count_response_2.ok) {
            throw new Error("Failed to fetch counting2");
          }

          const count_result_1 = await count_response_1.json();
          console.log("이거뭐", count_result_1);
          const count_result_2 = await count_response_2.json();

          const newPerson1 = {
            id: 1,
            x: "80%",
            y: "85.5%",
            count: count_result_1.count,
          };
          const newPerson2 = {
            id: 2,
            x: "65%",
            y: "60%",
            count: count_result_2.count,
          };
          setCountPerson([newPerson1, newPerson2]);
          setCurrentImage(currentFlImage.flo_pl);
        } catch (err) {
          console.error("Failed to fetch counting data:", err);
        }
        break;
      default:
        setCurrentImage(currentFlImage.flo_pl);
        setShowCCTV(false);
        setShowCounting(false);
    }
  };

  const handleCloseFullScreen = () => {
    setIsFullScreen(false);
    if (currentFlImage) {
      setCurrentImage(currentFlImage.flo_pl);
    }
  };

  const handleFloorNavigation = (floor) => {
    navigate(`/map/${bldgId}/${floor}`);
  };

  const handleClick = () => {
    navigate(`/map/${bldgId}`); // 이동할 경로
    // navigate(`/map/${bldgId}`, {
    //   state: {
    //     caseData: caseData,
    //     fs_code: fs_code,
    //   },
    // });
  };

  const handleCCTVIconClick = (id) => {
    if (id === 1) {
      navigate("./cctv", {
        state: {
          caseData: caseData,
          fs_code: fs_code,
        },
      });
    } else if (id === 2) {
      navigate("./cctv2", {
        state: {
          caseData: caseData,
          fs_code: fs_code,
        },
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const buttonData = [
    { label: "비상구", key: "stair" },
    { label: "엘리베이터", key: "elevator" },
    { label: "소화전", key: "hydrant" },
    { label: "창문", key: "window" },
    { label: "출입구", key: "enterance" },
    { label: "CCTV", key: "cctv" },
    { label: "인원수", key: "person" },
  ];

  return (
    <>
      <Header />
      <div className="main_container floorplan_main_wrap">
        <div className="floorplan_main_container">
          <div className="css-x-button2" onClick={handleClick}></div>

          <FloorPlanBtn
            gro_flo_co={floorInfo.gro_flo_co}
            und_flo_co={floorInfo.und_flo_co}
            onFloorSelect={handleFloorNavigation}
            currentFloor={currentFloor}
          />

          <div
            className={`floorplan-image-container ${
              isFullScreen ? "fullscreen" : ""
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentImage && (
              <img
                src={currentImage}
                alt="설계도 이미지"
                className="floorplan-image"
                style={{
                  transform: `scale(${scale}) translate(${translate.x}px, ${translate.y}px)`,
                }}
              />
            )}
            {isFullScreen && (
              <button
                className="close-fullscreen"
                onClick={handleCloseFullScreen}
              >
                닫기
              </button>
            )}
            {showCCTV &&
              cctvIcons.map((icon) => (
                <div
                  key={icon.id}
                  className="cctv-icon"
                  style={{
                    position: "absolute",
                    top: icon.y,
                    left: icon.x,
                    width: "40px",
                    height: "40px",
                    backgroundImage: `url(${cctvIcon})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 15,
                  }}
                  onClick={() => handleCCTVIconClick(icon.id)}
                />
              ))}
            {showCounting &&
              countPerson.map((item) => (
                <div
                  key={item.id}
                  className="person-count"
                  style={{
                    position: "absolute",
                    top: item.y,
                    left: item.x,
                    zIndex: 15,
                  }}
                >
                  {item.count}
                </div>
              ))}
          </div>

          {!isFullScreen && (
            <div className="icon-buttons">
              {buttonData.map((button, index) => (
                <button
                  key={index}
                  onClick={() => handleIconBtnClick(button.label)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default FloorPlan;
