export enum PostKind {
  text,
  image,
}

export interface TextPost {
  kind: PostKind.text;
  id: string;
  body: string;
}
export interface ImagePost {
  kind: PostKind.image;
  id: string;
  src: string;
}
type Post = TextPost | ImagePost;
export default Post;
