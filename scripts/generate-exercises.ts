// fnm use 24
// node --experimental-strip-types scripts/generate-exercises.ts

import * as fs from "fs";
import { join, relative, resolve } from "path";

function copyDir(srcRelative: string, dest: string) {
  const src = resolve(srcRelative);
  fs.rmSync(dest, { recursive: true, force: true });
  fs.mkdirSync(dest, { recursive: true });
  // for (let entry of fs.readdirSync(src, {
  //   withFileTypes: true,
  // })) {
  //   if (entry.name === "node_modules" || entry.name === ".react-router")
  //     continue;
  //   fs.rmSync(join(dest, entry.name), { recursive: true, force: true });
  // }
  for (let entry of fs.readdirSync(src, {
    withFileTypes: true,
    recursive: true,
  })) {
    const path = relative(src, resolve(entry.parentPath, entry.name));
    if (/^node_modules\b/.test(path) || /^\.react-router\b/.test(path))
      continue;
    if (entry.isDirectory()) {
      fs.mkdirSync(join(dest, path));
    } else if (entry.isFile()) {
      fs.copyFileSync(join(src, path), join(dest, path));
    }
  }
}

let lastExercise = `exercises/01-template`;
interface Context {
  readFile: (path: string) => string;
  writeFile: (path: string, content: string) => void;
}
function createExerciseDirectory(
  exerciseDirectory: string,
  name: string,
  fn: (context: Context) => void,
  options: { preserve?: string[] } = {},
) {
  const preserved = options.preserve?.map((path) => ({
    path,
    content: fs.readFileSync(join(exerciseDirectory, path), "utf8"),
  }));
  copyDir(lastExercise, exerciseDirectory);
  fs.writeFileSync(
    join(exerciseDirectory, "package.json"),
    JSON.stringify(
      {
        ...JSON.parse(
          fs.readFileSync(join(exerciseDirectory, "package.json"), "utf8"),
        ),
        name,
      },
      null,
      2,
    ) + "\n",
  );
  for (let { path, content } of preserved || []) {
    fs.writeFileSync(join(exerciseDirectory, path), content);
  }
  fn({
    readFile(path) {
      return fs.readFileSync(join(exerciseDirectory, path), "utf8");
    },
    writeFile(path, content) {
      fs.writeFileSync(join(exerciseDirectory, path), content);
    },
  });
  lastExercise = exerciseDirectory;
}

const HELLO_COMPONENT = (
  withTypes: boolean,
) => `export default function Hello(props${withTypes ? `: {name: string; language: string}` : ""}) {
  return (
    <p>
      Hello {props.name}, welcome to this workshop on using React with{" "}
      {props.language}
    </p>
  );
}
`;

const INSTRUCTIONS: string[] = [];
createExerciseDirectory(
  `exercises/02-prop-types`,
  `@workshop/prop-types`,
  ({ readFile, writeFile }) => {
    {
      const FILE_PATH = `app/components/Hello.tsx`;
      const FILE_CONTENTS = HELLO_COMPONENT(false);

      INSTRUCTIONS.push(
        `## Exercise 2 - Prop Types`,
        ``,
        `Add a new component in \`${FILE_PATH}\` that looks like:`,
        ``,
        "```tsx",
        FILE_CONTENTS,
        "```",
        ``,
      );
      writeFile(FILE_PATH, FILE_CONTENTS);
    }

    {
      const FILE_PATH = `app/routes/home.tsx`;
      const LINE_TO_ADD = `      <Hello name="Your Name" language="TypeScript" />`;

      const originalSource = readFile(FILE_PATH).split("\n");
      const indexToAdd = originalSource.findIndex(
        (line) => line.trim() === "</div>",
      );
      INSTRUCTIONS.push(
        `and update \`${FILE_PATH}\` to render the new component by adding:`,
        ``,
        "```diff",
        originalSource
          .slice(indexToAdd - 2, indexToAdd)
          .map((line) => `  ${line.substring(4)}`)
          .join("\n"),
        `+ ${LINE_TO_ADD.substring(4)}`,
        originalSource
          .slice(indexToAdd, indexToAdd + 1)
          .map((line) => `  ${line.substring(4)}`)
          .join("\n"),
        "```",
        ``,
      );
      const updatedSource = [...originalSource];
      updatedSource.splice(indexToAdd, 0, LINE_TO_ADD);
      updatedSource.splice(1, 0, `import Hello from "../components/Hello";`);

      writeFile(FILE_PATH, updatedSource.join("\n"));
    }
  },
);

createExerciseDirectory(
  `exercises/02-prop-types-answer`,
  `@workshop/prop-types-valid`,
  ({ writeFile }) => {
    INSTRUCTIONS.push(
      `Notice the TypeScript errors in both files. We can fix these by adding types for the props for \`Hello.tsx\` so it looks like:`,
      ``,
      "```diff",
      `- export default function Hello(props) {`,
      `+ export default function Hello(props: {name: string; language: string}) {`,
      "```",
      ``,
      `This should fix the errors in both files. You can see TypeScript now errors if you forget one of the properties or pass the wrong type.`,
      ``,
      `The basic types in TypeScript are:`,
      ``,
      ...[`string`, `number`, `boolean`, `null`, `undefined`].map(
        (type) => `- \`${type}\``,
      ),
      ``,
      `You can also use literals as types:`,
      ``,
      ...[`'hello'`, `42`, `true`].map((type) => `- \`${type}\``),
      ``,
      `React has a few very useful types built in, including:`,
      ``,
      ` - \`React.ReactNode\` - anything that can be rendered by React`,
      ` - \`React.CSSProperties\` - the type for a style object`,
      ` - \`React.ComponentType<{hello: string}>\` - a component that takes the property \`hello\` of type \`string\`.`,
      ` - \`React.ComponentProps<'div'>\` - the properties for a \`div\` element`,
      ` - \`React.ComponentProps<MyCustomComponent>\` - the properties for a \`MyCustomComponent\``,
      ``,
      `In addition to these basic types, there are a few more interesting types we will look at properly later:`,
      ``,
      ` - \`any\` - represents anything, and tells TypeScript not to bother type checking`,
      ` - \`unknown\` - represents anything, but forces you to check the type before using it`,
      ` - \`void\` - represents the return type of a function that doesn't return anything`,
      ` - \`never\` - represents a value that cannot exist, meaning the code is unreachable. e.g. \`(() => { throw new Error("fail") })()\` has the type \`never\` because you can't ever see a value returned by that function.`,
      ``,
      `Types can also be combined in objects, classes, interfaces, unions, intersections etc. We'll talk about most of these as we go through the remaining exercises.`,
      ``,
    );
    writeFile(`app/components/Hello.tsx`, HELLO_COMPONENT(true));
  },
);

createExerciseDirectory(
  `exercises/03-optional-props`,
  `@workshop/optional-props`,
  ({ readFile, writeFile }) => {
    INSTRUCTIONS.push(
      `## Exercise 3 - Optional Prop Types`,
      ``,
      "You can make a property or parameter optional with a `?` before the `:`. e.g.",
      ``,
      "```tsx",
      `interface Foo {`,
      `x?: number;`,
      `y?: number;`,
      `}`,
      `const a: Foo = {x: 10, y: 10};`,
      `const b: Foo = {x: 10};`,
      `const c: Foo = {y: 10};`,
      ``,
      `function run(value?: number) {`,
      `}`,
      `run();`,
      `run(42);`,
      "```",
      ``,
      "This is almost equivalent to `| undefined`, but if you had:",
      ``,
      "```tsx",
      `interface Foo {`,
      `  x: number | undefined;`,
      `  y: number | undefined;`,
      `}`,
      "```",
      ``,
      `you'd have to do:`,
      ``,
      "```tsx",
      `const b: Foo = {x: 10, y: undefined};`,
      `const c: Foo = {x: undefined, y: 10};`,
      "```",
      ``,
      `You can use destructuring to reduce the boilerplate. e.g.`,
      ``,
      "```ts",
      `function foo({a = 10, b = 10}: {a?: number; b?: number} = {}) {`,
      `  return a + b;`,
      `}`,
      `assert(foo() === 20);`,
      "```",
      ``,
      `When you specify default values for parameters, you don't even need to mark them as optional:`,
      ``,
      "```ts",
      `function increment(value: number, by: number = 1) {`,
      `  return value + by;`,
      `}`,
      "```",
      ``,
      `Update \`app/routes/home.tsx\` so we are no longer passing in a "language" property to the \`Hello\` component.`,
      ``,
      "```diff",
      `- <Hello name="Your Name" language="TypeScript" />`,
      `+ <Hello name="Your Name" />`,
      "```",
      ``,
      `You should see a TypeScript error.`,
      ``,
    );
    writeFile(
      `app/routes/home.tsx`,
      readFile(`app/routes/home.tsx`).replace(/ language="TypeScript"/g, ""),
    );
  },
);

const HELLO_COMPONENT_DESTRUCTURED = `export default function Hello(
  {
    name,
    language = "TypeScript",
  }: {
    name: string;
    language?: string;
  }
) {
  return (
    <p>
      Hello {name}, welcome to this workshop on using React with {language}
    </p>
  );
}
`;

createExerciseDirectory(
  `exercises/03-optional-props-answer`,
  `@workshop/optional-props-valid`,
  ({ writeFile }) => {
    writeFile(`app/components/Hello.tsx`, HELLO_COMPONENT_DESTRUCTURED);
    INSTRUCTIONS.push(
      `To fix this, we can make the \`language\` property optional by adding a \`?\` and we can use destructuring to provide the default value.`,
      ``,
    );
  },
);

createExerciseDirectory(
  `exercises/04-unions-generics`,
  `@workshop/unions-generics-valid`,
  ({ readFile, writeFile }) => {
    INSTRUCTIONS.push(`## Exercise 4 - Unions and Generics`, ``);
    {
      const FILE_PATH = `app/routes/home.tsx`;
      const LINE_TO_ADD = `      <Counter />`;

      const originalSource = readFile(FILE_PATH).split("\n");
      const indexToAdd = originalSource.findIndex(
        (line) => line.trim() === "</div>",
      );
      INSTRUCTIONS.push(
        `Open \`exercises/04-unions-generics\` and update \`${FILE_PATH}\` to render the new component by adding:`,
        ``,
        "```diff",
        originalSource
          .slice(indexToAdd - 3, indexToAdd)
          .map((line) => `  ${line.substring(4)}`)
          .join("\n"),
        `+ ${LINE_TO_ADD.substring(4)}`,
        originalSource
          .slice(indexToAdd, indexToAdd + 1)
          .map((line) => `  ${line.substring(4)}`)
          .join("\n"),
        "```",
        ``,
      );
      const updatedSource = [...originalSource];
      updatedSource.splice(indexToAdd, 0, LINE_TO_ADD);
      updatedSource.splice(
        1,
        0,
        `import Counter from "../components/Counter";`,
      );

      writeFile(FILE_PATH, updatedSource.join("\n"));
    }
  },
  { preserve: ["app/components/Counter.tsx"] },
);
createExerciseDirectory(
  `exercises/04-unions-generics-answer`,
  `@workshop/unions-generics-answer-valid`,
  ({ readFile, writeFile }) => {
    const modeType = `type Mode = "arabic" | "roman"`;
    const replacements = [
      [
        `function toggleMode(mode: string): string {`,
        `function toggleMode(mode: Mode): Mode {`,
      ],
      [
        `function renderNumber(count: number, mode: string): string {`,
        `function renderNumber(count: number, mode: Mode): string {`,
      ],
    ];
    INSTRUCTIONS.push(
      `If you run \`pnpm dev\` you should see a simple counter with a + and - button and the current value, and a button to toggle between arabic and roman numeral notation.`,
      ``,
      'The `mode` state is of type `string` though, which could make it easy to make a typo and misspell `"roman"` or `"arabic"`. It could also be easy to forget to handle one of the states. It would be better if we could tell TypeScript that this state can only have one of two possible values. To do this, we can use the type:',
      ``,
      "```ts",
      modeType,
      "```",
      ``,
      `Try using this type in place of \`string\` for the mode in \`toggleMode\`, \`renderNumber\`.`,
      ``,
      "```diff",
      ...replacements.flatMap(([from, to], i) => [
        ...(i === 0 ? [] : [``]),
        `- ${from}`,
        `+ ${to}`,
      ]),
      "```",
      ``,
      `The issue you'll have is that the state value still has the type \`string\`. To fix, this, we need to pass a generic type parameter to the \`useState\` function to tell it the right type for \`state\`:`,
      ``,
      "```diff",
      `- const [mode, setMode] = useState("arabic");`,
      `+ const [mode, setMode] = useState<Mode>("arabic");`,
      "```",
      ``,
      `### satisfies and never`,
      ``,
      "You might notice that if you comment out one of the cases in `toggleMode` or `renderNumber`, TypeScript doesn't complain and you'll get a runtime error. We can fix this with two awesome features of TypeScript.:",
      ``,
      "`never` is used when a variable cannot possibly have a value. There are two common ways this can happen:",
      ``,

      `1. A variable was assigned the result of calling a function that always throws an error.`,
      `2. A variable had a union type but we've checked it's not any of the possible values in the union.`,
      ``,
      '`satisfies` lets you ask TypeScript to verify that the result of a given expression "satisfies" a given type. If it doesn\'t, TypeScript will show an error. For example, `42 satisfies number` will be fine but `42 satisfies string` will result in a TypeScript error.',

      `We can combine these two features by replacing:`,
      ``,
      "```diff",
      `- throw new Error("Invalid mode, expected 'arabic' or 'roman'");`,
      `+ return mode satisfies never;`,
      "```",
      ``,
      `This converts a potential runtime error into a TypeScript error.`,
    );

    // throw new Error("Invalid mode, expected 'arabic' or 'roman'");
    // return mode satisfies never;
    writeFile(
      `app/components/Counter.tsx`,
      replacements.reduce(
        (source, [from, to]) => source.replace(from, to),
        readFile(`app/components/Counter.tsx`)
          .replace(`export `, modeType + `\n\nexport `)
          .replace(`useState("arabic")`, `useState<Mode>("arabic")`)
          .replace(/throw [^;]+;/gm, `return mode satisfies never;`),
      ),
    );
  },
);

console.log(INSTRUCTIONS.join("\n"));
