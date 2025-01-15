import React, { useState, useEffect } from "react";
import '../assets/css/login.css'
import { useNavigate } from "react-router-dom";


function Login() {
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true); // 인트로 상태 관리
  const [loginInfo, setLoginInfo] = useState({
    firestationCode: '',
    password: '',
  });
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false); // 1초 후 인트로를 숨김
    }, 1000);  // 1초 설정
    return () => clearTimeout(timer);
  }, []);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setLoginInfo({ ...loginInfo, [name]: value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userInfo = {
      fs_code: parseInt(e.target.firestationCode.value, 10),
      password: e.target.password.value
    };

    try {
      const response = await fetch ('http://localhost:8080/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userInfo)
      });
      const result = await response.json()
      console.log(result);
      console.log(userInfo);

      

      if (result.success === true) {
        alert("로그인에 성공하였습니다.");
        navigate('/main', { state: { fs_code: userInfo.fs_code } });

      } else {
        alert("소방서 코드와 비밀번호가 일치하지 않습니다.");
      }
    } catch(error) {
      console.error('Fetch error:', error);
    }
  }

  return (
    <>
    <div>
      {showIntro ? (
        <div className='intro'>
          <div className='logo_image' />
          <div className='intro_image' />
        </div>
      ) : (
        <div className='login'>
          <div className='logo_image' />
          <div className='login_wrap'>
            <form onSubmit={handleSubmit}>
              <input type='text' name='firestationCode' placeholder="소방서 코드" value={loginInfo.firestationCode} onChange={onChangeHandler} />
              <input type='password' name='password' placeholder="비밀번호"value={loginInfo.password} onChange={onChangeHandler} />
              <button type='submit'>로그인</button>
            </form>
          </div>
        </div>
      )}
    </div>
    </>
  );
}

export default Login;
