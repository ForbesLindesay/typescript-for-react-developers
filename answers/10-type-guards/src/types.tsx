export enum PostKind {
  text,
  image,
}

export function isTextPost(post: Post): post is TextPost {
  return post.kind === PostKind.text;
}
export interface TextPost {
  kind: PostKind.text;
  id: string;
  body: string;
}
export function isImagePost(post: Post): post is ImagePost {
  return post.kind === PostKind.image;
}
export interface ImagePost {
  kind: PostKind.image;
  id: string;
  src: string;
}
type Post = TextPost | ImagePost;
export default Post;
