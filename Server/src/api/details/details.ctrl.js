import detailsDao from "../details/details.dao.js";

/**
 * @swagger
 * tags:
 *   name: Details
 *   description: 건물 상세 정보 관련 API
 */

/**
 * @swagger
 * /api/details/{bldg_id}:   # /api 접두사 추가
 *   get:
 *     summary: 특정 건물 ID의 상세 정보 조회
 *     tags: [Details]
 *     parameters:
 *       - in: path
 *         name: bldg_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 건물 ID
 *     responses:
 *       200:
 *         description: 성공적으로 건물 상세 정보를 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: 잘못된 요청 (건물 ID가 누락됨)
 *       500:
 *         description: 서버 에러
 */
const getDetailByBldgId = async (req, res) => {
  const bldg_id = Number(req.params.bldg_id);

  if (!bldg_id) {
    res.status(400).json({ success: false, message: "bldg_id is required" });
    return;
  }
  try {
    const detail = await detailsDao.getDetailByBldgId(bldg_id);
    res.json({
      success: true,
      message: "User fetched successfully",
      data: detail.length === 0 ? [] : detail,
    });
  } catch (error) {
    console.error("Error in ctrl getDetailByBldgId", error);
    const errorMessage = error.message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};

/**
 * @swagger
 * /api/details:
 *   get:
 *     summary: 모든 건물의 상세 정보 조회
 *     tags: [Details]
 *     responses:
 *       200:
 *         description: 성공적으로 모든 건물 정보를 조회함
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User fetched successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       lotno_addr:
 *                         type: string
 *                         description: 지번 주소
 *                       road_nm_addr:
 *                         type: string
 *                         description: 도로명 주소
 *                       bldg_nm:
 *                         type: string
 *                         description: 건물명
 *                       gro_flo_co:
 *                         type: integer
 *                         description: 지상 층수
 *                       und_flo_co:
 *                         type: integer
 *                         description: 지하 층수
 *                       bdtyp:
 *                         type: string
 *                         description: 건물 유형
 *                       bdtyp_detail:
 *                         type: string
 *                         description: 건물 상세 유형
 *                       bdst:
 *                         type: string
 *                         description: 건물 상태
 *                       bdst_detail:
 *                         type: string
 *                         description: 건물 상세 상태
 *       500:
 *         description: 서버 에러
 */

const getDetailALL = async (req, res) => {
  try {
    const detail = await detailsDao.getDetailALL();
    res.json({
      success: true,
      message: "User fetched successfully",
      data: detail.length === 0 ? [] : detail,
    });
  } catch (error) {
    console.error("Error in ctrl getDetailALL", error);
    const errorMessage = error.message;
    res.status(500).json({ success: false, message: errorMessage });
  }
};
export default {
  getDetailByBldgId,
  getDetailALL,
};
