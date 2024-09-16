import { forwardRef, useCallback } from "react";

const CLASS_NAME =
  "block w-full text-center rounded-md bg-blue-900 hover:bg-blue-800 text-blue-50 text-xl p-4 mt-4";

interface AnchorProps {
  children: React.ReactNode;
  href: string;
}
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "submit" | "reset" | "button";
}

const Button = forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  AnchorProps | ButtonProps
>(function Button(props, ref) {
  const typeSafeRef = useRefAsCallback(ref);
  if ("href" in props) {
    return (
      <a ref={typeSafeRef} href={props.href} className={CLASS_NAME}>
        {props.children}
      </a>
    );
  }
  return (
    <button
      ref={typeSafeRef}
      type={props.type}
      onClick={props.onClick}
      className={CLASS_NAME}
    >
      {props.children}
    </button>
  );
});
export default Button;

function useRefAsCallback<T>(ref: React.ForwardedRef<T>) {
  return useCallback(
    (instance: T | null) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref],
  );
}
