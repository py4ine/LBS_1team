import waterDao from "../waters/water.dao.js";

/**
 * @swagger
 * tags:
 *   - name: Waters
 *     description: 소방용수 관련 API
 */

// getWaterALL 함수 바로 위에 추가
/**
 * @swagger
 * /api/waters:
 *   get:
 *     summary: 소방용수 정보 조회
 *     tags: [Waters]
 *     parameters:
 *       - in: query
 *         name: polygon
 *         required: true
 *         schema:
 *           type: string
 *         description: 조회할 영역의 WKT 형식 폴리곤 문자열
 *     responses:
 *       200:
 *         description: 소방용수 정보 조회 성공
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

const getPoiByOriginId = async (req, res) => {
  const origin_id = Number(req.params.origin_id);

  if (!origin_id) {
    res.status(400).json({ success: false, message: "origin_id is required" });
    return;
  }
  try {
    const poi = await poiDao.getPoiByOriginId(origin_id);
    //3항연산자
    res.json({
      success: true,
      message: "User fetched successfully",
      data: poi.length === 0 ? [] : poi,
    });
  } catch (error) {
    console.error("Error in ctrl getPoiOriginid", error);
    const errorMessage = error.message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};

const getWaterALL = async (req, res) => {
  try {
    const { polygon } = req.query;

    console.log("Received query:", req.query); // 디버깅 로그

    if (!polygon) {
      return res.status(400).json({
        success: false,
        message: "polygon query parameter is required",
      });
    }

    // polygon 값을 DAO로 전달
    const poi = await waterDao.getWaterALL(polygon);

    res.json({
      success: true,
      message: "Data fetched successfully",
      data: poi.length === 0 ? [] : poi,
    });
  } catch (error) {
    console.error("Error in ctrl getWaterALL", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getWaterALL,
};
