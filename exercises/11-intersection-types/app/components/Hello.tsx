import Welcome from "./Welcome";

export default function Hello({ name, ...otherProps }) {
  return (
    <p>
      Hello {name}, <Welcome {...otherProps} />
    </p>
  );
}
