import PostThread from "@/components/forms/PostThread";
import Thread from "@/lib/Models/Post-Model";
import User from "@/lib/Models/User-model";
import { connectToDatabase, disconnectFromDatabase } from "@/lib/connectToDb";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
  const request = await req.json();
  console.log(request);

  try {
    await connectToDatabase();
    const responseThread = await Thread.create({
      text: request.thread,
      author: request.accountId,
      community: null,
    });
    // now after post i have to update USer model  and add this thread id into user threads array
    await User.findOneAndUpdate(
      { _id: request.accountId },
      {
        //find we find the USer and then push the id created by threadresponse in array in User
        $push: { threads: responseThread._id }, //push is mongoose oprator which push value to an array in db
      }
    );
    revalidatePath(request.pathname);
    await disconnectFromDatabase();
    return NextResponse.json({ message: "success" });
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: "error in uploading" });
  }
}
