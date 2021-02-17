import type { AstItem, DataType } from './data-types-types';

import {
  DataTypeType,
  DEFAULT_DIMENSION,
  UNIVERSAL_KEYWORDS,
  DEFAULT_UNIVERSAL,
  AUTO_KEYWORD,
  LENGTH_UNITS_MAP,
  CALC_FUNCTION,
  PERCENTAGE_UNIT,
  LENGTH_PERCENTAGE_UNITS,
  ANGLE_UNITS,
  LINE_STYLE_KEYWORDS,
  DEFAULT_LINE_STYLE,
  LINE_WIDTH_KEYWORDS,
  DEFAULT_LINE_WIDTH,
  COLOR_SPACE_FUNCTIONS,
  COLOR_KEYWORDS,
  DEFAULT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  OUTLINE_COLOR_INVERT_KEYWORD,
  GRADIENT_FUNCTIONS,
  IMAGE_FUNCTIONS,
  BG_IMAGE_NONE_KEYWORD,
  DEFAULT_BG_IMAGE,
  DEFAULT_BG_POSITION,
  BG_SIZE_KEYWORDS,
  DEFAULT_BG_SIZE,
  REPEAT_STYLE_SINGLE_KEYWORDS,
  REPEAT_STYLE_MULTIPLE_KEYWORDS,
  DEFAULT_REPEAT_STYLE,
  ATTACHMENT_KEYWORDS,
  DEFAULT_ATTACHMENT,
  BOX_KEYWORDS,
  DEFAULT_BACKGROUND_ORIGIN,
  DEFAULT_BACKGROUND_CLIP,
  FONT_SINGLE_VALUE_KEYWORDS,
  FONT_STYLE_KEYWORDS,
  FONT_STYLE_OBLIQUE_KEYWORD,
  DEFAULT_FONT_STYLE,
  FONT_VARIANT_KEYWORDS,
  DEFAULT_FONT_VARIANT,
  FONT_WEIGHT_KEYWORDS,
  FONT_WEIGHT_NUMBER_RANGE_MIN,
  FONT_WEIGHT_NUMBER_RANGE_MAX,
  DEFAULT_FONT_WEIGHT,
  FONT_STRETCH_KEYWORDS,
  DEFAULT_FONT_STRETCH,
  FONT_SIZE_KEYWORDS,
  DEFAULT_FONT_SIZE,
  LINE_HEIGHT_KEYWORD,
  DEFAULT_LINE_HEIGHT,
  FONT_FAMILY_GENERIC_KEYWORDS,
  DEFAULT_FONT_FAMILY,
  FLEX_SINGLE_VALUE_KEYWORDS,
  DEFAULT_FLEX_GROW,
  DEFAULT_FLEX_SHRINK,
  FLEX_BASIS_KEYWORDS,
  DEFAULT_FLEX_BASIS,
  OVERFLOW_KEYWORDS,
  DEFAULT_OVERFLOW,
} from './data-types-consts';
import {
  unorderedListPredicate,
  functionPredicate,
  hexColorPredicate,
  dimensionPredicate,
  curlyBracesPredicate,
  createDataType,
} from './data-types-utils';
import {
  stateMachineDataTypeMatch,
  bgPositionStateMachine,
} from './data-types-state-machines';

export const ALWAYS_DATA_TYPE: DataType = {
  dataType: DataTypeType.Unknown,
  predicate: () => true,
  defaultValue: DEFAULT_DIMENSION,
};

// <universal>
// syntax: inherit | initial | unset
export const universalDataType = createDataType(
  DataTypeType.Universal,
  [ unorderedListPredicate(UNIVERSAL_KEYWORDS) ],
  DEFAULT_UNIVERSAL,
);

// <number>
export const numberPredicate = dimensionPredicate();

// <length>
export const lengthDataType = createDataType(
  DataTypeType.Length,
  [
    dimensionPredicate({ units: LENGTH_UNITS_MAP }),
    functionPredicate(CALC_FUNCTION),
  ],
  DEFAULT_DIMENSION,
);

// <percentage>
export const percentagePredicate = dimensionPredicate({ units: PERCENTAGE_UNIT });

// <length-percentage>
export const lengthPercentageDataType = createDataType(
  DataTypeType.LengthPercentage,
  [
    dimensionPredicate({ units: LENGTH_PERCENTAGE_UNITS }),
    functionPredicate(CALC_FUNCTION),
  ],
  DEFAULT_DIMENSION,
);

// <angle>
export const anglePredicate = dimensionPredicate({ units: ANGLE_UNITS });

// <width>
export const widthDataType = createDataType(
  DataTypeType.Width,
  [
    lengthPercentageDataType.predicate,
    unorderedListPredicate(AUTO_KEYWORD),
  ],
  DEFAULT_DIMENSION,
);

// <line-style>
// syntax: none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset
export const lineStyleDataType = createDataType(
  DataTypeType.LineStyle,
  [ unorderedListPredicate(LINE_STYLE_KEYWORDS) ],
  DEFAULT_LINE_STYLE,
);

// <'outline-style'>
// syntax: auto | <'border-style'>
export const outlineStyleDataType = createDataType(
  DataTypeType.OutlineStyle,
  [
    unorderedListPredicate(AUTO_KEYWORD),
    lineStyleDataType.predicate,
  ],
  DEFAULT_LINE_STYLE,
);

// <line-width>
// syntax: <length> | thin | medium | thick
export const lineWidthDataType = createDataType(
  DataTypeType.LineWidth,
  [
    lengthDataType.predicate,
    unorderedListPredicate(LINE_WIDTH_KEYWORDS),
  ],
  DEFAULT_LINE_WIDTH,
);

// <color>
// syntax: <rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>
export const colorDataType = createDataType(
  DataTypeType.Color,
  [
    functionPredicate(COLOR_SPACE_FUNCTIONS),
    hexColorPredicate(),
    unorderedListPredicate(COLOR_KEYWORDS),
  ],
  DEFAULT_COLOR,
);

export const backgroundColorDataType: DataType = {
  ...colorDataType,
  defaultValue: DEFAULT_BACKGROUND_COLOR,
};

// <'outline-color'>
// syntax: <color> | invert
export const outlineColorDataType = createDataType(
  DataTypeType.OutlineColor,
  [
    colorDataType.predicate,
    unorderedListPredicate(OUTLINE_COLOR_INVERT_KEYWORD),
  ],
  DEFAULT_COLOR,
);

// <gradient>
// syntax: <linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()> | <conic-gradient()>
export const gradientDataType = createDataType(
  DataTypeType.Gradient,
  [ functionPredicate(GRADIENT_FUNCTIONS) ],
  DEFAULT_UNIVERSAL,
);

// <image>
// syntax: <url> | <image()> | <image-set()> | <element()> | <paint()> | <cross-fade()> | <gradient>
export const imageDataType = createDataType(
  DataTypeType.Image,
  [
    functionPredicate(IMAGE_FUNCTIONS),
    gradientDataType.predicate,
  ],
  DEFAULT_UNIVERSAL,
);

// <bg-image>
// syntax: none | <image>
export const bgImageDataType = createDataType(
  DataTypeType.BgImage,
  [
    unorderedListPredicate(BG_IMAGE_NONE_KEYWORD),
    imageDataType.predicate,
  ],
  DEFAULT_BG_IMAGE,
);

// <bg-position>
/*
syntax: [
  [ left | center | right | top | bottom | <length-percentage> ] |
  [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] |
  [ center | [ left | right ] <length-percentage>? ]
    && [ center | [ top | bottom] <length-percentage>? ]
]
*/
export const bgPositionDataType = createDataType(
  DataTypeType.BgPosition,
  [
    (ast, index, items) => {
      if (ast.type !== 'text' || index === undefined || !items) {
        return false;
      }

      return stateMachineDataTypeMatch(
        items,
        index,
        bgPositionStateMachine(lengthPercentageDataType.predicate),
      );
    },
  ],
  DEFAULT_BG_POSITION,
);

// <bg-size>
// syntax: [ <length-percentage> | auto ]{1,2} | cover | contain
export const bgSizeDataType = createDataType(
  DataTypeType.BgSize,
  [
    curlyBracesPredicate([
      lengthPercentageDataType.predicate,
      unorderedListPredicate(AUTO_KEYWORD),
    ], 1, 2),
    unorderedListPredicate(BG_SIZE_KEYWORDS),
  ],
  DEFAULT_BG_SIZE,
  {
    dataType: DataTypeType.BgPosition,
    prefixChar: '/',
  },
);

// <repeat-style>
// syntax: repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}
export const repeatStyleDataType = createDataType(
  DataTypeType.RepeatStyle,
  [
    unorderedListPredicate(REPEAT_STYLE_SINGLE_KEYWORDS),
    curlyBracesPredicate([
      unorderedListPredicate(REPEAT_STYLE_MULTIPLE_KEYWORDS)
    ], 1, 2),
  ],
  DEFAULT_REPEAT_STYLE,
);

// <attachment>
// syntax: scroll | fixed | local
export const attachmentDataType = createDataType(
  DataTypeType.Attachment,
  [ unorderedListPredicate(ATTACHMENT_KEYWORDS) ],
  DEFAULT_ATTACHMENT,
);

// <box>
// syntax: border-box | padding-box | content-box
export const boxDataType = createDataType(
  DataTypeType.Box,
  [ unorderedListPredicate(BOX_KEYWORDS) ],
  DEFAULT_UNIVERSAL,
);

export const backgroundOriginDataType: DataType = {
  ...boxDataType,
  defaultValue: DEFAULT_BACKGROUND_ORIGIN,
};

export const backgroundClipDataType: DataType = {
  ...boxDataType,
  defaultValue: DEFAULT_BACKGROUND_CLIP,
};

// <font>
// syntax: caption | icon | menu | message-box | small-caption | status-bar
export const fontDataType = createDataType(
  DataTypeType.Font,
  [ unorderedListPredicate(FONT_SINGLE_VALUE_KEYWORDS) ],
  DEFAULT_UNIVERSAL,
);

// <font-style>
// syntax: normal | italic | oblique <angle>?
export const fontStyleDataType = createDataType(
  DataTypeType.FontStyle,
  [
    unorderedListPredicate(FONT_STYLE_KEYWORDS),
    (ast, index, items) => {
      if (index === undefined || !items) {
        return false;
      }

      const obliquePredicate = unorderedListPredicate(FONT_STYLE_OBLIQUE_KEYWORD);

      let matchAmount = 0;
      if (obliquePredicate(ast)) {
        matchAmount++;
        const next = items[index + 1];
        if (next && anglePredicate(next.value)) {
          matchAmount++;
        }
      }

      return matchAmount;
    },
  ],
  DEFAULT_FONT_STYLE,
);

// <font-variant>
// syntax: normal | small-caps
export const fontVariantDataType = createDataType(
  DataTypeType.FontVariant,
  [ unorderedListPredicate(FONT_VARIANT_KEYWORDS) ],
  DEFAULT_FONT_VARIANT,
);

// <font-weight>
// syntax: <font-weight-absolute> | <font-weight-relative> | [1,1000]
export const fontWeightDataType = createDataType(
  DataTypeType.FontWeight,
  [
    unorderedListPredicate(FONT_WEIGHT_KEYWORDS),
    dimensionPredicate({
      min: FONT_WEIGHT_NUMBER_RANGE_MIN,
      max: FONT_WEIGHT_NUMBER_RANGE_MAX,
    }),
  ],
  DEFAULT_FONT_WEIGHT,
);

// <font-stretch>
// syntax: normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded
export const fontStretchDataType = createDataType(
  DataTypeType.FontStretch,
  [ unorderedListPredicate(FONT_STRETCH_KEYWORDS) ],
  DEFAULT_FONT_STRETCH,
);

// <font-size>
// syntax: <length-percentage> | <absolute-size> | <relative-size>
export const fontSizeDataType = createDataType(
  DataTypeType.FontSize,
  [
    lengthPercentageDataType.predicate,
    unorderedListPredicate(FONT_SIZE_KEYWORDS),
  ],
  DEFAULT_FONT_SIZE,
);

// <line-height>
// syntax: <number> | <length-percentage> | normal
export const lineHeightDataType = createDataType(
  DataTypeType.LineHeight,
  [
    numberPredicate,
    lengthPercentageDataType.predicate,
    unorderedListPredicate(LINE_HEIGHT_KEYWORD),
  ],
  DEFAULT_LINE_HEIGHT,
  {
    dataType: DataTypeType.FontSize,
    prefixChar: '/',
  },
);

// <font-family>
// syntax: <generic-family> | <string>
export const fontFamilyDataType = createDataType(
  DataTypeType.FontFamily,
  [
    unorderedListPredicate(FONT_FAMILY_GENERIC_KEYWORDS),
    (_ast, index, items) => {
      if (index === undefined || !items) {
        return false;
      }
      
      let item: AstItem | undefined;
      let i = index;
      let matchAmount = 0;
      while (item = items[i++]) {
        const itemType = item.value.type;
        if (itemType !== 'text' && itemType !== 'string' && itemType !== ',') {
          break;
        }
        matchAmount++;
      }

      return matchAmount;
    },
  ],
  DEFAULT_FONT_FAMILY,
);

// <flex>
// syntax: initial | auto | none
export const flexDataType = createDataType(
  DataTypeType.Flex,
  [ unorderedListPredicate(FLEX_SINGLE_VALUE_KEYWORDS) ],
  DEFAULT_UNIVERSAL,
);

// <flex-grow>
// syntax: <number>
export const flexGrowDataType = createDataType(
  DataTypeType.FlexGrow,
  [ numberPredicate ],
  DEFAULT_FLEX_GROW,
);

// <flex-shrink>
// syntax: <number>
export const flexShrinkDataType = createDataType(
  DataTypeType.FlexShrink,
  [ numberPredicate ],
  DEFAULT_FLEX_SHRINK,
);

// <flex-basis>
// syntax: <width> | content | fill | max-content | min-content | fit-content
export const flexBasisDataType = createDataType(
  DataTypeType.FlexBasis,
  [
    widthDataType.predicate,
    unorderedListPredicate(FLEX_BASIS_KEYWORDS),
  ],
  DEFAULT_FLEX_BASIS,
);

// <overflow>
// syntax: visible | hidden | clip | scroll | auto
export const overflowDataType = createDataType(
  DataTypeType.Overflow,
  [ unorderedListPredicate(OVERFLOW_KEYWORDS) ],
  DEFAULT_OVERFLOW,
);
