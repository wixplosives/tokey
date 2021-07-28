# @tokey/experiments

This repo contains example parsers and tokenizers written with tokey.

# css-value-tokenizer

A simple CSS value tokenizer for tokenizing a single CSS declaration value into array of tokens with the following type: 

```ts
type CSSCodeAst = StringNode | MethodCall | TextNode | CommaNode;
```

> Notice: comments and whitespace are tokenized into a "before" key on the parent token 

## API

```ts
import { createCssValueAST } from "@tokey/css-value-tokenizer";
const parseLineComments = false; // default
const tokens: CSSCodeAst[] = createCssValueAST(`1px solid red`, parseLineComments);

tokens[0].type === 'text'; // true
tokens[0].text === '1px'; // true

```


# separate-shallow-list

TODO

# strip-comments

TODO