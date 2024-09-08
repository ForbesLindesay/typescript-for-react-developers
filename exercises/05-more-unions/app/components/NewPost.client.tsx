import { useState } from "react";
import { useDropzone } from "react-dropzone";

export default function NewPost({ onSubmit }) {
  const [text, setText] = useState("");
  const [fileUrl, setFileUrl] = useState(null);

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
      <button
        type="submit"
        className="block rounded-md bg-blue-900 hover:bg-blue-800 text-blue-50 text-xl p-4 mt-4"
      >
        Add Post
      </button>
    </form>
  );
}
