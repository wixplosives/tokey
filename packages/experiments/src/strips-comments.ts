import {
    tokenize,
    isStringDelimiter,
    isWhitespace,
    createToken,
    getText,
    isComment,
    getJSCommentStartType,
    getMultilineCommentStartType,
    isCommentEnd,
    getUnclosedComment,
    Token,
    Descriptors,
} from '@tokey/core';

const isDelimiter = () => false;
const shouldAddToken = (type: Descriptors) => !isComment(type);

export function stripComments(source: string, parseLineComments = true) {
    const tokens = tokenize<Token<Descriptors>>(source, {
        isDelimiter,
        isStringDelimiter,
        isWhitespace,
        shouldAddToken,
        createToken,
        getCommentStartType: parseLineComments
            ? getJSCommentStartType
            : getMultilineCommentStartType,
        isCommentEnd,
        getUnclosedComment,
    });

    return getText(tokens);
}
