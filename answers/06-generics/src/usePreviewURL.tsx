import React from 'react';

export default function usePreviewURL(file: File | null) {
  const ref = React.useRef<{file: null | File; preview: null | string}>({
    file: null,
    preview: null,
  });

  if (file !== ref.current.file) {
    ref.current.file = file;
    ref.current.preview = file ? URL.createObjectURL(file) : null;
  }

  React.useEffect(() => {
    if (ref.current.preview) {
      const preview = ref.current.preview;
      return () => URL.revokeObjectURL(preview);
    } else {
      return () => {};
    }
  }, [ref.current.preview]);

  return ref.current.preview;
}
