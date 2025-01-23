import aroundDao from "./around.dao.js";

/**
 * @swagger
 * tags:
 *   - name: Around
 *     description: 주변 건물 정보 관련 API
 */

// getAroundALL 함수 바로 위에 추가
/**
 * @swagger
 * /api/around:
 *   get:
 *     summary: 주변 건물 정보 조회
 *     tags: [Around]
 *     parameters:
 *       - in: query
 *         name: longitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 경도
 *       - in: query
 *         name: latitude
 *         required: true
 *         schema:
 *           type: number
 *         description: 위도
 *     responses:
 *       200:
 *         description: 주변 건물 정보 조회 성공
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

const getAroundALL = async (req, res) => {
  try {
    const { longitude, latitude } = req.query;

    // 유효성 검사
    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message: "longitude and latitude are required",
      });
    }
    const poi = await aroundDao.getAroundALL(longitude, latitude);
    //3항연산자
    res.json({
      success: true,
      message: "Data fetched successfully",
      data: poi.length === 0 ? [] : poi,
    });
  } catch (error) {
    console.error("Error in ctrl getIncidentALL", error);
    const errorMessage = error.message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export default {
  getAroundALL,
};
