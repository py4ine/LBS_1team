import dangerDao from "./danger.dao.js";

/**
 * @swagger
 * tags:
 *   - name: Danger
 *     description: 위험시설물 관련 API
 */

// getdangerALL 함수 바로 위에 추가
/**
 * @swagger
 * /api/danger:
 *   get:
 *     summary: 위험시설물 정보 조회
 *     tags: [Danger]
 *     parameters:
 *       - in: query
 *         name: polygon
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 영역의 WKT 형식 폴리곤 문자열
 *     responses:
 *       200:
 *         description: 위험시설물 정보 조회 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: FeatureCollection
 *                     features:
 *                       type: array
 */

const getdangerALL = async (req, res) => {
  try {
    const { polygon } = req.query;

    // 유효성 검사
    if (!polygon) {
      return res.status(400).json({
        success: false,
        message: "longitude and latitude are required",
      });
    }
    const poi = await dangerDao.getdangerALL(polygon);
    //3항연산자
    res.json({
      success: true,
      message: "Data fetched successfully",
      data: poi.length === 0 ? [] : poi,
    });
  } catch (error) {
    console.error("Error in ctrl getdangerALL", error);
    const errorMessage = error.message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export default {
  getdangerALL,
};
