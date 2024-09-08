import { useMemo, useState } from "react";
import NewPost from "./NewPost.client";
import useIsHydrated from "../hooks/useIsHydrated";
import Post from "../types";
import List from "./List";
import debounce from "../utils/debounce";

export default function Wall() {
  const isHydrated = useIsHydrated();
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchText, setSearchText] = useState("");

  const setSearchTextDebounced = useMemo(
    () => debounce(setSearchText, 500),
    [],
  );

  return (
    <>
      {isHydrated && (
        <NewPost
          onSubmit={(newPost) => setPosts((posts) => [newPost, ...posts])}
        />
      )}
      <input
        type="search"
        className="block border-2 border-blue-900 p-4 w-full rounded-full mt-4"
        placeholder="Search posts"
        onChange={(e) => setSearchTextDebounced(e.target.value)}
      />
      <List
        items={posts.filter((post) => {
          if (!searchText) return true;
          if (post.kind === "text") {
            return post.body.includes(searchText);
          }
          return false;
        })}
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
