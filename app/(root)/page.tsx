import ThreadsCard from "@/components/Cards/threadsCard";
import { fetchPost } from "@/lib/fetchPosts";
import { UserButton, currentUser } from "@clerk/nextjs";
import Image from "next/image";

export default async function Home() {
  const result = await fetchPost(1, 30);
  console.log(result);
  const user = await currentUser();
  if (!user) return null;
  return (
    <div>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-9 flex flex-col gap-10">
        {result?.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {result?.posts.map((post) => (
              <ThreadsCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                community={post.community}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>
    </div>
  );
}
