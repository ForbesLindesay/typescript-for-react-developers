import React from 'react';

export default function Hello({name = 'Anonymous', language = 'TypeScript'}: {name?: string; language?: string}) {
  return (
    <p>
      Hello {name}, welcome to this workshop on using React with {language}
    </p>
  );
}
