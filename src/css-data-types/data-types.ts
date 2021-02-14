import type { DataType } from './data-types-types';

import {
  DataTypeType,
  UNIVERSAL_KEYWORDS,
  AUTO_KEYWORD,
  LENGTH_UNITS_MAP,
  CALC_FUNCTION,
  PERCENTAGE_UNIT,
  LENGTH_PERCENTAGE_UNITS,
  ANGLE_UNITS,
  LINE_STYLE_KEYWORDS,
  LINE_WIDTH_KEYWORDS,
  COLOR_SPACE_FUNCTIONS,
  COLOR_KEYWORDS,
  OUTLINE_COLOR_INVERT_KEYWORD,
  GRADIENT_FUNCTIONS,
  IMAGE_FUNCTIONS,
  BG_IMAGE_NONE_KEYWORD,
  BG_SIZE_KEYWORDS,
  REPEAT_STYLE_SINGLE_KEYWORDS,
  ATTACHMENT_KEYWORDS,
  BOX_KEYWORDS,
  FONT_SINGLE_VALUE_KEYWORDS,
  FONT_STYLE_KEYWORDS,
  FONT_VARIANT_KEYWORDS,
  FONT_WEIGHT_KEYWORDS,
  FONT_WEIGHT_NUMBER_RANGE_MIN,
  FONT_WEIGHT_NUMBER_RANGE_MAX,
  FONT_STRETCH_KEYWORDS,
  FONT_SIZE_KEYWORDS,
  LINE_HEIGHT_KEYWORD,
  FONT_FAMILY_GENERIC_KEYWORDS,
  FLEX_SINGLE_VALUE_KEYWORDS,
  FLEX_BASIS_CONTENT_KEYWORD,
  FLEX_BASIS_INTRINSIC_SIZING_KEYWORDS,
  OVERFLOW_KEYWORDS,
} from './data-types-consts';
import {
  unorderedListPredicate,
  functionPredicate,
  hexColorPredicate,
  dimensionPredicate,
  createDataType,
} from './data-types-utils';
import {
  stateMachineDataTypeMatch,
  bgPositionStateMachine,
  bgSizeStateMachine,
  repeatStyleStateMachine,
  fontStyleStateMachine,
} from './data-types-state-machines';

export const ALWAYS_DATA_TYPE: DataType = {
  dataType: DataTypeType.Unknown,
  predicate: () => true,
};

// <universal>
// syntax: inherit | initial | unset
export const universalDataType = createDataType(
  DataTypeType.Universal,
  [ unorderedListPredicate(UNIVERSAL_KEYWORDS) ],
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
);

// <line-style>
// syntax: none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset
export const lineStyleDataType = createDataType(
  DataTypeType.LineStyle,
  [ unorderedListPredicate(LINE_STYLE_KEYWORDS) ],
);

// <'outline-style'>
// syntax: auto | <'border-style'>
export const outlineStyleDataType = createDataType(
  DataTypeType.OutlineStyle,
  [
    unorderedListPredicate(AUTO_KEYWORD),
    lineStyleDataType.predicate,
  ],
);

// <line-width>
// syntax: <length> | thin | medium | thick
export const lineWidthDataType = createDataType(
  DataTypeType.LineWidth,
  [
    lengthDataType.predicate,
    unorderedListPredicate(LINE_WIDTH_KEYWORDS),
  ],
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
);

// <'outline-color'>
// syntax: <color> | invert
export const outlineColorDataType = createDataType(
  DataTypeType.OutlineColor,
  [
    colorDataType.predicate,
    unorderedListPredicate(OUTLINE_COLOR_INVERT_KEYWORD),
  ],
);

// <gradient>
// syntax: <linear-gradient()> | <repeating-linear-gradient()> | <radial-gradient()> | <repeating-radial-gradient()> | <conic-gradient()>
export const gradientDataType = createDataType(
  DataTypeType.Gradient,
  [ functionPredicate(GRADIENT_FUNCTIONS) ],
);

// <image>
// syntax: <url> | <image()> | <image-set()> | <element()> | <paint()> | <cross-fade()> | <gradient>
export const imageDataType = createDataType(
  DataTypeType.Image,
  [
    functionPredicate(IMAGE_FUNCTIONS),
    gradientDataType.predicate,
  ],
);

// <bg-image>
// syntax: none | <image>
export const bgImageDataType = createDataType(
  DataTypeType.BgImage,
  [
    unorderedListPredicate(BG_IMAGE_NONE_KEYWORD),
    imageDataType.predicate,
  ],
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
);

// <bg-size>
// syntax: [ <length-percentage> | auto ]{1,2} | cover | contain
export const bgSizeDataType = createDataType(
  DataTypeType.BgSize,
  [
    (_ast, index, items) => {
      if (index === undefined || !items) {
        return false;
      }

      return stateMachineDataTypeMatch(
        items,
        index,
        bgSizeStateMachine(lengthPercentageDataType.predicate),
      );
    },
    unorderedListPredicate(BG_SIZE_KEYWORDS),
  ],
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
    (ast, index, items) => {
      if (ast.type !== 'text' || index === undefined || !items) {
        return false;
      }

      return stateMachineDataTypeMatch(
        items,
        index,
        repeatStyleStateMachine(),
      );
    },
  ],
);

// <attachment>
// syntax: scroll | fixed | local
export const attachmentDataType = createDataType(
  DataTypeType.Attachment,
  [ unorderedListPredicate(ATTACHMENT_KEYWORDS) ],
);

// <box>
// syntax: border-box | padding-box | content-box
export const boxDataType = createDataType(
  DataTypeType.Box,
  [ unorderedListPredicate(BOX_KEYWORDS) ],
);

// <font>
// syntax: caption | icon | menu | message-box | small-caption | status-bar
export const fontDataType = createDataType(
  DataTypeType.Font,
  [ unorderedListPredicate(FONT_SINGLE_VALUE_KEYWORDS) ],
);

// <font-style>
// syntax: normal | italic | oblique <angle>?
export const fontStyleDataType = createDataType(
  DataTypeType.FontStyle,
  [
    unorderedListPredicate(FONT_STYLE_KEYWORDS),
    (ast, index, items) => {
      if (ast.type !== 'text' || index === undefined || !items) {
        return false;
      }

      return stateMachineDataTypeMatch(
        items,
        index,
        fontStyleStateMachine(anglePredicate),
      );
    },
  ],
);

// <font-variant>
// syntax: normal | small-caps
export const fontVariantDataType = createDataType(
  DataTypeType.FontVariant,
  [ unorderedListPredicate(FONT_VARIANT_KEYWORDS) ],
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
);

// <font-stretch>
// syntax: normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded
export const fontStretchDataType = createDataType(
  DataTypeType.FontStretch,
  [ unorderedListPredicate(FONT_STRETCH_KEYWORDS) ],
);

// <font-size>
// syntax: <length-percentage> | <absolute-size> | <relative-size>
export const fontSizeDataType = createDataType(
  DataTypeType.FontSize,
  [
    lengthPercentageDataType.predicate,
    unorderedListPredicate(FONT_SIZE_KEYWORDS),
  ],
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
      
      let returnItemsAmount = 0;
      for (let i = index; i < items.length; i++) {
        const node = items[i].value;
        if (node.type !== 'text' && node.type !== 'string' && node.type !== ',') {
          break;
        }
        returnItemsAmount++;
      }

      return returnItemsAmount;
    },
  ],
);

// <flex>
// syntax: initial | auto | none
export const flexDataType = createDataType(
  DataTypeType.Flex,
  [ unorderedListPredicate(FLEX_SINGLE_VALUE_KEYWORDS) ],
);

// <flex-grow>
// syntax: <number>
export const flexGrowDataType = createDataType(
  DataTypeType.FlexGrow,
  [ numberPredicate ],
);

// <flex-shrink>
// syntax: <number>
export const flexShrinkDataType = createDataType(
  DataTypeType.FlexShrink,
  [ numberPredicate ],
);

// <flex-basis>
// syntax: <width> | content | fill | max-content | min-content | fit-content
export const flexBasisDataType = createDataType(
  DataTypeType.FlexBasis,
  [
    widthDataType.predicate,
    unorderedListPredicate(FLEX_BASIS_CONTENT_KEYWORD),
    unorderedListPredicate(FLEX_BASIS_INTRINSIC_SIZING_KEYWORDS),
  ],
);

// <overflow>
// syntax: visible | hidden | clip | scroll | auto
export const overflowDataType = createDataType(
  DataTypeType.Overflow,
  [ unorderedListPredicate(OVERFLOW_KEYWORDS) ],
);
