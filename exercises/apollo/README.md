# Example GraphQL API

To build:

```
yarn schema && yarn build
```

To run:

```
yarn start
```

You can then run a query like:

```
query {
  contacts {
    name
    accounts {
      value
      type
    }
  }
}
```

in the graphiql editor at `http://localhost:3000/graphql`.

Project structure:

- src/graphql/mutations - example mutations. The file names match the name of the mutation.
- src/graphql/resolvers - example resolvers. The file names of resolvers on the root query match the name of the field. File names of resolvers on objects are of the form `objectNameFieldName.ts`
- src/graphql/scalars - example scalar definitions
- src/graphql/codegen.yml - config to tell apollo-resolver-types where to find the various types used on the server side.
- src/graphql/ResolverContext.ts - a class for the resolver context, this would normally include authentication, a logger & potentially some caches that only last for the given request.
- src/graphql/ResolverTypes.ts - this binds the types generated from the schema up with the apollo-resolver-types lib to mark necessary resolvers as required.
- src/graphql/schema.graphql - the graphql schema exposed to clients of this service
- src/graphql/index.ts - the koa/apollo server.
