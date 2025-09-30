import { forwardRef } from "react";

const CLASS_NAME =
  "block w-full text-center rounded-md bg-blue-900 hover:bg-blue-800 text-blue-50 text-xl p-4 mt-4 focus:outline-none focus:ring-8 focus:ring-green-800 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

interface AnchorProps {
  ref?: React.ForwardedRef<HTMLAnchorElement>;
  children: React.ReactNode;
  href: string;
}
interface ButtonProps {
  ref?: React.ForwardedRef<HTMLButtonElement>;
  children: React.ReactNode;
  href?: undefined;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}

function Button(props: AnchorProps | ButtonProps) {
  if (props.href != undefined) {
    return (
      <a ref={props.ref} href={props.href} className={CLASS_NAME}>
        {props.children}
      </a>
    );
  }
  return (
    <button
      ref={props.ref}
      type={props.type}
      onClick={props.onClick}
      className={CLASS_NAME}
    >
      {props.children}
    </button>
  );
}
export default Button;
