import React, { useState, useEffect } from "react";
import "../assets/css/login.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce, Slide } from "react-toastify"; // toast추가 (찬진)
import { useDispatch, useSelector } from "react-redux";
import { loginFail, loginSuccess } from "../store/slice/authSlice";
import { setLoading } from "../store/slice/uiSlice";
import "react-toastify/dist/ReactToastify.css"; // CSS import 추가

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // 추가(찬진)
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated); // redux store 에서 인증상태 가져오기
  const [showIntro, setShowIntro] = useState(true); // 인트로 상태 관리
  const [loginInfo, setLoginInfo] = useState({
    firestationCode: "",
    password: "",
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false); // 1초 후 인트로를 숨김
    }, 1000); // 1초 설정
    return () => clearTimeout(timer);
  }, []);

  // 인증 상태 감시
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate("/main");
  //   }
  // }, [isAuthenticated, navigate]);

  // 토스트 메시지 설정 (찬진)
  const successToast = () =>
    toast.success("로그인에 성공하였습니다", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
      style: {
        // borderRadius: "10px",
        backgroundColor: "#141e28",
        color: "white",
      },
    });

  const errToast = () =>
    toast.error("소방서 코드와 비밀번호가 일치하지 않습니다.", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Slide,
      style: {
        // borderRadius: "10px",
        backgroundColor: "#141e28",
        color: "white",
      },
    });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 로딩 상태 설정
    dispatch(setLoading(true));

    // 입력값 검증 추가
    if (!loginInfo.firestationCode || !loginInfo.password) {
      errToast();
      dispatch(setLoading(false));
      return;
    }

    // (전)
    // const userInfo = {
    //   fs_code: parseInt(e.target.firestationCode.value, 10),
    //   password: e.target.password.value,
    // };

    // (후)
    const userInfo = {
      fs_code: parseInt(loginInfo.firestationCode, 10),
      password: loginInfo.password,
    };

    // fs_code가 유효한 숫자인지 확인
    if (isNaN(userInfo.fs_code)) {
      errToast();
      dispatch(setLoading(false));
      return;
    }

    try {
      const response = await fetch(
        // "https://lbsteam1.duckdns.org/api/login",
        "http://localhost:8080/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userInfo),
        }
      );

      if (!response.ok) {
        throw new Error("서버 응답 오류");
      }

      const result = await response.json();
      // console.log(result);
      // console.log(userInfo);
      console.log("response: ", result);
      console.log("userinfo: ", userInfo);

      if (result.success === true) {
        // alert("로그인에 성공하였습니다.");
        // 로그인 성공 toast
        successToast();

        // 로그인 성공시 redux 상태 업데이트
        dispatch(loginSuccess({ fs_code: userInfo.fs_code }));

        // setTimeout(() => {
        //   navigate("/main", { state: { fs_code: userInfo.fs_code } });
        // }, 1500);
        setTimeout(() => {
          navigate("/main");
        }, 1500);
      } else {
        // alert("소방서 코드와 비밀번호가 일치하지 않습니다.");
        // 로그인 실패시 redux 상태 업데이트
        dispatch(loginFail(result.message || "로그인 실패")); // result mesage 사용
        errToast();
      }
    } catch (error) {
      console.error("Fetch error:", err);
      dispatch(loginFail(error.message));
      errToast(); // 네트워크 오류시에도 toast
    } finally {
      // 로딩 상태 해제
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <div>
        {showIntro ? (
          <div className="intro">
            <div className="logo_image" />
            <div className="intro_image" />
          </div>
        ) : (
          <div className="login">
            <div className="logo_image" />
            <div className="login_wrap">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="firestationCode"
                  placeholder="소방서 코드"
                  value={loginInfo.firestationCode}
                  onChange={onChangeHandler}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="비밀번호"
                  value={loginInfo.password}
                  onChange={onChangeHandler}
                />
                <button type="submit">로그인</button>
              </form>
            </div>
          </div>
        )}
        {/* toast (찬진) */}
        <ToastContainer
          style={{
            width: "375px",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </div>
    </>
  );
}

export default Login;
