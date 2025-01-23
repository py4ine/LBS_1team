import loginDao from "./login.dao.js";

// 파일 최상단에 추가
/**
 * @swagger
 * tags:
 *   - name: Login
 *     description: 사용자 인증 관련 API
 */

// login 함수 바로 위에 추가
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [Login]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fs_code
 *               - password
 *             properties:
 *               fs_code:
 *                 type: integer
 *                 description: 소방서 코드
 *               password:
 *                 type: string
 *                 description: 비밀번호
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       400:
 *         description: 잘못된 요청
 *       500:
 *         description: 서버 에러
 */

const login = async (req, res) => {
  const { fs_code, password } = req.body;

  if (!fs_code || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  try {
    const loginResult = await loginDao.login(); // 데이터 호출
    console.log("Login Result:", loginResult);

    // fs_code와 일치하는 사용자 검색
    const user = loginResult.find((user) => user.fs_code === Number(fs_code));

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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export default { login };
