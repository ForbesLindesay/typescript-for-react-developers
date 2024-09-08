import Welcome, { WelcomeProps } from "./Welcome";

export type HelloProps = WelcomeProps & {
  name: string;
};

export default function Hello({ name, ...otherProps }: HelloProps) {
  return (
    <p>
      Hello {name}, <Welcome {...otherProps} />
    </p>
  );
}
