import { useState } from "react";
import { useDropzone } from "react-dropzone";
import Post from "../types";
import Button from "./Button";

export interface NewPostProps {
  onSubmit: (post: Post) => void;
}

export default function NewPost({ onSubmit }: NewPostProps) {
  const [text, setText] = useState("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "image/*": [] },
      multiple: false,
      noClick: true,
      noKeyboard: true,
      // NOTE: URL.createObjectURL will result in a memory leak because we never call URL.revokeObjectURL.
      //       We would need to fix this if this was a real application, with a real backend.
      onDrop: (files) => setFileUrl(URL.createObjectURL(files[0])),
    });

  return (
    <form
      className={`border-2 p-4 mt-4 rounded-md ${
        isDragReject
          ? `border-red-500`
          : isDragActive
            ? `border-green-500`
            : `border-gray-500 border-dashed`
      }`}
      {...getRootProps()}
      onSubmit={(e) => {
        e.preventDefault();
        if (fileUrl) {
          onSubmit({
            id: crypto.randomUUID(),
            kind: "image",
            src: fileUrl,
          });
        } else {
          onSubmit({
            id: crypto.randomUUID(),
            kind: "text",
            body: text,
          });
        }
        setText("");
        setFileUrl(null);
      }}
    >
      <input {...getInputProps()} />
      {fileUrl ? (
        <img src={fileUrl} alt="User Uploaded File" />
      ) : (
        <textarea
          className="block border-2 border-blue-900 p-4 w-full rounded-md"
          placeholder="Type a post or drop an image"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <Button type="submit">Add Post</Button>
      <Button href="http://example.com">My Link</Button>
    </form>
  );
}
