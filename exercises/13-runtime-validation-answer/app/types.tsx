import * as t from "funtypes";

const TextPostSchema = t.Named(
  "TextPost",
  t.Object({
    kind: t.Literal("text"),
    id: t.String,
    body: t.String,
  }),
);
export type TextPost = t.Static<typeof TextPostSchema>;

const ImagePostSchema = t.Named(
  "ImagePost",
  t.Object({
    kind: t.Literal("image"),
    id: t.String,
    src: t.String,
  }),
);
export type ImagePost = t.Static<typeof ImagePostSchema>;

export const PostSchema = t.Union(TextPostSchema, ImagePostSchema);

type Post = TextPost | ImagePost;

export default Post;
