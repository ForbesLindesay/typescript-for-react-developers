export interface TextPost {
  kind: "text";
  id: string;
  body: string;
}
export interface ImagePost {
  kind: "image";
  id: string;
  src: string;
}

export type Post = TextPost | ImagePost;
