import type { AstItem, DataTypePredicate } from './data-types-types';

import {
  AUTO_KEYWORD,
  BG_POSITION_CENTER_KEYWORD,
  BG_POSITION_HORIZONTAL_KEYWORDS,
  BG_POSITION_VERTICAL_KEYWORDS,
  REPEAT_STYLE_MULTIPLE_KEYWORDS,
  FONT_STYLE_OBLIQUE_KEYWORD,
} from './data-types-consts';
import { singleKeywordPredicate, unorderedListPredicate } from './data-types-utils';

const PREDICATE_STATE_START = 'start';

type StateMachineKey<T extends string> = typeof PREDICATE_STATE_START | T;

interface PredicateStateMatch<T extends string> {
  predicate: DataTypePredicate;
  nextKey?: StateMachineKey<T>;
  mustContinue?: boolean;
}

export type StateMachine<T extends string> = Array<Partial<Record<StateMachineKey<T>, PredicateStateMatch<T>[]>>>;

export const stateMachineDataTypeMatch = <T extends string>(
  items: AstItem[],
  index: number,
  stateMachine: StateMachine<T>,
) => {
  let returnMatch = 0;

  let valueIndex = 0;
  let currKey: StateMachineKey<T> | undefined = PREDICATE_STATE_START;

  if (!currKey || !stateMachine[valueIndex]) {
    return returnMatch;
  }

  let match: PredicateStateMatch<T> | undefined;
  do {
    let newMatch: PredicateStateMatch<T> | undefined;
    const currItem = items[index + valueIndex];
    if (currItem) {
      const possibleMatches: PredicateStateMatch<T>[] | undefined = stateMachine[valueIndex][currKey];
      if (possibleMatches) {
        for (let i = 0; i < possibleMatches.length; i++) {
          const stateMatch = possibleMatches[i];
          if (stateMatch.predicate(currItem.value)) {
            newMatch = stateMatch;
            break;
          }
        }
        if (newMatch) {
          returnMatch++;
          currKey = newMatch.nextKey;
        }
      }
    }
    if (!newMatch && match && match.mustContinue) {
      returnMatch--;
    }
    match = newMatch;
  } while (match && currKey && stateMachine[++valueIndex]);

  return returnMatch;
};

// <bg-position>
type BgPositionStateMachineKey =
 | '<length-percentage>'
 | 'center'
 | 'left | right'
 | 'top | bottom'
 | '3-value'
 | '[ left | right ] <length-percentage>'
 | '[ top | bottom ] <length-percentage>'
 | '4-value'
;
export const bgPositionStateMachine = (
  lengthPercentagePredicate: DataTypePredicate,
): StateMachine<BgPositionStateMachineKey> => {
  const centerPredicate = singleKeywordPredicate(BG_POSITION_CENTER_KEYWORD);
  const horizontalPredicate = unorderedListPredicate(BG_POSITION_HORIZONTAL_KEYWORDS);
  const verticalPredicate = unorderedListPredicate(BG_POSITION_VERTICAL_KEYWORDS);
  const allEdgesPredicate = unorderedListPredicate(BG_POSITION_HORIZONTAL_KEYWORDS.concat(BG_POSITION_VERTICAL_KEYWORDS));

  /*
    syntax: [
      [ left | center | right | top | bottom | <length-percentage> ] |
      [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] |
      [ center | [ left | right ] <length-percentage>? ]
        && [ center | [ top | bottom] <length-percentage>? ]
    ]
  */
  return [
    {
      [PREDICATE_STATE_START]: [
        // <length-percentage>
        { predicate: lengthPercentagePredicate, nextKey: '<length-percentage>'},
        // center
        { predicate: centerPredicate, nextKey: 'center' },
        // left | right
        { predicate: horizontalPredicate, nextKey: 'left | right' },
        // top | bottom
        { predicate: verticalPredicate, nextKey: 'top | bottom' },
      ],
    },
    {
      '<length-percentage>': [
        // <length-percentage> <length-percentage> $
        { predicate: lengthPercentagePredicate },
        // <length-percentage> center $
        { predicate: centerPredicate },
        // <length-percentage> [ top | bottom ] $
        { predicate: verticalPredicate },
      ],
      'center': [
        // center <length-percentage> $
        { predicate: lengthPercentagePredicate },
        // center center $
        { predicate: centerPredicate },
        // center [ left | right | top | bottom ]
        { predicate: allEdgesPredicate, nextKey: '3-value' },
      ],
      'left | right': [
        // [ left | right ] <length-percentage>
        { predicate: lengthPercentagePredicate, nextKey: '[ left | right ] <length-percentage>' },
        // [ left | right ] center $
        { predicate: centerPredicate },
        // [ left |right ] [ top | bottom ]
        { predicate: verticalPredicate, nextKey: '3-value' },
      ],
      'top | bottom': [
        // [ top | bottom ] <length-percentage>
        { predicate: lengthPercentagePredicate, nextKey: '[ top | bottom ] <length-percentage>', mustContinue: true },
        // [ top | bottom ] center $
        { predicate: centerPredicate },
        // [ top | bottom ] [ left |right ]
        { predicate: horizontalPredicate, nextKey: '3-value' },
      ],
    },
    {
      '3-value': [
        // center [ left | right | top | bottom ] <length-percentage> $
        { predicate: lengthPercentagePredicate },
      ],
      '[ left | right ] <length-percentage>': [
        // [ left | right ] <length-percentage> center $
        { predicate: centerPredicate },
        // [ left | right ] <length-percentage> [ top | bottom ]
        { predicate: verticalPredicate, nextKey: '4-value' },
      ],
      '[ top | bottom ] <length-percentage>': [
        // [ top | bottom ] <length-percentage> center $
        { predicate: centerPredicate },
        // [ top | bottom ] <length-percentage> [ left | right ]
        { predicate: horizontalPredicate, nextKey: '4-value' },
      ],
    },
    {
      '4-value': [
        // [ left | right ] <length-percentage> [ top | bottom ] <length-percentage> $
        // [ top | bottom ] <length-percentage> [ left | right ] <length-percentage> $
        { predicate: lengthPercentagePredicate },
      ],
    },
  ];
};

// <bg-size>
type BgSizeStateMachineKey =
 | '2-value'
;
export const bgSizeStateMachine = (
  lengthPercentagePredicate: DataTypePredicate,
): StateMachine<BgSizeStateMachineKey> => {
  const multipleValuesKeywordPredicate = singleKeywordPredicate(AUTO_KEYWORD);

  // syntax: [ <length-percentage> | auto ]{1,2}
  return [
    {
      [PREDICATE_STATE_START]: [
        // <length-percentage>
        { predicate: lengthPercentagePredicate, nextKey: '2-value' },
        // auto
        { predicate: multipleValuesKeywordPredicate, nextKey: '2-value' },
      ],
    },
    {
      '2-value': [
        // [ <length-percentage> | auto ]{2} $
        { predicate: lengthPercentagePredicate },
        { predicate: multipleValuesKeywordPredicate },
      ],
    },
  ];
};

// <repeat-style>
type RepeatStyleStateMachineKey =
 | '2-value'
;
export const repeatStyleStateMachine = (): StateMachine<RepeatStyleStateMachineKey> => {
  const multipleValuesPredicate = unorderedListPredicate(REPEAT_STYLE_MULTIPLE_KEYWORDS);

  // syntax: [ repeat | space | round | no-repeat ]{1,2}
  return [
    {
      [PREDICATE_STATE_START]: [
        // [ repeat | space | round | no-repeat ]{1}
        { predicate: multipleValuesPredicate, nextKey: '2-value' },
      ],
    },
    {
      '2-value': [
        // [ repeat | space | round | no-repeat ]{2} $
        { predicate: multipleValuesPredicate },
      ],
    },
  ];
};

// <font-style>
type FontStyleStateMachineKey =
 | '2-value'
;
export const fontStyleStateMachine = (
  anglePredicate: DataTypePredicate,
): StateMachine<FontStyleStateMachineKey> => {
  const obliquePredicate = singleKeywordPredicate(FONT_STYLE_OBLIQUE_KEYWORD);

  // syntax: oblique <angle>?
  return [
    {
      [PREDICATE_STATE_START]: [
        // oblique
        { predicate: obliquePredicate, nextKey: '2-value' },
      ],
    },
    {
      '2-value': [
        // oblique <angle> $
        { predicate: anglePredicate },
      ],
    },
  ];
};
