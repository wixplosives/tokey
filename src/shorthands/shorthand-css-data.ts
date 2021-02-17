import {
  DEFAULT_FLEX_GROW,
  AUTO_FLEX_GROW,
  DEFAULT_FLEX_SHRINK,
  NONE_FLEX_SHRINK,
  INITIAL_FLEX_BASIS,
} from '../css-data-types';

export type Margins =
  | 'margin-top'
  | 'margin-right'
  | 'margin-bottom'
  | 'margin-left'
;

export type Paddings =
  | 'padding-top'
  | 'padding-right'
  | 'padding-bottom'
  | 'padding-left'
;

export type BorderRadiuses =
  | 'border-top-left-radius'
  | 'border-top-right-radius'
  | 'border-bottom-right-radius'
  | 'border-bottom-left-radius'
;

export type BorderStyles =
  | 'border-top-style'
  | 'border-right-style'
  | 'border-bottom-style'
  | 'border-left-style'
;
export type BorderWidths =
  | 'border-top-width'
  | 'border-right-width'
  | 'border-bottom-width'
  | 'border-left-width'
;
export type BorderColors =
  | 'border-top-color'
  | 'border-right-color'
  | 'border-bottom-color'
  | 'border-left-color'
;
export type BordersShallow =
  | 'border-style'
  | 'border-width'
  | 'border-color'
;
export type Borders =
  | BorderStyles
  | BorderWidths
  | BorderColors
;
export type BordersTop =
  | 'border-top-style'
  | 'border-top-width'
  | 'border-top-color'
;
export type BordersRight =
  | 'border-right-style'
  | 'border-right-width'
  | 'border-right-color'
;
export type BordersBottom =
  | 'border-bottom-style'
  | 'border-bottom-width'
  | 'border-bottom-color'
;
export type BordersLeft =
  | 'border-left-style'
  | 'border-left-width'
  | 'border-left-color'
;

export type Outlines =
  | 'outline-style'
  | 'outline-width'
  | 'outline-color'
;

export type Backgrounds =
  | 'background-attachment'
  | 'background-clip'
  | 'background-color'
  | 'background-image'
  | 'background-origin'
  | 'background-position'
  | 'background-repeat'
  | 'background-size'
;

export type FontPrefixes =
  | 'font-style'
  | 'font-variant'
  | 'font-weight'
  | 'font-stretch'
;
export type FontSuffixes =
  | 'font-size'
  | 'line-height'
  | 'font-family'
;
export type Fonts =
  | FontPrefixes
  | FontSuffixes
  | 'font'
;

export type Flexes =
  | 'flex-grow'
  | 'flex-shrink'
  | 'flex-basis'
;

export type Overflows =
  | 'overflow-x'
  | 'overflow-y'
;

export type CssEdge = 'top' | 'right' | 'bottom' | 'left';
export type CssCorner = 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
export const CSS_PROPERTY_DELIMITER = '-';
export const EDGE_SHORTHAND_EDGES: CssEdge[] = ['top', 'right', 'bottom', 'left'];
export const CORNER_SHORTHAND_CORNERS: CssCorner[] = ['top-left', 'top-right', 'bottom-right', 'bottom-left'];
export const EDGE_SHORTHAND_INDICES_BY_LENGTH: number[][] = [
  [ 0, 0, 0, 0 ],
  [ 0, 1, 0, 1 ],
  [ 0, 1, 2, 1 ],
  [ 0, 1, 2, 3 ],
];

export type FlexKeyword = 'initial' | 'auto' | 'none';
export const FLEX_KEYWORD_VALUE_MAP: Record<FlexKeyword, Record<Flexes, string>> = {
  initial: {
    'flex-grow': DEFAULT_FLEX_GROW,
    'flex-shrink': DEFAULT_FLEX_SHRINK,
    'flex-basis': INITIAL_FLEX_BASIS,
  },
  auto: {
    'flex-grow': AUTO_FLEX_GROW,
    'flex-shrink': DEFAULT_FLEX_SHRINK,
    'flex-basis': INITIAL_FLEX_BASIS,
  },
  none: {
    'flex-grow': DEFAULT_FLEX_GROW,
    'flex-shrink': NONE_FLEX_SHRINK,
    'flex-basis': INITIAL_FLEX_BASIS,
  },
};
