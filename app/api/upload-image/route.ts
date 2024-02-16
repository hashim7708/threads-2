import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export async function POST(req: Request, res: Response) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");

    if (!file || !(file instanceof File)) {
      console.log("Invalid file type");
      return;
    }

    // Save the image to AWS S3 bucket
    const binaryFile = await file.arrayBuffer();
    const fileBuffer = Buffer.from(binaryFile);
    const currentDate = new Date();
    const uniqueKey = `Profile/${currentDate.toISOString()}-${Math.floor(
      Math.random() * 1000
    )}.jpg`;

    const putParams = {
      Bucket: process.env.AMAZON_BUCKET_NAME,
      Key: uniqueKey,
      Body: fileBuffer,
      ContentType: file.type,
    };

    const putCommand = new PutObjectCommand(putParams);
    await s3Client.send(putCommand);

    // Create a presigned URL for the uploaded image
    const getParams = {
      Bucket: process.env.AMAZON_BUCKET_NAME,
      Key: uniqueKey,
    };
    const getCommand = new GetObjectCommand(getParams);
    const imageUrl = await getSignedUrl(s3Client, getCommand);

    console.log("Uploaded image URL:", imageUrl);

    return NextResponse.json({ message: "success", imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json({ error: "error in uploading" });
  }
}
