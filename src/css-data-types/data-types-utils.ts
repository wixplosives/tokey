import type {DataTypePredicate, DataType, PredicatePrefix } from './data-types-types';
import type { DataTypeType } from './data-types-consts';

export interface Dimension {
  number: number;
  unit: string;
}

const NUMBER_REGEX = /^[+-]?(\d+|\d*\.\d+|\d*\.?\d+[eE][+-]?\d+)(\D*$)/;

export const parseDimension = (text: string): Dimension | undefined => {
  const number = parseFloat(text);
  if (!isNaN(number)) {
    const isValidNumberMatch = text.match(NUMBER_REGEX);
    return isValidNumberMatch
      ? { number, unit: isValidNumberMatch[2] || '' }
      : undefined;
  }
  return;
};

export const singleKeywordPredicate = (keyword: string): DataTypePredicate =>
  ast => ast.type === 'text' && ast.text === keyword;

export const unorderedListPredicate = (keywords: string[]): DataTypePredicate =>
  ast => ast.type === 'text' && keywords.includes(ast.text);

export const functionPredicate = (functionNames: string[]): DataTypePredicate =>
  ast => ast.type === 'call' && functionNames.includes(ast.name);

// <hex-color>
// TODO: Match #RRGGBBAA? (Only Internet Explorer doesn't support it)
export const hexColorPredicate = (): DataTypePredicate =>
  ast => ast.type === 'text' && !!ast.text.match(/^#([a-fA-F\d]{3}){1,2}$/);

export const dimensionPredicate = (
  units?: string[],
  min?: number,
  max?: number,
): DataTypePredicate => ast => {
  if (ast.type === 'text') {
    const dimension = parseDimension(ast.text);
    return !!dimension && (
      (min === undefined || dimension.number >= min) &&
      (max === undefined || dimension.number <= max) &&
      (min === undefined && max === undefined && dimension.number === 0 || (
        units === undefined
          ? !dimension.unit
          : units.includes(dimension.unit)
      ))
    );
  }

  return false;
};

export const createDataType = (
  dataType: DataTypeType,
  predicates: DataTypePredicate[],
  prefix?: PredicatePrefix,
): DataType => ({
  dataType,
  prefix,
  predicate: (ast, index, items, prev) => {
    let predicateIndex = index;
    let predicateAst = ast;
    if (prefix) {
      if (
        index === undefined ||
        !items ||
        prev !== prefix.dataType ||
        ast.type !== 'text' ||
        ast.text !== prefix.prefixChar
      ) {
        return false;
      }
      predicateIndex = index + 1;
      if (!items[predicateIndex]) {
        return false;
      }
      predicateAst = items[predicateIndex].value;
    }
    for (const predicate of predicates) {
      const predicateMatch = predicate(predicateAst, predicateIndex, items, prev);
      if (!!predicateMatch) {
        return !prefix ? predicateMatch : Number(predicateMatch) + 1;
      }
    }
    return false;
  },
});
