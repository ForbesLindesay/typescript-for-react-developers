import React from 'react';

export interface WelcomeProps {
  language: string;
}
export default function Welcome(props: WelcomeProps) {
  return <>welcome to this workshop on using React with {props.language}</>;
}
