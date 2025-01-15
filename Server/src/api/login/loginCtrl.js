import loginDao from './loginDao.js'

const login = async (req, res) => {
    const { fs_code, password } = req.body;

    if (!fs_code || !password) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const loginResult = await loginDao.login(); // 데이터 호출
        console.log("Login Result:", loginResult);
      
        // fs_code와 일치하는 사용자 검색
        const user = loginResult.find(user => user.fs_code === Number(fs_code));
      
        if (!user) {
          // 사용자를 찾지 못한 경우
          console.log("User not found");
          return res.json({ success: false, message: "User not found" });
        }
      
        console.log("Matched User:", user);
      
        // 비밀번호 확인
        if (user.password === password) {
          console.log("Login Matched");
          return res.json({ success: true, message: "Login Successfully" });
        } else {
          console.log("Login Not Matched");
          return res.json({ success: false, message: "Invalid password" });
        }
      } catch (error) {
        console.error("Error during login process:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
      }
      
};

export default { login };