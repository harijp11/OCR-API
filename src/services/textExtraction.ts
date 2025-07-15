// Improved textExtraction.ts
import { createWorker, Worker, PSM } from "tesseract.js";

export async function extractTextFromImages(frontBuffer: Buffer, backBuffer: Buffer): Promise<{ frontText: string, backText: string }> {
    const worker: Worker = await createWorker();

    try {
        // Better OCR configuration
        await worker.reinitialize("eng");
        
        // Set better parameters for Aadhaar cards
        await worker.setParameters({
            'tessedit_char_whitelist': '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz /-:.,',
            'tessedit_pageseg_mode': PSM.SINGLE_BLOCK, // Single uniform block of text
            'preserve_interword_spaces': '1'
        });

        // Process both images
        const frontTextResult = await worker.recognize(frontBuffer);
        const backTextResult = await worker.recognize(backBuffer);

        const frontText = frontTextResult.data.text;
        const backText = backTextResult.data.text;

        console.log("=== FRONT TEXT ===");
        console.log(frontText);
        console.log("=== BACK TEXT ===");
        console.log(backText);

        return { frontText, backText };
    } catch (error) {
        throw new Error("Failed to perform OCR on the Aadhaar images.");
    } finally {
        await worker.terminate();
    }
}