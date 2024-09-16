import Welcome, { WelcomeProps } from "./Welcome";

export interface HelloProps extends Omit<WelcomeProps, "language"> {
  name: string;
}

export default function Hello({ name, ...otherProps }: HelloProps) {
  return (
    <p>
      Hello {name}, <Welcome {...otherProps} language="TypeScript" />
    </p>
  );
}
