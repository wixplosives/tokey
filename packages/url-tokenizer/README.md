# @tokey/url-tokenizer

Simple tokenizer for css url() syntax

This tokenizer will find all url() usages in a css text and return array of grouped tokens with the following type: 

```ts
type CSSCodeTokenGroup = {
  tokens: CSSCodeToken[];
  start: number;
  end: number;
}
```

## API

```ts
import { tokenizeCSSUrls, CSSCodeTokenGroup } from "@tokey/url-tokenizer";

const parseLineComments = false; // default

const urlsTokenGroups: CSSCodeTokenGroup[] = tokenizeCSSUrls(`
  .class {
    background: url("http://location");
  }
`, parseLineComments);
```