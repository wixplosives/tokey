import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  createToken,
  getText,
} from "../helpers";
import type { Token, Descriptors } from "../types";
import type { ASTNode } from "./ast-types";

type MutliplierFlags = "*" | "+" | "?" | "#" | "!";
type Delimiters =
  | ","
  | "/"
  | "<"
  | ">"
  | "|"
  | "&"
  | "]"
  | "["
  | MutliplierFlags;
type Multipliers = MutliplierFlags | { min: number; max: number };
export type SeparatorTokens = "space";
export type MDNDataToken = Token<Descriptors | Delimiters>;
export type MDNDataSeparatorTokens = Token<SeparatorTokens>;
export type MDNDataAST = TextNode | TypeRef | Brakets | UnorderedList | Union;

export interface MDNAstNode<T extends string> {
  type: T;
  multiplier?: Multipliers;
}
export interface TextNode extends MDNAstNode<"text"> {
  multiplier?: Multipliers;
  text: string;
}

export interface TypeRef extends MDNAstNode<"ref"> {
  multiplier?: Multipliers;
  isPropertyRef: boolean;
  target: string;
}

export interface Brakets extends MDNAstNode<"brackets"> {
  children: MDNDataAST[];
  multiplier?: Multipliers | "!";
}
export interface UnorderedList extends MDNAstNode<"unordered"> {
  allMandatory: boolean;
  children: MDNDataAST[];
}
export interface Union extends MDNAstNode<"union"> {
  children: MDNDataAST[];
}

export const isSeparatorToken = (
  token: MDNDataToken
): token is MDNDataSeparatorTokens => {
  const { type } = token;
  return type === "space";
};

export function createMDNDataAST(
  source: string,
  parseLineComments = false
): MDNDataAST[] {
  return parseDeclValueTokens(
    tokenize<MDNDataToken>(source, {
      isDelimiter,
      isStringDelimiter,
      isWhitespace,
      shouldAddToken,
      createToken,
      parseLineComments,
    })
  ).ast;
}
const isMultiplier = (char: string) =>
  char === "*" || char === "+" || char === "?" || char === "#" || char === "!";
const isDelimiter = (char: string) =>
  isMultiplier(char) ||
  char === "," ||
  char === "/" ||
  char === "<" ||
  char === ">" ||
  char === "|" ||
  char === "&" ||
  char === "]" ||
  char === "[";

const shouldAddToken = () => true;
function getMultiplier(tokens: MDNDataToken[], idx: number) {
  const token = tokens[idx];
  if (token && isMultiplier(token.type)) {
    return token.type as MutliplierFlags;
  }
  return undefined;
}

function parseDeclValueTokens(
  tokens: MDNDataToken[],
  startAtIdx = 0,
  ignoreUnions = false
): { ast: MDNDataAST[]; stoppedAtIdx: number } {
  const ast: MDNDataAST[] = [];
  for (let i = startAtIdx; i < tokens.length; i++) {
    const token = tokens[i];
    const nextToken = tokens[i + 1];
    if (
      token.type === "&" &&
      nextToken &&
      nextToken.type === "&" &&
      !ignoreUnions
    ) {
      const firstExpression = ast.pop()!;
      const { ast: children, stoppedAtIdx } = parseDeclValueTokens(
        tokens,
        i + 2,
        true
      );

      const ulNode: UnorderedList = {
        type: "unordered",
        allMandatory: true,
        children: [firstExpression, ...children],
      };
      ast.push(ulNode);
      return {
        ast,
        stoppedAtIdx,
      };
    } else if (token.type === "|" && !ignoreUnions) {
      const isUnorderedList = nextToken && nextToken.type === "|";
      const firstExpression = ast.pop()!;
      const { ast: children, stoppedAtIdx } = parseDeclValueTokens(
        tokens,
        isUnorderedList ? i + 2 : i + 1,
        true
      );
      if (isUnorderedList) {
        const ulNode: UnorderedList = {
          allMandatory: false,
          type: "unordered",
          children: [firstExpression, ...children],
        };
        ast.push(ulNode);
      } else {
        const unionNode: Union = {
          type: "union",
          children: [firstExpression, ...children],
        };
        ast.push(unionNode);
      }
      return {
        ast,
        stoppedAtIdx,
      };
    } else if (token.type === "[") {
      const { ast: children, stoppedAtIdx } = parseDeclValueTokens(
        tokens,
        i + 1
      );
      const braketsNode: Brakets = {
        type: "brackets",
        children,
      };
      const multiplier = getMultiplier(tokens, stoppedAtIdx + 1);
      if (multiplier) {
        braketsNode.multiplier = multiplier;
        i = stoppedAtIdx + 2;
      } else {
        i = stoppedAtIdx + 1;
      }
      ast.push(braketsNode);
    } else if (token.type === "]") {
      return {
        stoppedAtIdx: i,
        ast,
      };
    } else if (token.type === "<" && tokens[i + 2].type === ">") {
      const idToken = tokens[i + 1];
      const isPropertyRef =
        idToken.value.startsWith('"') && idToken.value.endsWith('"');
      const refName = isPropertyRef
        ? idToken.value.slice(1, -1)
        : idToken.value;
      const refNode: TypeRef = {
        type: "ref",
        target: refName,
        isPropertyRef,
      };
      const multiplier = getMultiplier(tokens, i + 3);
      if (multiplier) {
        refNode.multiplier = multiplier;
        i += 1;
      }
      ast.push(refNode);
      i += 2;
    } else if (token.type == "text") {
      const textNode: TextNode = {
        type: "text",
        text: token.value,
      };
      const multiplier = getMultiplier(tokens, i + 1);
      if (multiplier) {
        textNode.multiplier = multiplier;
        i += 1;
      }
      ast.push(textNode);
    }
  }

  return {
    ast,
    stoppedAtIdx: tokens.length,
  };
}
