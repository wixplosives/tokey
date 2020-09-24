# Toky

Toky is a configurable general purpose code tokenizer that supports comments and strings skipping. When you need to find specific structure in a code block like: imports in Javascript, or urls in CSS, and you don't want to use a full blown parser you can create a specific tokenizer to do the job.

## API

The core api is super simple just one function

```ts
type Descriptors =
  | "string"
  | "text"
  | "line-comment"
  | "multi-comment"
  | "unclosed-string"
  | "unclosed-comment"
  | "space";

interface Token<Types = Descriptors> {
  type: Types;
  start: number;
  end: number;
  value: string;
}

interface Options<T extends Token<unknown>> {
  shouldAddToken(type: T["type"], value: string): boolean;
  isStringDelimiter(char: string): boolean;
  isDelimiter(char: string): boolean;
  isWhitespace(char: string): boolean;
  createToken(value: string, type: T["type"], start: number, end: number): T;
}

function tokenize<T extends Token<unknown>>(
  source: string,
  {
    isDelimiter,
    isStringDelimiter,
    isWhitespace,
    shouldAddToken,
    createToken,
  }: Options<T>
): T[];
```

You can extend the tokenizer by providing the options and extending the Token type.

```ts

type Delimiters = "(" | ")" | "," | ";" | ":";
type CSSCodeToken = Token<Descriptors | Delimiters>;
tokenize<CSSCodeToken>(source, {...})

```

## How is works

The main idea is looping over all the characters and splitting tokens via `isDelimiter`, `isWhitespace` and `isStringDelimiter`.
After that you can decide about the shape of the token with `createToken` and if it should be included with `shouldAddToken`

## What to do with the tokens

TBD Seeker

## Helpers

TBD helpers
