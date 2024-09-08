export enum PostKind {
  text,
  image,
}

// => post is TextPost
export function isTextPost(post: Post) {
  return post.kind === PostKind.text;
}
export interface TextPost {
  kind: PostKind.text;
  id: string;
  body: string;
}
// => post is ImagePost
export function isImagePost(post: Post) {
  return post.kind === PostKind.image;
}
export interface ImagePost {
  kind: PostKind.image;
  id: string;
  src: string;
}
type Post = TextPost | ImagePost;
export default Post;
