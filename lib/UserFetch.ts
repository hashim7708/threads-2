"use server";

import User from "./Models/User-model";
import { connectToDatabase } from "./connectToDb";

export async function fetchUser(userId: string) {
  try {
    await connectToDatabase();

    return await User.findOne({ id: userId });
    
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}
