# @tokey/imports-parser


Parser for `esm` like import syntax with support for "functional" tagged imports

```ts
import Name1, { Name2, Name3 as Name4, Tag(Name5) } from "request";
```

The output of parsing an import is represented with the following type:

```ts
interface ImportValue {
  star: boolean;
  defaultName: string | undefined;
  named: Record<string, string> | undefined;
  tagged: Record<string, Record<string, string>> | undefined;
  from: string | undefined;
  errors: string[];
  start: number;
  end: number;
}
```

 > Notice that this parser can parse broken/incomplete syntax and all the errors will be available in the "error" field.

 > The parser parses multiple imports and the result is an `ImportValue[]`


## API

```ts
import { parseImports, ImportValue } from "@tokey/imports-parser";

const code = `
    import { a } from "request/a";
    import "request/b";
`;
const startNamedBlock = '{'; // default
const endNamedBlock = '}'; // default
const shouldParseTags = false // default

const results: ImportValue[] = parseImports(code, startNamedBlock, endNamedBlock, shouldParseTags);

const firstImport = results[0];
firstImport.from === 'request/a'; // true
firstImport.named['a'] === 'a'; // true

```
