import User from "@/lib/Models/User-model";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/connectToDb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const request = await req.json();
  console.log(request);
  const pic = request.values.profile_photo;
  const b = pic.toString();
  console.log(b);
  try {
    await connectToDatabase();
    await User.findOneAndUpdate(
      { id: request.id },
      {
        username: request.values.username,
        name: request.values.name,
        bio: request.values.bio,
        image: request.values.profile_photo,
      },
      { upsert: true, new: true }
    );
    if (request.pathname === "/profile/edit") {
      revalidatePath(request.pathname);
    }

    await disconnectFromDatabase();
    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "error in uploading" });
  }
}
