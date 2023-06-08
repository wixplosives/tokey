import {
    tokenize,
    isStringDelimiter,
    isWhitespace,
    createToken,
    getJSCommentStartType,
    getMultilineCommentStartType,
    isCommentEnd,
    getUnclosedComment,
} from '@tokey/core';
import type { Token, Descriptors } from '@tokey/core';

type Delimiters = '(' | ')' | ',' | '/' | '+' | '-' | '*' | '#' | '.' | '%';

export type CSSValueToken = Token<Descriptors | Delimiters>;

export function tokenizeValue(source: string, options: { offset?: number } = {}) {
    const parseLineComments = false; // why would that be a choice?
    return tokenize<CSSValueToken>(source, {
        isDelimiter,
        isStringDelimiter(char: string, previousChar: string) {
            return previousChar !== `\\` && isStringDelimiter(char);
        },
        isWhitespace,
        shouldAddToken: () => true,
        createToken,
        getCommentStartType: parseLineComments
            ? getJSCommentStartType
            : getMultilineCommentStartType,
        isCommentEnd,
        getUnclosedComment,
        shouldClose(ch, previousChar) {
            if (isWhitespace(ch) && isWhitespace(previousChar)) {
                return false;
            }
            if (previousChar === '\\') {
                return false;
            }
            const isAllowedChars = /[-_a-zA-Z0-9]/.test(ch);
            if (isAllowedChars) {
                return false;
            }
            // match css identifier char don't allow non-ascii chars
            return ch.charCodeAt(0) <= 127;
        },
        offset: options.offset,
    });
}

const isDelimiter = (char: string, previousChar: string) =>
    previousChar !== '\\' &&
    (char === '(' ||
        char === ')' ||
        char === '[' ||
        char === ']' ||
        char === '<' ||
        char === '>' ||
        char === '{' ||
        char === '}' ||
        char === '@' ||
        char === '|' ||
        char === ':' ||
        char === ';' ||
        char === '~' ||
        char === '&' ||
        char === ',' ||
        char === '/' ||
        char === '+' ||
        char === '-' ||
        char === '*' ||
        char === '#' ||
        char === '%' ||
        char === '.');
