import { Router } from "express";
import { deleteOcr, fetchAllExtractedOcrDatas, handleDeleteImage, handleOcr, saveOcr } from "../controllers/ocrController";

const router = Router();

router.post("/ocr/aadhar",handleOcr)
router.post("/ocr/save",saveOcr)
router.get("/ocr/aadhar",fetchAllExtractedOcrDatas)
router.delete("/ocr/delete/:ocrId",deleteOcr)

router.post("/cloudinary/delete",handleDeleteImage)

export default router