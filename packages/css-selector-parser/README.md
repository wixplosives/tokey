# @tokey/css-selector-parser

[![npm version](https://img.shields.io/npm/v/@tokey/css-selector-parser.svg)](https://www.npmjs.com/package/@tokey/css-selector-parser)
[![npm bundle size](https://badgen.net/bundlephobia/minzip/@tokey/css-selector-parser?label=minzip&cache=300)](https://bundlephobia.com/result?p=@tokey/css-selector-parser)

A flexible css selector parser.

**Features**

- **safe** - return a value that can always be stringified back
- **track position** - `start/end` on every AST node
- **spacing is decoration** - `before/after` never affects selector meaning
- **extensive selector support**
    - `comments` - comments parsed wherever they are placed 🤪
    - `escaping` - support escaped dots, slashes, quotation marks, etc.
    - `namespace` - `universal` and `type` selectors namespace with validation flags on the AST 
    - `An+B of` - Nth selector AST with inner parts and validation flags for each part
    - `combinators` - separate spaces from descendant correctly and place validation flag on combinators that directly proceed other combinators
    - `nesting` - support future `&` selector
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

### parse

`parseCssSelector` accepts a selector list string and returns an AST representation of that 

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

### stringify

`stringifySelectorAst` converts an AST node back into its string representation.

```js
import { stringifySelectorAst } from '@tokey/css-selector-parser';

stringifySelectorAst(
    parseCssSelector(`.class`);
); // ".class"
```

### walk

`walk` traverse each node of the selector AST from start to end. 

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
- **walk.skipNested** - prevent nested traversal
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
    parseCssSelector(`.one:is(:not(.two))`),
    (node) => {
        // .one
        // :is()
        // :not()
        // .two
    },
    {
        ignoreList: [`selector`] // visit will not be called on selector node
    }
);
```

