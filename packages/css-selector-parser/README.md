# @tokey/css-selector-parser

[![npm version](https://img.shields.io/npm/v/@tokey/css-selector-parser.svg)](https://www.npmjs.com/package/@tokey/css-selector-parser)
[![npm bundle size](https://badgen.net/bundlephobia/minzip/@tokey/css-selector-parser?label=minzip&cache=300)](https://bundlephobia.com/result?p=@tokey/css-selector-parser)

A flexible CSS selector parser with support for the latest syntax and features.

**Features**

- **safe** - returns an AST that can always be stringified to its original source
- **track offset** - `start/end` on every AST node
- **validations** - applies validation flags to ast nodes marking their syntax correctness
- **spacing as decoration** - visual spacing is represented in `before/after` and never affects selector meaning
- **extensive selector support**
    - `comments` - comments parsed wherever they are placed 🤪
    - `escaping` - support escaped dots, slashes, quotation marks, etc.
    - `An+B of` - Nth selector AST with inner parts and validation flags for each part
    - `combinators` - correctly identify and mark spaces/combinators with validation flags
    - `nesting` - support future `&` selector
    - `namespace` - `universal` and `type` selectors [namespace](https://developer.mozilla.org/en-US/docs/Web/CSS/@namespace#specifying_default_and_prefixed_namespaces) with validation flags on the AST 
- **typed** - built with Typescript
- **tested** - thoroughly tested

## Installation

Using NPM:
```
npm install @tokey/css-selector-parser
```

Using Yarn:
```
yarn add @tokey/css-selector-parser
```

## Usage

### Parsing

`parseCssSelector` - accepts a selector list string and returns an AST representation of that 

```js
import { parseCssSelector } from '@tokey/css-selector-parser';

const selectorList = parseCssSelector(`.card, .box`);
/*
[
    {
        type: "selector",
        start: 0,
        end: 5,
        before: "",
        after: "",
        nodes: [
            {
                type: "class",
                value: "card",
                start: 0,
                end: 5,
                dotComments: [],
            },
        ],
    },
    {
        type: "selector",
        start: 6,
        end: 11,
        before: " ",
        after: "",
        nodes: [
            {
                type: "class",
                value: "box",
                start: 7,
                end: 11,
                dotComments: [],
            },
        ],
    }
]
*/
```

### Stringify

`stringifySelectorAst` - converts an AST node back into its string representation.

```js
import { stringifySelectorAst } from '@tokey/css-selector-parser';

stringifySelectorAst(
    parseCssSelector(`.class`);
); // ".class"
```

### Traversing

`walk` - traverse each node of the selector AST from start to end. 

The visit call is given:
- **node** - the current node in the traversal
- **index** - the index of the node withing its siblings
- **nodes** - the node shallow sibling array
- **parents** - the node parents array

```js
import { walk } from '@tokey/css-selector-parser';

walk(
    parseCssSelector(`.one + three(#four, [five]), /*six*/ ::seven:eight`),
    (node: SelectorNode, index: number, nodes: SelectorNode[], parents: SelectorNode[]) => {
        // calling order:

        // selector:  .one + three(#four, [five])
        // .one
        // +
        // three
        // selector: #four
        // #four
        // selector:  [five]
        // [five]
        // selector:  /*six*/ ::seven:eight
        // /*six*/
        // ::seven
        // :eight
    }
);
```

> Note: comments within class, pseudo-class and pseudo-element are not traversed at the moment
>
> for example: `./*what?!*/a`. 

#### control traversal

The transversal can be controlled with the return value of each visit:
- **walk.skipNested** - prevent farther nested traversal from the current node
- **walk.skipCurrentSelector** - prevent visit on other nodes on the same selector
- **walk.stopAll** - ends walk

```js
import { walk } from '@tokey/css-selector-parser';

walk(
    parseCssSelector(`selector`),
    (node) => {
        // return walk.skipNested;
        // return walk.skipCurrentSelector;
        // return walk.stopAll;
    }
);
```

#### walk options

`visitList/ignoreList` limit the types of AST calls to the visit function, but does not prevent traversal of nested nodes.

```js
walk(
    parseCssSelector(`.one:is(:not(/*comment*/.two))`),
    (node) => {
        // .one
        // :is()
        // :not()
        // .two
    },
    {
        // visit will not be called on selector or comment nodes
        ignoreList: [`selector`, `comment`] 
    }
);
```

## Design decisions

### Escaping

The parser supports character escaping, but will not escape anything by itself. **Make sure to escape any value before setting it manually into an AST node.**

### Functional selectors

The parser supports native `pseudo-classes/pseudo-elements` functional selectors, but also parses other selectors in the same way. So `type`/`id`/`class`/`attribute`/`nesting` selectors are all parsed with `nodes` in case they are followed by a pair of parentheses (e.g. `element(nodeA, nodeB)`). **This syntax is not valid CSS and should be handled before served to a CSS consumer**

### Nth selector

`:nth-child`, `:nth-last-child`, `:nth-of-type` and `:nth-last-of-type` are a set of special cases where `An+B of` syntax is expected.