import React from "react";
import { currentUser } from "@clerk/nextjs";
import { Redirect } from "next";
import { redirect, usePathname } from "next/navigation";
import axios from "axios";
import { fetchUser } from "@/lib/UserFetch";
import PostThread from "@/components/forms/PostThread";

const Page = async () => {
  const user = await currentUser();
  if (!user) {
    return null;
  }
  const userInfo = await fetchUser(user.id);
  // console.log(userInfo);
  // if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userInfo._id} />
    </>
  );
};

export default Page;
