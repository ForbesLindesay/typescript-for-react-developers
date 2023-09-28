import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}

function useRefAsCallback<T>(ref: React.ForwardedRef<T>) {
  return React.useCallback(
    (instance: T | null) => {
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref],
  );
}

const Button = React.forwardRef(function Button(
  props: ButtonProps,
  forwardRef: React.ForwardedRef<HTMLElement>,
) {
  const typeSafeRef = useRefAsCallback(forwardRef);
  if (props.href) {
    return <a ref={typeSafeRef} href={props.href} {...props} />;
  }
  return <button ref={typeSafeRef} type="button" {...props} />;
});
export default Button;
