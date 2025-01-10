import imagesDao from '../images/images.dao.js'

const getImagesByBldgId = async (req ,res) => {
    const bldg_id = Number(req.params.bldg_id);

    if(!bldg_id) { 
        res.status(400).json({success: false , message : 'bldg_id is required'})
        return
    }
    try{
        const detail = await imagesDao.getImagesByBldgId(bldg_id);
        res.json({success : true , message : 'User fetched successfully' , data: detail.length === 0 ? [] : detail })

    }catch(error){
        console.error('Error in ctrl getImagesByBldgId' , error);
        const errorMessage = error.message;
        res.status(500).json({success:false , message : errorMessage})
    }
}

const getDetailALL = async (req ,res) => {

    try{
        const detail = await detailsDao.getDetailALL();
        res.json({success : true , message : 'User fetched successfully' , data: detail.length === 0 ? [] : detail })

    }catch(error){
        console.error('Error in ctrl getDetailALL' , error);
        const errorMessage = error.message;
        res.status(500).json({success:false , message : errorMessage})
    }
}
export default {
    getImagesByBldgId,
    
}
