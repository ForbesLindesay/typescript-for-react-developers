import Welcome, { WelcomeProps } from "./Welcome";

export interface HelloProps extends WelcomeProps {
  name: string;
}

export default function Hello({ name, ...otherProps }: HelloProps) {
  return (
    <p>
      Hello {name}, <Welcome {...otherProps} />
    </p>
  );
}
