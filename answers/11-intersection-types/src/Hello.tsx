import React from 'react';
import Welcome, {WelcomeProps} from './Welcome';

export default function Hello({
  name,
  ...welcomeProps
}: {name: string} & WelcomeProps) {
  return (
    <p>
      Hello {name}, <Welcome {...welcomeProps} />
    </p>
  );
}
