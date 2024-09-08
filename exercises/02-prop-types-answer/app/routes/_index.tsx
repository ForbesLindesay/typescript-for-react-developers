import type { MetaFunction } from "@remix-run/node";
import Hello from "../components/Hello";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to TypeScript for React Developers!",
    },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to TypeScript for React Developers</h1>
      <Hello name="Your Name" language="TypeScript" />
    </div>
  );
}
