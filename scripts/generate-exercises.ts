// fnm use 24
// node --experimental-strip-types scripts/generate-exercises.ts

import { spawnSync } from "child_process";
import * as fs from "fs";
import { dirname, join, relative, resolve } from "path";

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
  updateFile: (path: string, fn: (content: string) => string) => void;
}
const exerciseDirectories: {
  exerciseDirectory: string;
  name: string;
}[] = [];
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
    fs.mkdirSync(dirname(join(exerciseDirectory, path)), { recursive: true });
    fs.writeFileSync(join(exerciseDirectory, path), content);
  }
  fn({
    readFile(path) {
      return fs.readFileSync(join(exerciseDirectory, path), "utf8");
    },
    writeFile(path, content) {
      fs.writeFileSync(join(exerciseDirectory, path), content);
    },
    updateFile(path, fn) {
      const fullPath = join(exerciseDirectory, path);
      fs.writeFileSync(fullPath, fn(fs.readFileSync(fullPath, "utf8")));
    },
  });
  lastExercise = exerciseDirectory;

  exerciseDirectories.push({ exerciseDirectory, name });
}

const INSTRUCTIONS: string[] = [];

INSTRUCTIONS.push(fs.readFileSync(`scripts/intro.md`, "utf8"));

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
  ({ updateFile }) => {
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
    updateFile(`app/routes/home.tsx`, (source) =>
      source.replace(/ language="TypeScript"/g, ""),
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
  ({ updateFile }) => {
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

    updateFile(`app/components/Counter.tsx`, (source) =>
      replacements.reduce(
        (source, [from, to]) => source.replace(from, to),
        source
          .replace(`export `, modeType + `\n\nexport `)
          .replace(`useState("arabic")`, `useState<Mode>("arabic")`)
          .replace(/throw [^;]+;/gm, `return mode satisfies never;`),
      ),
    );
  },
);

createExerciseDirectory(
  `exercises/05-more-unions`,
  `@workshop/more-unions`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 5 - More Unions`,
      ``,
      "Open `exercises/05-more-unions`. It contains a very simple social media app with a wall that you can post to, but it doesn't yet have a type for those `Post` objects. Each post can be either an image, or some plain text.",
      ``,
      `When declaring object types, you can write them inline, you can also give them an alias, or you can declare them as an interface:`,
      ``,
      "```ts",
      `type ObjectTypeWithAlias = {x: number};`,
      ``,
      `interface ObjectTypeViaInterface {`,
      `  x: number;`,
      `}`,
      "```",
      ``,
      "The advantage of the `interface` approach is that the name is always associated with the type in error messages. It can also sometimes make TypeScript's type checking faster due to better caching optimizations, so I generally prefer interfaces over type aliases.",
      ``,
      `In the previous exercise, we saw how you can use a union to tell TypeScript that a variable has one of two possible values. This doesn't only work with literal types; it also works with object types.`,
    );
  },
  {
    preserve: [
      `app/components/NewPost.client.tsx`,
      `app/components/Wall.tsx`,
      `app/hooks/useIsHydrated.tsx`,
      `app/routes/home.tsx`,
    ],
  },
);

createExerciseDirectory(
  `exercises/05-more-unions-answer`,
  `@workshop/more-unions-valid`,
  ({ writeFile, updateFile }) => {
    const FILE_PATH = `app/types.tsx`;
    const FILE_CONTENTS = `export interface TextPost {
  kind: "text";
  id: string;
  body: string;
}
export interface ImagePost {
  kind: "image";
  id: string;
  src: string;
}

export type Post = TextPost | ImagePost;
`;
    INSTRUCTIONS.push(
      `To fix this, create a new file \`${FILE_PATH}\` with the contents:`,
      ``,
      "```ts",
      FILE_CONTENTS,
      "```",
      ``,
      "This defines two types of post along with a union type called `Post` that can be either one type or the other.",
      ``,
      `Then fix the type errors by specifying the right types for props and state`,
      ``,
      ``,
      " 1. Specify the type for `fileUrl` in `useState` in `NewPost.client.tsx` as `string | null` (see previous exercise for how to specify the type in a `useState` call)",
      " 2. Specify the type for the `onSubmit` property in `NewPost.client.tsx` as `(post: Post) => void`",
      " 3. Specify the type for the `posts` in `useState` in `Wall.tsx` as `Post[]`",
      ``,
    );

    writeFile(FILE_PATH, FILE_CONTENTS);
    updateFile(`app/components/NewPost.client.tsx`, (source) =>
      source
        .replace(
          `{ onSubmit }`,
          `{ onSubmit }: { onSubmit: (post: Post) => void }`,
        )
        .replace(`useState(null)`, `useState<string | null>(null)`)
        .replace(`\n\n`, `\nimport { type Post } from "../types";\n\n`),
    );
    updateFile(`app/components/Wall.tsx`, (source) =>
      source
        .replace(`useState([])`, `useState<Post[]>([])`)
        .replace(`\n\n`, `\nimport { type Post } from "../types";\n\n`),
    );
  },
);

createExerciseDirectory(
  `exercises/06-generics`,
  `@workshop/generics`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 6 - Generics - part 2`,
      ``,
      `### Array Types`,
      ``,
      `There are two styles you can use for declaring an array type:`,
      ``,
      "```tsx",
      `// Using the "generics" syntax:`,
      `type Strings = Array<string>`,
      ``,
      `// Using the array shorthand:`,
      `type Strings = string[]`,
      "```",
      ``,
      `I generally use the shorthand because I find it to be more readable, but they are 100% equivalent so just decide what to use in your team and all use the same style.`,
      ``,
      `One caveat is that if you have an inline union, you need to put it in parentheses when using the array shorthand:`,
      ``,
      "```tsx",
      `// Using the "generics" syntax:`,
      `type NullableStrings = Array<string | null>`,
      ``,
      `// Using the array shorthand:`,
      `type NullableStrings = (string | null)[]`,
      "```",
      ``,
      `### Generic Components`,
      ``,
      `When you declare something with a function, class, interface or type alias, you can use a place holder instead of a concrete type for things that vary. For example:`,
      ``,
      "```tsx",
      `function RenderTwice<T>(props: {value: T, render: (value: T) => React.ReactNode}) {`,
      `  return (`,
      `    <div>`,
      `      {render(value)}`,
      `      {render(value)}`,
      `    </div>`,
      `  );`,
      `}`,
      "```",
      ``,
      "Here we're saying you can give us a value of type `T` and a function that accepts a value of type `T` and that we will support any such value, but will always use the same value consistently. To declare a generic type/function/class, you always add the `<T>` after the name of the type/function/class.",
      ``,
      "> By convention, `T` is used as the name for a generic parameter if there is no better name that can be given to it. If it can have a better name, the convention is to prefix that name with `T` to indicate it is a generic parameter. e.g. `type MyArrayType<TItem> = TItem[]` would be easier to understand than `type MyArrayType<T> = T[]`.",
      ``,
      "Take a look at `exercises/06-generics/app/components/List.tsx` and see if you can remove all the `any` types. The `any` types are a problem because they mean TypeScript isn't really checking our work.",
      ``,
    );
  },
  { preserve: [`app/components/List.tsx`, `app/components/Wall.tsx`] },
);

createExerciseDirectory(
  `exercises/06-generics-answer`,
  `@workshop/generics-valid`,
  ({ updateFile }) => {
    updateFile(`app/components/List.tsx`, (source) =>
      source
        .replace(/ListProps/g, `ListProps<T>`)
        .replace(/any/g, `T`)
        .replace(`function List`, `function List<T>`),
    );
    INSTRUCTIONS.push(
      fs.readFileSync(`scripts/covariance-and-readonly-types.md`, "utf8"),
    );
  },
);

createExerciseDirectory(
  `exercises/07-sync-external-store`,
  `@workshop/sync-external-store`,
  () => {
    INSTRUCTIONS.push(
      fs.readFileSync(`scripts/sync-external-store.md`, "utf8"),
    );
  },
  {
    preserve: [`app/stores/CounterStore.tsx`, `app/components/Counter.tsx`],
  },
);

createExerciseDirectory(
  `exercises/07-sync-external-store-answer`,
  `@workshop/sync-external-store-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      "Take a look at how we're using this in `exercises/07-sync-external-store/app/components/Counter.tsx` and then add types to `exercises/07-sync-external-store/app/stores/CounterStore.tsx` to fix the type errors. The `listener` should have a type of `() => void`.",
      ``,
      "If you want, you could also add an explicit return type to `getCounterValue`. You don't need to specify a return type here, but adding explicit return types is often a really good idea if you find TypeScript is running slower than you expect, or if it's producing errors that you are struggling to understand.",
      ``,
    );
    updateFile(`app/stores/CounterStore.tsx`, (source) =>
      source
        .replace(
          `function getCounterValue()`,
          `function getCounterValue(): number`,
        )
        .replace(
          `function subscribeToCounterChanges(listener)`,
          `function subscribeToCounterChanges(listener: () => void): () => void`,
        )
        .replace(
          `const listeners = new Set()`,
          `const listeners = new Set<() => void>()`,
        ),
    );
  },
);

createExerciseDirectory(
  `exercises/08-react-context`,
  `@workshop/react-context`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 8 - React Context`,
      ``,
      fs.readFileSync(`scripts/react-context.md`, "utf8"),
    );
  },
  {
    preserve: [
      `app/hooks/useNumberMode.tsx`,
      `app/components/Counter.tsx`,
      `app/routes/home.tsx`,
    ],
  },
);

createExerciseDirectory(
  `exercises/08-react-context-answer`,
  `@workshop/react-context-valid`,
  ({ updateFile }) => {
    updateFile(`app/hooks/useNumberMode.tsx`, (source) =>
      source.replace(
        `const NumberModeContext = createContext();`,
        `const NumberModeContext = createContext<"arabic" | "roman">("arabic");`,
      ),
    );
  },
);

createExerciseDirectory(
  `exercises/09-ref-forwarding`,
  `@workshop/ref-forwarding-valid`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 9 - Ref Forwarding`,
      ``,
      "It's often useful to have a component that can render as a `<button>` tag or an `<a>` tag depending on props, because many apps want to apply identical styles to buttons and links. We may want to forward refs to the underlying tags so we can do things like manually focusing the button/link.",
      ``,
      `Refs can be difficult to type correctly but in this example we should be able to use separate ref types for the two types.`,
      ``,
    );
  },
  {
    preserve: [
      `app/components/Button.tsx`,
      `app/components/NewPost.client.tsx`,
    ],
  },
);

createExerciseDirectory(
  `exercises/09-ref-forwarding-answer`,
  `@workshop/ref-forwarding-answer-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      "Replace `any` with `HTMLAnchorElement` or `HTMLButtonElement` as appropriate in `app/components/Button.tsx`.",
      ``,
      `Note that we're using React.ForwardedRef<T> here because it's a simpler type than React.Ref<T>.`,
      ``,
      "> You used to have to wrap components like this with `React.forwardRef`, but now you can just accept `ref` like any other property.",
    );

    updateFile(`app/components/Button.tsx`, (source) =>
      source
        .replace(`any`, `HTMLAnchorElement`)
        .replace(`any`, `HTMLButtonElement`),
    );
  },
);

createExerciseDirectory(
  `exercises/10-rest-params`,
  `@workshop/rest-params`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 10 - Rest Parameters`,
      ``,
      fs.readFileSync(`scripts/rest-params.md`, "utf8"),
      ``,
    );
  },
  {
    preserve: [`app/components/Wall.tsx`, `app/utils/debounce.tsx`],
  },
);

createExerciseDirectory(
  `exercises/10-rest-params-answer`,
  `@workshop/rest-params-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      "See if you can add the missing types to make the `debounce` function work in `exercises/10-rest-params/app/utils/debounce.tsx`",
      ``,
      "> `ReturnType<typeof setTimeout>` is the easiest type to use for a timeout that you later want to pass to `clearTimeout`",
      ``,
    );
    updateFile(`app/utils/debounce.tsx`, (source) =>
      source
        .replace(`fn: () => void`, `fn: (...args: TArgs) => void`)
        .replace(`(...args) =>`, `(...args: TArgs) =>`)
        .replace(
          `function debounce`,
          `function debounce<TArgs extends unknown[]>`,
        ),
    );
  },
);

createExerciseDirectory(
  `exercises/11-intersection-types`,
  `@workshop/intersection-types`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 11 - Intersection Types`,
      ``,
      "Similar to how `A | B` is a type that is either `A` or `B`, `A & B` is a type that is both `A` and `B` at the same time. This doesn't make sense for things like `string` and `number` (a value cannot be both a string and a number), but for objects, it effectively merges the properties of both objects.",
      ``,
    );
  },
  {
    preserve: [`app/components/Hello.tsx`, `app/components/Welcome.tsx`],
  },
);

const HELLO_PROPS_TYPE_INTERSECT = `export type HelloProps = WelcomeProps & { name: string }`;
createExerciseDirectory(
  `exercises/11-intersection-types-answer`,
  `@workshop/intersection-types-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      "Take a look at `exercises/11-intersection-types/app/components/Hello.tsx`. Add a type for the properties for the `Hello` component in terms of the properties of the `Welcome` component:",
      ``,
      "```ts",
      HELLO_PROPS_TYPE_INTERSECT,
      "```",
    );
    updateFile(`app/components/Hello.tsx`, (source) =>
      source
        .replace(
          `import Welcome from`,
          `import Welcome, { type WelcomeProps } from`,
        )
        .replace(
          `export default function Hello({ name, ...otherProps })`,
          HELLO_PROPS_TYPE_INTERSECT +
            `\n\nexport default function Hello({ name, ...otherProps }: HelloProps)`,
        ),
    );
  },
);

const HELLO_PROPS_TYPE_EXTENDS = `export interface HelloProps extends WelcomeProps {
  name: string
}`;
createExerciseDirectory(
  `exercises/12-interface-extends-answer`,
  `@workshop/interface-extends-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      `## Exercise 12 - Interface Extends`,
      ``,
      "There are cases where intersection is the only option, but an alternative in this case is to use `extends` with an interface type. This is generally slightly more performant for TypeScript and may give clearer error messages. Try replacing the intersection type with:",
      ``,
      "```tsx",
      HELLO_PROPS_TYPE_EXTENDS,
      "```",
      ``,
      `Everything should still work just like before.`,
      ``,
    );
    updateFile(`app/components/Hello.tsx`, (source) =>
      source.replace(HELLO_PROPS_TYPE_INTERSECT, HELLO_PROPS_TYPE_EXTENDS),
    );
  },
);

createExerciseDirectory(
  `exercises/13-pick-omit`,
  `@workshop/pick-omit`,
  ({ writeFile, updateFile }) => {
    const WELCOME_UPDATED = `export interface WelcomeProps {
  language: string;
  day: string;
}

export default function Welcome({ language, day }: WelcomeProps) {
  return (
    <>
      welcome to this workshop on using React with {language} on {day}
    </>
  );
}`;
    const HELLO_UPDATED = `import Welcome, { type WelcomeProps } from "./Welcome";

export interface HelloProps extends WelcomeProps {
  name: string;
}

export default function Hello({ name, ...otherProps }: HelloProps) {
  return (
    <p>
      Hello {name}, <Welcome {...otherProps} language="TypeScript" />
    </p>
  );
}`;
    const RENDER_BEFORE = `<Hello name="Your Name" />`;
    const RENDER_UPDATED = `<Hello name="Your Name" day="Thursday" />`;
    writeFile(`app/components/Welcome.tsx`, WELCOME_UPDATED + "\n");
    writeFile(`app/components/Hello.tsx`, HELLO_UPDATED + "\n");
    updateFile(`app/routes/home.tsx`, (source) =>
      source.replace(RENDER_BEFORE, RENDER_UPDATED),
    );
    INSTRUCTIONS.push(
      `## Exercise 13 - Pick and Omit`,
      ``,
      "Sometimes you only want to forward some props, not all props. Lets update our `Welcome` component to take 2 required props:",
      ``,
      "```tsx",
      HELLO_PROPS_TYPE_EXTENDS,
      "```",
      ``,
      "and replace `Hello` with:",
      ``,
      "```tsx",
      HELLO_UPDATED,
      "```",
      ``,
      "Then in `app/routes/home.tsx` you can try to render:",
      ``,
      "```diff",
      `- <Hello name="Your Name" />`,
      `+ ${RENDER_UPDATED}`,
      "```",
      ``,
      "but you'll see a TypeScript error telling you that you need to pass `language` to `Hello`, even though we know `Hello` doesn't use the `language` property.",
      ``,
      `There are two ways you can fix this.`,
      ``,
    );
  },
);

createExerciseDirectory(
  `exercises/13-pick-omit-answer-1`,
  `@workshop/pick-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      `### Pick`,
      ``,
      "You can use `Pick` to explicitly list which props you want to include:",
      ``,
      "```diff",
      `- export interface HelloProps extends WelcomeProps {`,
      `+ export interface HelloProps extends Pick<WelcomeProps, "day"> {`,
      "```",
      ``,
      "this will need updating any time we add new props to the `Welcome` component though.",
    );
    updateFile(`app/components/Hello.tsx`, (source) =>
      source.replace(
        `extends WelcomeProps`,
        `extends Pick<WelcomeProps, "day">`,
      ),
    );
  },
);

createExerciseDirectory(
  `exercises/13-pick-omit-answer-2`,
  `@workshop/omit-valid`,
  ({ updateFile }) => {
    INSTRUCTIONS.push(
      `### Omit`,
      ``,
      "Probably a better option in this particular example is to list the props we don't want to include:",
      ``,
      "```diff",
      `- export interface HelloProps extends Pick<WelcomeProps, "day"> {`,
      `+ export interface HelloProps extends Omit<WelcomeProps, "language"> {`,
      "```",
      ``,
      "this will automatically include any new props added to `Welcome` unless they are also omitted here.",
    );
    updateFile(`app/components/Hello.tsx`, (source) =>
      source.replace(
        `extends Pick<WelcomeProps, "day">`,
        `extends Omit<WelcomeProps, "language">`,
      ),
    );
  },
);

createExerciseDirectory(
  `exercises/14-runtime-validation`,
  `@workshop/runtime-validation-valid`,
  () => {
    INSTRUCTIONS.push(
      `## Exercise 14 - Runtime Type Validation`,
      ``,
      `When you call external APIs, you don't generally have any guarantee about the type that's returned. You can always read the docs and write type definitions to match what you expect, but sometimes you may want to guard against unexpected changes in the API, and sometimes you just make mistakes when reading the docs. If you validate types right away, issues will be easier to debug when the API changes.`,
      ``,
    );
  },
  {
    preserve: [`app/components/Wall.tsx`],
  },
);

const TYPE_SCHEMAS = `import * as t from "funtypes";

const TextPostSchema = t.Named(
  "TextPost",
  t.Object({
    kind: t.Literal("text"),
    id: t.String,
    body: t.String,
  }),
);
export type TextPost = t.Static<typeof TextPostSchema>;

const ImagePostSchema = t.Named(
  "ImagePost",
  t.Object({
    kind: t.Literal("image"),
    id: t.String,
    src: t.String,
  }),
);
export type ImagePost = t.Static<typeof ImagePostSchema>;

export const PostSchema = t.Union(TextPostSchema, ImagePostSchema);
export type Post = t.Static<typeof PostSchema>;`;
const SCHEMA_USAGE = `const parsed = t.Array(PostSchema).safeParse(posts);
if (parsed.success) {
  setPosts(parsed.value);
} else {
  console.error("Error Parsing Posts: " + t.showError(parsed));
}`;
createExerciseDirectory(
  `exercises/14-runtime-validation-answer`,
  `@workshop/runtime-validation-answer-valid`,
  ({ writeFile, updateFile }) => {
    const IMPORT_TS_RESET = `import '@total-typescript/ts-reset';`;
    INSTRUCTIONS.push(
      "To make this happen automatically, you can install `@total-typescript/ts-reset` and add `" +
        IMPORT_TS_RESET +
        "` to one of your files. See https://www.totaltypescript.com/ts-reset for more on the benefits of this.",
      ``,
      "Add the following line to the top of `exercises/14-runtime-validation/app/types.tsx`:",
      ``,
      "```tsx",
      IMPORT_TS_RESET,
      "```",
      ``,
      "You should now have a type error in `exercises/14-runtime-validation-answer/app/components/Wall.tsx` because `posts = JSON.parse(localStorage.getItem('posts') ?? '[]');` makes `posts` have a type of `unknown`. If you want to achieve the same thing here without affecting the entire project, you can replace `let posts` with `let posts: unknown` to tell TypeScript to treat the `posts` as being of an unknown type.",
      ``,
      "To validate the types here, replace the `interface` type declarations in `exercises/13-runtime-validation/app/types.tsx` with:",
      ``,
      "```tsx",
      TYPE_SCHEMAS,
      "```",
      ``,
      "Then you can update `exercises/14-runtime-validation/app/components/Wall.tsx` with:",
      ``,
      "```diff",
      `- setPosts(posts);`,
      ...SCHEMA_USAGE.split("\n").map((line) => `+ ${line}`),
      "```",
      ``,
      "This will produce a detailed error message if the data does not match the schema.",
      ``,
    );
    writeFile(`app/types.tsx`, IMPORT_TS_RESET + "\n" + TYPE_SCHEMAS + "\n");
    updateFile(
      `app/components/Wall.tsx`,
      (source) =>
        `import * as t from "funtypes";\n` +
        source
          .replace(`{ type Post }`, `{ type Post, PostSchema }`)
          .replace(
            /( *)setPosts\(posts\);/m,
            `$1${SCHEMA_USAGE.replace(/\n/g, `\n$1`)}`,
          ),
    );
  },
);

INSTRUCTIONS.push(fs.readFileSync(`scripts/bonus-content.md`, "utf8"));

{
  const spawnResult = spawnSync(`pnpm`, [`install`], { stdio: "inherit" });
  if (spawnResult.status) {
    process.exit(spawnResult.status);
  }
}

for (const { exerciseDirectory, name } of exerciseDirectories) {
  console.log(`Checking ${exerciseDirectory}`);
  const spawnResult = spawnSync(`pnpm`, [`run`, `typecheck`], {
    cwd: exerciseDirectory,
  });
  if ((spawnResult.status === 0) !== name.endsWith("-valid")) {
    console.error(
      `Exercise ${exerciseDirectory} ${
        spawnResult.status === 0 ? "should" : "shouldn't"
      } have type errors`,
    );
    console.error(spawnResult.stdout.toString());
    console.error(spawnResult.stderr.toString());
    process.exit(1);
  }
}

fs.writeFileSync(`INSTRUCTIONS.md`, INSTRUCTIONS.join("\n"));
