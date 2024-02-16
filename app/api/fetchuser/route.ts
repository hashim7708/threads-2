import User from "@/lib/Models/User-model";
import { connectToDatabase } from "@/lib/connectToDb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const request = await req.json();
  console.log(request);

  try {
    await connectToDatabase();
    const response = await User.findOne({ id: request.id });
    console.log(response);

    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error in uploading" });
  }
}
