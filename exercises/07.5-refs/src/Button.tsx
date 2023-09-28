import React from 'react';

interface ButtonProps {
  onClick?: () => void;
  href?: string;
  children: React.ReactNode;
}

const Button = React.forwardRef(function Button(
  props: ButtonProps,
  forwardRef: React.ForwardedRef<HTMLElement>,
) {
  if (props.href) {
    return <a ref={forwardRef} href={props.href} {...props} />;
  }
  return <button ref={forwardRef} type="button" {...props} />;
});
export default Button;
