import type {DataTypePredicate, DataType, PredicatePrefix } from './data-types-types';
import type { DataTypeType, KeywordsMap } from './data-types-consts';

export interface Dimension {
  number: number;
  unit: string;
}

export interface DimensionPredicateOptions {
  units?: string | KeywordsMap;
  min?: number;
  max?: number;
}

const NUMBER_REGEX = /^[+-]?(\d+|\d*\.\d+|\d*\.?\d+[eE][+-]?\d+)(\D*$)/;
const HEX_COLOR_REGEX = /^#([a-fA-F\d]{3}){1,2}$/;

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

export const unorderedListPredicate = (keywords: string | KeywordsMap): DataTypePredicate =>
  ast => ast.type === 'text' && (
    typeof keywords === 'string'
      ? ast.text === keywords
      : keywords.has(ast.text)
  );

export const functionPredicate = (functions: string | KeywordsMap): DataTypePredicate =>
  ast => ast.type === 'call' && (
    typeof functions === 'string'
      ? ast.name === functions
      : functions.has(ast.name)
  );

// <hex-color>
// TODO: Match #RRGGBBAA? (Only Internet Explorer doesn't support it)
export const hexColorPredicate = (): DataTypePredicate =>
  ast => ast.type === 'text' && !!ast.text.match(HEX_COLOR_REGEX);

export const dimensionPredicate = (
  {
    units,
    min,
    max,
  }: DimensionPredicateOptions = {},
): DataTypePredicate => ast => {
  if (ast.type === 'text') {
    const dimension = parseDimension(ast.text);
    if (
      !dimension ||
      (min !== undefined && dimension.number < min) ||
      (max !== undefined && dimension.number > max)
    ) { return false; }
    if (min === undefined && max === undefined && dimension.number === 0) {
      return true;
    }
    if (typeof units === 'string') {
      return dimension.unit === units;
    }
    return units ? units.has(dimension.unit) : !dimension.unit;
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
