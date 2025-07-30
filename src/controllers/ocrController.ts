import { Request, Response } from "express"
import { ERROR_MESSAGES, HTTP_STATUS, SUCCESS_MESSAGES } from "../shared/constants"
import { extractAadhaarInfo } from "../services/formatAadharData";
import { extractTextFromImages } from "../services/textExtraction";
import { greyscaleImage } from "../services/greyScaleImage";
import { OcrDto } from "../shared/dtos";
import { AadharModel } from "../models/schema/aadhar_schema";
import cloudinary from "../config/cloudinary";



export const handleDeleteImage = (async(req:Request,res:Response)=>{
    const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({ success: false, message: "Missing publicId" });
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      throw new Error("Delete failed");
    }
    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    res.status(500).json({ success: false, message: "Deletion failed" });
  }
});


export async function  handleOcr(req:Request,res:Response){
    try{
       const {frontImage,backImage} = req.body
        if (!frontImage || !backImage) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: ERROR_MESSAGES.NO_FILE_UPLOADED
            })
            return;
        }

        const frontBuffer = await greyscaleImage(frontImage);
        const backBuffer = await greyscaleImage(backImage);

        const { frontText, backText } = await extractTextFromImages(frontBuffer, backBuffer);
        console.log("front textss",frontText)
        const parsedData = extractAadhaarInfo(frontText, backText);

        if(!parsedData.aadhaarNumber){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: ERROR_MESSAGES.INVALID_AADHAAR_NUMBER
            })
            return ;
        }

        res.status(HTTP_STATUS.OK).json({
            success: true,
            message: SUCCESS_MESSAGES.DATA_PARSED,
            parsedData
        })

    }catch(err){
        console.log(err)
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR
        })
    }
}


export async function saveOcr(req:Request,res:Response){
  try{
    const data = req.body as OcrDto
   console.log(data)
    if(!data.dob || !data.aadharNumber || !data.gender ||!data.address || !data.name || !data.fatherName ||!data.fatherName){
        res.status(HTTP_STATUS.BAD_REQUEST).json({
            success:false,
            message:ERROR_MESSAGES.MISSING_FIELDS
        })
        return 
    }

    const adhar = await AadharModel.create(data)
    
    res.status(HTTP_STATUS.CREATED).json({
        success:true,
        message:SUCCESS_MESSAGES.DATA_SAVED,
        AdharData:adhar
    })

  }catch(error){
    console.log(error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
  }
}

export async function fetchAllExtractedOcrDatas(req:Request,res:Response){
    try{
      const {limit = 5,page = 1} = req.query as {limit?:number,page?:number}
       
        const skip = (page - 1) * limit;

       const Adhars = await AadharModel.find().sort({createdAt:-1}).skip(skip).limit(limit)
       const count = await AadharModel.countDocuments()

         res.status(HTTP_STATUS.OK).json({
            success:true,
            message:SUCCESS_MESSAGES.DATA_FETCHED,
            AdhaarData:Adhars,
            count
         })
    }catch(error){
       console.log(error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
    }
}
export async function deleteOcr(req:Request,res:Response){
    try{
     
        const {ocrId} = req.params as {ocrId:string}

        if(!ocrId){
            res.status(HTTP_STATUS.BAD_REQUEST).json({
            success:false,
            message:ERROR_MESSAGES.ID_NOT_PROVIDED
        })
        return 
    }

     await AadharModel.findByIdAndDelete(ocrId)
      
     res.status(HTTP_STATUS.OK).json({
            success:true,
            message:SUCCESS_MESSAGES.DOCUMENT_DELETED
         })

    }catch(error){
       console.log(error)
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success:false,
        message:ERROR_MESSAGES.INTERNAL_SERVER_ERROR
    })
    }
}
