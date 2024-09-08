import { useState } from "react";
import NewPost from "./NewPost.client";
import useIsHydrated from "../hooks/useIsHydrated";
import Post from "../types";
import List from "./List";

export default function Wall() {
  const isHydrated = useIsHydrated();
  const [posts, setPosts] = useState<Post[]>([]);

  return (
    <>
      {isHydrated && (
        <NewPost
          onSubmit={(newPost) => setPosts((posts) => [newPost, ...posts])}
        />
      )}
      <List
        items={posts}
        renderItem={(post) => {
          switch (post.kind) {
            case "text":
              return (
                <p
                  key={post.id}
                  className="border-2 p-4 mt-4 rounded-md border-blue-900"
                >
                  {post.body}
                </p>
              );
            case "image":
              return (
                <div
                  key={post.id}
                  className="border-2 p-4 mt-4 rounded-md border-blue-900"
                >
                  <img src={post.src} alt="User Uploaded File" />
                </div>
              );
            default:
              return post satisfies never;
          }
        }}
      />
    </>
  );
}
