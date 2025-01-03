import loginDao from './loginDao.js'

const login = async (req, res) => {
    const { fsc, pass } = req.body;

    if (!fsc || !pass) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const loginResult = await loginDao.login();
        const userCode = loginResult.find(user => user.code === fsc);
        const userPass = userCode ? userCode.pass : undefined;

        if (userPass === pass) {
            console.log("Login Matched");
            res.json({success: true, message: "Login Successfully"})
        } else {
            console.log("Login Not Matched");
            res.json({success: false, message: "Login Rejected"})
        }
        
    } catch (error) {
        console.error("Error in Ctrl login:", error);
    }
};

export default { login };