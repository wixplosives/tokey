import type { CSSCodeAst } from '../parsers/css-value-tokenizer';
import type { AstItem, DataType } from '../css-data-types';

export interface ParseShorthandAPI {
  isExpression(node: CSSCodeAst): boolean;
  getValue(node: CSSCodeAst): CSSCodeAst[];
}

export interface EvaluatedAst extends AstItem {
  origin?: CSSCodeAst;
}

export type AstEvaluator<T> = (ast: CSSCodeAst[], api: ParseShorthandAPI) => T[];

export interface DataTypeMatch {
  matchAmount: number;
  matchIndex: number;
}

export type OpenedShorthand<T extends string> = Record<T, EvaluatedAst | EvaluatedAst[] | EvaluatedAst[][]>;

type GenericShorthandOpener<S, T extends string> = (
  shortHand: S[],
  api: ParseShorthandAPI,
  shallow?: boolean,
) => OpenedShorthand<T>;

export type ShorthandOpener<T extends string> = GenericShorthandOpener<CSSCodeAst, T>;
export type ShorthandOpenerInner<T extends string> = GenericShorthandOpener<EvaluatedAst, T>;

export interface UnorderedListShorthandOptions {
  shallow?: boolean;
  commonValue?: string;
}

export interface ShorthandPart<T extends string> {
  prop: string;
  dataType: DataType;
  opener?: ShorthandOpenerInner<T>;
  openedProps?: T[],
  multipleItems?: boolean;
  mandatory?: boolean;
  divider?: boolean;
}

export interface ShorthandOpenerData<T extends string> {
  prop: string;
  singleKeywordPart?: ShorthandPart<T>;
  parts: ShorthandPart<T>[];
  openShorthand: (
    astNodes: EvaluatedAst[],
    api: ParseShorthandAPI,
    parts: ShorthandPart<T>[],
    shallow?: boolean,
  ) => OpenedShorthand<T>;
}
