import { Seeker } from "../seeker";
import { tokenize } from "../core";
import {
  isComment,
  isStringDelimiter,
  isWhitespace,
  createToken,
} from "../helpers";
import type { Token, Descriptors } from "../types";

type Delimiters = "," | ";" | ":" | "{" | "}" | "[" | "]" | "*";

export type CodeToken = Token<Descriptors | Delimiters>;

export function tokenizeImports(
  source: string,
  blockStart = "{",
  blockEnd = "}"
) {
  return findImports(
    tokenize<CodeToken>(source, {
      isDelimiter,
      isStringDelimiter,
      isWhitespace,
      shouldAddToken,
      createToken,
    }),
    blockStart,
    blockEnd
  );
}

const isDelimiter = (char: string) =>
  char === "{" ||
  char === "}" ||
  char === "[" ||
  char === "]" ||
  char === "," ||
  char === ";" ||
  char === ":" ||
  char === "*";

const shouldAddToken = (type: CodeToken["type"]) =>
  isComment(type) || type === "space" ? false : true;

export interface ImportValue {
  star: boolean;
  defaultName: string | undefined;
  named: Record<string, string> | undefined;
  from: string | undefined;
  errors: string[];
}

function findImports(
  tokens: CodeToken[],
  blockStart: string,
  blockEnd: string
) {
  const imports: ImportValue[] = [];
  const s = new Seeker<CodeToken>(tokens);
  let token;
  let t;
  while ((token = s.next())) {
    if (!token.type) {
      break;
    }
    if (token.value === "import") {
      let errors = [];
      let defaultName;
      let star = false;
      let named = undefined;
      let from;
      t = s.next();
      if (t.type === "string") {
        from = t.value.slice(1, -1);
      } else {
        if (t.type === "text") {
          if (t.value === "from") {
            s.back();
            errors.push("missing name");
          } else {
            defaultName = t.value;
          }
        } else if (t.type === "*") {
          star = true;
          let as = s.peek();
          if (as.value === "as") {
            s.next();
            t = s.peek();
            if (t.type === "text" && t.value !== "from") {
              s.next();
              defaultName = t.value;
            } else {
              errors.push("missing as name");
            }
          } else {
            errors.push("expected as");
          }
        } else if (t.type === ",") {
          errors.push("missing default name");
        }

        if (t.type === blockStart) {
          if (star) {
            errors.push("Invalid named after *");
          }
          s.back();
          const block = s.flatBlock(blockStart, blockEnd, "from");
          if (block) {
            named = processNamedBlock(block);
          } else {
            errors.push("unclosed block");
          }
        } else {
          t = s.peek();
          let hasComma = false;
          if (t.type === ",") {
            hasComma = true;
            s.next();
            t = s.peek();
          }
          if (t.type === blockStart) {
            if (defaultName && !hasComma) {
              errors.push("missing comma after name");
            }
            if (star) {
              errors.push("Invalid named after *");
            }
            const block = s.flatBlock(blockStart, blockEnd, "from");
            if (block) {
              named = processNamedBlock(block);
            } else {
              errors.push("unclosed block");
            }
          } else if (hasComma) {
            errors.push("missing named block");
          }
        }

        t = s.next();
        if (t.value !== "from") {
          s.back();
          errors.push("invalid missing from");
        }
        t = s.next();
        if (t.type === "string") {
          from = t.value.slice(1, -1);
        } else {
          errors.push("invalid missing source");
        }
      }
      imports.push({
        star,
        defaultName,
        named,
        from,
        errors,
      });
    }
  }
  return imports;
}

function processNamedBlock(block: CodeToken[]) {
  const named: Record<string, string> = {};
  const tokens: CodeToken[] = [];
  for (let i = 0; i < block.length; i++) {
    const token = block[i];
    if (token.type === ",") {
      pushToken();
    } else {
      tokens.push(token);
    }
  }
  if (tokens.length) {
    pushToken();
  }

  return named;

  function pushToken() {
    if (tokens.length === 1) {
      const name = tokens[0].value;
      named[name] = name;
    } else if (tokens.length === 3) {
      if (tokens[1].value === "as") {
        named[tokens[0].value] = tokens[2].value;
      }
    }
    tokens.length = 0;
  }
}
