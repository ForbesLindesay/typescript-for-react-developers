export interface TextPost {
  kind: 'text';
  id: string;
  body: string;
}
export interface ImagePost {
  kind: 'image';
  id: string;
  src: string;
}
type Post = TextPost | ImagePost;
export default Post;
