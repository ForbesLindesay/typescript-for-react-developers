import React from 'react';
import {useDropzone} from 'react-dropzone';
import cuid from 'cuid';
import usePreviewURL from './usePreviewURL';

const dropzoneStyle = {
  borderWidth: 2,
  borderColor: 'white',
  borderStyle: 'dashed',
  borderRadius: 4,
  margin: 0,
  padding: 30,
  width: '100%',
  transition: 'all 0.5s',
};

const dropzoneActiveStyle = {
  borderStyle: 'solid',
  borderColor: '#4FC47F',
};

const dropzoneRejectStyle = {
  borderStyle: 'solid',
  borderColor: '#DD3A0A',
};

export default function NewPost({onSubmit}) {
  const [text, setText] = React.useState('');
  const [file, setFile] = React.useState(null);
  const fileLink = usePreviewURL(file);

  const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone(
    {
      accept: {'image/*': []},
      multiple: false,
      noClick: true,
      noKeyboard: true,
      onDrop: (files) => setFile(files[0]),
    },
  );

  const style = React.useMemo(
    () => ({
      ...dropzoneStyle,
      ...(isDragActive ? dropzoneActiveStyle : {}),
      ...(isDragReject ? dropzoneRejectStyle : {}),
    }),
    [isDragActive, isDragReject],
  );

  return (
    <form
      {...getRootProps({style})}
      onSubmit={(e) => {
        e.preventDefault();
        if (fileLink) {
          onSubmit({
            id: cuid(),
            kind: 'image',
            src: fileLink,
          });
        } else {
          onSubmit({
            id: cuid(),
            kind: 'text',
            body: text,
          });
        }
        setText('');
        setFile(null);
      }}
    >
      <input {...getInputProps()} />
      {fileLink ? (
        <img src={fileLink} alt="User Uploaded File" />
      ) : (
        <textarea
          placeholder="Type a post or drop an image"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <button type="submit">Add Post</button>
    </form>
  );
}
