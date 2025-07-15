import fetch from "node-fetch";
import sharp from "sharp";

export async function greyscaleImage(imageUrl: string): Promise<Buffer> {
   
    const response = await fetch(imageUrl);

    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${imageUrl}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);
    
    // Enhanced image preprocessing for better OCR
    return await sharp(imageBuffer)
        .resize(1200, null, { 
            withoutEnlargement: false,
            fit: 'inside'
        })
        .grayscale()
        .normalize()
        .sharpen()
        .threshold(128) 
        .toBuffer();
}