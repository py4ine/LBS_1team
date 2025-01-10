import dangerDao from './danger.dao.js';

// const getPoiByOriginId = async (req ,res) => {
//     const origin_id = Number(req.params.origin_id);

//     if(!origin_id) { 
//         res.status(400).json({success: false , message : 'origin_id is required'})
//         return
//     }
//     try{
//         const poi = await poiDao.getPoiByOriginId(origin_id);
//         //3항연산자
//         res.json({success : true , message : 'User fetched successfully' , data: poi.length === 0 ? [] : poi })

//     }catch(error){
//         console.error('Error in ctrl getPoiOriginid' , error);
//         const errorMessage = error.message;
//         res.status(500).json({success:false , message : errorMessage})
//     }
// }

const getdangerALL = async (req ,res) => {

    try{
        const { longitude, latitude } = req.query;

        // 유효성 검사
        if (!longitude || !latitude) {
            return res.status(400).json({
                success: false,
                message: 'longitude and latitude are required'
            });
        }
        const poi = await dangerDao.getdangerALL(longitude, latitude);
        //3항연산자
        res.json({
            success: true,
            message: 'Data fetched successfully',
            data: poi.length === 0 ? [] : poi
        });

    }catch(error){
        console.error('Error in ctrl getdangerALL' , error);
        const errorMessage = error.message;
        res.status(500).json({success:false , message : errorMessage})
    }
}

export default {
    getdangerALL
}
