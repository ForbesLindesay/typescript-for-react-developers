import type { Route } from "./+types/home";
import Counter from "../components/Counter";
import Hello from "../components/Hello";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    {
      name: "description",
      content: "Welcome to TypeScript for React Developers",
    },
  ];
}

export default function Home() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to TypeScript for React Developers</h1>
      <Hello name="Your Name" />
      <Counter />
    </div>
  );
}
