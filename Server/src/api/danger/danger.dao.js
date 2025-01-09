import { db, schema } from '../../config/dbConfig.js';

// const getPoiByOriginId = async (origin_id) => {
//     const query = `
//         SELECT 
//             bldg_id,
//             bldg_sn,
//             rds_sn,
//             sig_cd,
//             emd_cd,
//             lotno_addr,
//             road_nm_addr,
//             COALESCE(bldg_nm::text , '') as bldg_nm,
//             ST_asText(bldg_geom) as wkt,
//             gro_flo_co,
//             und_flo_co,
//             bdtyp_cd,
//             TO_CHAR(crt_dt AT TIME ZONE 'Asia/seoul' , 'YYYY-MM-DD HH24:Mi:SS.USOF') AS crt_dt,
//             COALESCE(TO_CHAR(mdfcn_dt AT TIME ZONE 'Asia/seoul' ,'YYYY-MM-DD HH24:Mi:SS.USOF' ), '') as mdfcn_dt,
//             COALESCE(TO_CHAR(recent_poi_dtl_crt_dt AT TIME ZONE 'Asia/seoul' ,'YYYY-MM-DD HH24:Mi:SS.USOF' ), '') as recent_poi_dtl_crt_dt
//             FROM ${schema}.bldg
//         where bldg_id = $1
//     `;
//     try {
//         console.log('Executing query:', query);
//         console.log('With parameters:', [origin_id]);

//         const result = await db.query(query, [origin_id]);

//         // 쿼리 결과 로그
//         console.log('Query Result:', result.rows);

//         return result.rows;
//     } catch (error) {
//         console.error('Error DAO getPoiByOriginId', error);
//         throw new Error(error.message);
//     }
// };

// const getPoiALL = async () => {
//     const query = `
//         SELECT
//             json_build_object(
//                 'type', 'Feature',
//                 'geometry', ST_AsGeoJSON(bldg_geom)::json,
//                 'properties', json_build_object(
                    
//                 )
//             ) AS feature
//         FROM ${schema}.bldg;
//     `;
//     try {
//         console.log('Executing query:', query);

//         const result = await db.query(query);

//         // GeoJSON FeatureCollection 형태로 데이터 변환
//         const geojson = {
//             type: 'FeatureCollection',
//             features: result.rows.map(row => row.feature) // 각 행의 feature를 묶음
//         };

//         // console.log('GeoJSON Result:', geojson);

//         return geojson;
//     } catch (error) {
//         console.error('Error DAO getPoiALL', error);
//         throw new Error(error.message);
//     }
// };

// const getPoiByOriginId = async (origin_id) => {
//     const query = `
//         SELECT 
//             bldg_id,
//             bldg_sn,
//             rds_sn,
//             sig_cd,
//             emd_cd,
//             lotno_addr,
//             road_nm_addr,
//             COALESCE(bldg_nm::text , '') as bldg_nm,
//             ST_asText(bldg_geom) as wkt,
//             gro_flo_co,
//             und_flo_co,
//             bdtyp_cd,
//             TO_CHAR(crt_dt AT TIME ZONE 'Asia/seoul' , 'YYYY-MM-DD HH24:Mi:SS.USOF') AS crt_dt,
//             COALESCE(TO_CHAR(mdfcn_dt AT TIME ZONE 'Asia/seoul' ,'YYYY-MM-DD HH24:Mi:SS.USOF' ), '') as mdfcn_dt,
//             COALESCE(TO_CHAR(recent_poi_dtl_crt_dt AT TIME ZONE 'Asia/seoul' ,'YYYY-MM-DD HH24:Mi:SS.USOF' ), '') as recent_poi_dtl_crt_dt
//             FROM ${schema}.bldg_team1
//         where bldg_id = $1
//     `;
//     try {
//         console.log('Executing query:', query);
//         console.log('With parameters:', [origin_id]);

//         const result = await db.query(query, [origin_id]);

//         // 쿼리 결과 로그
//         console.log('Query Result:', result.rows);

//         return result.rows;
//     } catch (error) {
//         console.error('Error DAO getPoiByOriginId', error);
//         throw new Error(error.message);
//     }
// };

const getdangerALL = async (longitude, latitude) => {
    const query = `
        SELECT
            json_build_object(
                'type', 'Feature',
                'geometry', ST_AsGeoJSON(danger_geom)::json,
                'properties', json_build_object(
                    'entrps_nm', entrps_nm,
                    'induty_nm', induty_nm,
                    'rn_adres', rn_adres
                )
            ) AS feature
        FROM ${schema}.facilitie_danger
        WHERE ST_DWithin(
            danger_geom, 
            ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography, 
            200
        );
    `;
    try {

        const result = await db.query(query, [longitude, latitude]);

        // GeoJSON FeatureCollection 형태로 데이터 변환
        const geojson = {
            type: 'FeatureCollection',
            features: result.rows.map(row => row.feature) // 각 행의 feature를 묶음
        };

        return geojson;
    } catch (error) {
        console.error('Error DAO getdangerALL', error);
        throw new Error(error.message);
    }
};


export default {
    getdangerALL
};
