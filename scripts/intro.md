# TypeScript for React Developers

## Exercise 1

Take a look at exercises/01-template. This was generated using:

```
npx create-react-router@latest
```

Note the following:

- The `tsconfig.json` file determines how TypeScript is configured. You always want `"strict": true`
- `.js` files became `.ts` or `.tsx` - must be `.tsx` if they contain JSX code
- In `package.json`, notice the `@types/` packages

I modified the default template:

1. To add `noUncheckedIndexedAccess` to `tsconfig.json`. I recommend setting this for any greenfield projects, but it can be difficult for migrating existing projects.
2. I changed `exercises/01-template/app/routes/home.tsx` to show "Welcome to TypeScript for React Developers" and removed the default Welcome component.
3. I changed the name of the package to work with our exercises.
