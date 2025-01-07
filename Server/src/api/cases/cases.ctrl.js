import casesDao from './cases.dao.js'

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

const getCasesALL = async (req ,res) => {

    try{
        const {dispatch_fire_station} = req.query;
        
        // 유효성 검사
        if (!dispatch_fire_station) {
            return res.status(400).json({
                success: false,
                message: 'dispatch_fire_station are required'
            });
        }
        const poi = await casesDao.getCasesALL(dispatch_fire_station);
        console.log(poi)
        //3항연산자
        res.json({
            success: true,
            message: 'Data fetched successfully',
            data: poi.length === 0 ? [] : poi
        });

    }catch(error){
        console.error('Error in ctrl getCasestALL' , error);
        const errorMessage = error.message;
        res.status(500).json({success:false , message : errorMessage})
    }
}

export default {
    getCasesALL
}
