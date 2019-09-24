import React from 'react';

export default function Hello(props: {name: string; language: string}) {
  if (!props.name) props.name = 'Anonymous';
  if (!props.language) props.language = 'TypeScript';

  return (
    <p>
      Hello {props.name}, welcome to this workshop on using React with {props.language}
    </p>
  );
}
