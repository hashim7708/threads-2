"use server";
import axios from "axios";
import { connectToDatabase, disconnectFromDatabase } from "./connectToDb";
import Thread from "./Models/Post-Model";
import User from "./Models/User-model";

export async function fetchPost(pageNumber: number, pageSize: number) {
  try {
    await connectToDatabase();
    const skipAmount = (pageNumber - 1) * pageSize; //pagination purpose
    const postQuery = await Thread.find({
      parentComment: { $in: [null, undefined] }, // $in is conditional op it checks   currently only return me posts whi has no comments ]
    })
      .sort({ createdAt: -1 }) // in decending oder latest one get first
      .skip(skipAmount) //pagination purposes
      .limit(pageSize) //This method is used to limit the number of documents returned in the query result
      .populate({ path: "author", model: User }) //now populate the author feild in thread model and author is in User
      .populate({
        // populating comments
        path: "childrenComment",
        populate: {
          path: "author", //name of person  who commented on comment
          model: "User",
          select: "_id name parentComment image ", //we need these things from user model
        },
      });
    //  total post count
    const totalPostCount = await Thread.countDocuments({
      //counting docs
      parentComment: { $in: [null, undefined] }, //$in we need top level  posts only not nested ones
    });
    const posts = postQuery;
    const isNext = totalPostCount > skipAmount + posts.length;
    console.log(postQuery);
    await disconnectFromDatabase();
    return { posts, isNext };
  } catch (error) {
    console.log(error);
  }
}
