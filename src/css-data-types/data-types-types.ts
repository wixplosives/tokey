import type { CSSCodeAst } from '../parsers/css-value-tokenizer';
import type { DataTypeType } from './data-types-consts';

export interface AstItem {
  value: CSSCodeAst;
}

export type DataTypePredicate = (
  ast: CSSCodeAst,
  index?: number,
  items?: AstItem[],
  prev?: DataTypeType,
) => number | boolean;

export interface PredicatePrefix {
  dataType: DataTypeType;
  prefixChar: string;
}

export interface DataType {
  dataType: DataTypeType;
  predicate: DataTypePredicate;
  defaultValue: string;
  prefix?: PredicatePrefix;
}
