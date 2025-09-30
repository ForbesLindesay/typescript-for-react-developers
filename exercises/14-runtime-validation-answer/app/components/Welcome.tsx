export interface WelcomeProps {
  language: string;
  day: string;
}

export default function Welcome({ language, day }: WelcomeProps) {
  return (
    <>
      welcome to this workshop on using React with {language} on {day}
    </>
  );
}
