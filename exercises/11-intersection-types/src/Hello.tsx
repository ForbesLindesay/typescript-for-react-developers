import React from 'react';
import Welcome from './Welcome';

export default function Hello({name, ...welcomeProps}) {
  return (
    <p>
      Hello {name}, <Welcome {...welcomeProps} />
    </p>
  );
}
