export interface WelcomeProps {
  language?: string;
}

export default function Welcome({ language = "TypeScript" }: WelcomeProps) {
  return <>welcome to this workshop on using React with {language}</>;
}
