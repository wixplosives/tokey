import type { Token } from "./types";

/**
 * Minimal token traverse helper used to create structure from tokens
 */
export class Seeker<T extends Token<unknown>> {
  index = -1;
  constructor(public tokens: T[]) {}
  next() {
    this.index++;
    return this.tokens[this.index] || {};
  }
  back() {
    this.index--;
  }
  peekBack() {
    return this.tokens[this.index - 1] || { type: "" };
  }
  peek(num = 1) {
    return this.tokens[this.index + num] || { type: "" };
  }
  flatBlock(
    start: string,
    end: string,
    isEndError?: (token: Token<any>) => boolean
  ) {
    let token = this.next();
    if (token.type !== start) {
      return [];
    }
    const block = [];
    let endIndex;
    while ((token = this.next())) {
      if (!token.type) {
        if (endIndex !== undefined) {
          this.index = endIndex - 1;
        }
        return;
      }
      if (isEndError && isEndError(token)) {
        endIndex = this.index;
      }
      if (token.type === end) {
        return block;
      } else {
        block.push(token);
      }
    }
    return [];
  }
}
