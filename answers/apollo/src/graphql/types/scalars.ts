// This should file would normally be published as an NPM
// package so consumers of the graphql API can use the
// same types for scalars and enums

export interface GooglePerson {
  name: string;
  whatever: number;
}

export type TrimmedString = string;
