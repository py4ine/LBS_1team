import casesDao from "./cases.dao.js";

/**
 * @swagger
 * tags:
 *   - name: Cases
 *     description: 사건/사고 관련 API
 */

// getCasesALL 함수 바로 위에 추가
/**
 * @swagger
 * /api/cases:
 *   get:
 *     summary: 사건/사고 정보 조회
 *     tags: [Cases]
 *     parameters:
 *       - in: query
 *         name: dispatch_fire_station
 *         required: true
 *         schema:
 *           type: string
 *         description: 출동 소방서 코드
 *     responses:
 *       200:
 *         description: 사건/사고 정보 조회 성공
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
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       case_id:
 *                         type: integer
 *                       incident_type:
 *                         type: string
 *                       is_resolved:
 *                         type: boolean
 */

const getCasesALL = async (req, res) => {
  try {
    const { dispatch_fire_station } = req.query;

    // 유효성 검사
    if (!dispatch_fire_station) {
      return res.status(400).json({
        success: false,
        message: "dispatch_fire_station are required",
      });
    }
    const poi = await casesDao.getCasesALL(dispatch_fire_station);
    console.log(poi);
    //3항연산자
    res.json({
      success: true,
      message: "Data fetched successfully",
      data: poi.length === 0 ? [] : poi,
    });
  } catch (error) {
    console.error("Error in ctrl getCasestALL", error);
    const errorMessage = error.message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export default {
  getCasesALL,
};
