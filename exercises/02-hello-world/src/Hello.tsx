import React from 'react';

export default function Hello(props) {
  return (
    <p>
      Hello {props.name}, welcome to this workshop on using React with{' '}
      {props.language}
    </p>
  );
}
