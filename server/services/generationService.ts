import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const POLLINATIONS_BASE = "https://image.pollinations.ai/prompt";

function buildPrompt(
    productName: string,
    productDescription: string,
    userPrompt: string,
): string {
    const parts: string[] = [];

    parts.push(
        `Professional UGC lifestyle photo of a ${productName}${productDescription ? `, ${productDescription}` : ""}.`,
    );

    if (userPrompt) {
        parts.push(userPrompt);
    } else {
        parts.push(
            "Natural lighting, influencer-style photography, social media ready, high quality commercial shot.",
        );
    }

    parts.push("Photorealistic, 4K, sharp focus, natural skin tones.");

    return parts.join(" ");
}

function getDimensions(aspectRatio: string): { width: number; height: number } {
    switch (aspectRatio) {
        case "16:9":
            return { width: 1024, height: 576 };
        case "1:1":
            return { width: 1024, height: 1024 };
        case "9:16":
        default:
            return { width: 576, height: 1024 };
    }
}

function saveBufferToFile(buffer: Buffer, ext: string): string {
    const filename = `${crypto.randomUUID()}.${ext}`;
    const filepath = path.join(UPLOADS_DIR, filename);
    fs.writeFileSync(filepath, buffer);
    return `${process.env.BASE_URL || "http://localhost:5000"}/uploads/${filename}`;
}

export async function generateImage(params: {
    productName: string;
    productDescription: string;
    userPrompt: string;
    aspectRatio: string;
}): Promise<string> {
    const prompt = buildPrompt(
        params.productName,
        params.productDescription,
        params.userPrompt,
    );
    const { width, height } = getDimensions(params.aspectRatio);
    const seed = Math.floor(Math.random() * 100000);

    const encodedPrompt = encodeURIComponent(prompt);
    const url = `${POLLINATIONS_BASE}/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

    const response = await axios.get(url, {
        responseType: "arraybuffer",
        timeout: 120000,
    });

    const buffer = Buffer.from(response.data);
    return saveBufferToFile(buffer, "png");
}

export async function generateVideo(_params: {
    imageUrl: string;
    aspectRatio: string;
    targetLength: number;
}): Promise<string> {
    return "";
}
