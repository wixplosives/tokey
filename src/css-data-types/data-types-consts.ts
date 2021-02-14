export enum DataTypeType {
  Unknown          = 'UNKNOWN',
  Common           = 'COMMON',
  Universal        = '<universal>',
  Number           = '<number>',
  Length           = '<length>',
  Percentage       = '<percentage>',
  LengthPercentage = '<length-percentage>',
  Angle            = '<angle>',
  Width            = '<width>',
  LineStyle        = '<line-style>',
  OutlineStyle     = '<\'outline-style\'>',
  LineWidth        = '<line-width>',
  Color            = '<color>',
  OutlineColor     = '<\'outline-color\'>',
  Gradient         = '<gradient>',
  Image            = '<image>',
  BgImage          = '<bg-image>',
  BgPosition       = '<bg-position>',
  BgSize           = '<bg-size>',
  RepeatStyle      = '<repeat-style>',
  Attachment       = '<attachment>',
  Box              = '<box>',
  FontStyle        = '<font-style>',
  FontVariant      = '<font-variant>',
  FontWeight       = '<font-weight>',
  FontStretch      = '<font-stretch>',
  FontSize         = '<font-size>',
  LineHeight       = '<line-height>',
  FontFamily       = '<font-family>',
  Font             = '<font>',
  FlexGrow         = '<flex-grow>',
  FlexShrink       = '<flex-shrink>',
  FlexBasis        = '<flex-basis>',
  Flex             = '<flex>',
  Overflow         = '<overflow>',
}

export type KeywordsMap = Map<string, boolean>;
const keywordsMap = (keywords: string[]): KeywordsMap =>
  new Map(keywords.map(keyword => ([keyword, true])));

// export const DATA_TYPE_SYNTAX_SEPARATOR = ' | ';

// <universal>
export const UNIVERSAL_KEYWORDS = keywordsMap([
  'inherit',
  'initial',
  'unset',
]);
export const DEFAULT_UNIVERSAL = 'initial';
export const AUTO_KEYWORD = 'auto';

// <margin> / <padding> / <border-radius>
export const DEFAULT_EDGE = '0';

// <length>
const ABSOLUTE_LENGTH_UNITS = [
  'px',
  'cm',
  'mm',
  'Q',
  'in',
  'pc',
  'pt',
];
const RELATIVE_LENGTH_UNITS = [
  'em',
  'rem',
  'vw',
  'vh',
  'vi',
  'vb',
  'vmin',
  'vmax',
  'ex',
  'cap',
  'ch',
  'ic',
  'lh',
  'rlh',
];
export const LENGTH_UNITS = ABSOLUTE_LENGTH_UNITS.concat(RELATIVE_LENGTH_UNITS);
export const LENGTH_UNITS_MAP = keywordsMap(LENGTH_UNITS);
export const CALC_FUNCTION = 'calc';

// <percentage>
export const PERCENTAGE_UNIT = '%';
export const LENGTH_PERCENTAGE_UNITS = keywordsMap(LENGTH_UNITS.concat(PERCENTAGE_UNIT));

// <angle>
export const ANGLE_UNITS = keywordsMap([
  'deg',
  'grad',
  'rad',
  'turn',
]);

// <line-style>
export const LINE_STYLE_KEYWORDS = keywordsMap([
  'none',
  'hidden',
  'dotted',
  'dashed',
  'solid',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
]);
export const DEFAULT_LINE_STYLE = 'none';

// <line-width>
export const LINE_WIDTH_KEYWORDS = keywordsMap([
  'thin',
  'medium',
  'thick',
]);
export const DEFAULT_LINE_WIDTH = 'medium';

// <color>
export const COLOR_SPACE_FUNCTIONS = keywordsMap([
  'rgb',
  'rgba',
  'hsl',
  'hsla',
]);
// <named-color>
const NAMED_COLOR_KEYWORDS = [
  'transparent',
  'aliceblue',
  'antiquewhite',
  'aqua',
  'aquamarine',
  'azure',
  'beige',
  'bisque',
  'black',
  'blanchedalmond',
  'blue',
  'blueviolet',
  'brown',
  'burlywood',
  'cadetblue',
  'chartreuse',
  'chocolate',
  'coral',
  'cornflowerblue',
  'cornsilk',
  'crimson',
  'cyan',
  'darkblue',
  'darkcyan',
  'darkgoldenrod',
  'darkgray',
  'darkgreen',
  'darkgrey',
  'darkkhaki',
  'darkmagenta',
  'darkolivegreen',
  'darkorange',
  'darkorchid',
  'darkred',
  'darksalmon',
  'darkseagreen',
  'darkslateblue',
  'darkslategray',
  'darkslategrey',
  'darkturquoise',
  'darkviolet',
  'deeppink',
  'deepskyblue',
  'dimgray',
  'dimgrey',
  'dodgerblue',
  'firebrick',
  'floralwhite',
  'forestgreen',
  'fuchsia',
  'gainsboro',
  'ghostwhite',
  'gold',
  'goldenrod',
  'gray',
  'green',
  'greenyellow',
  'grey',
  'honeydew',
  'hotpink',
  'indianred',
  'indigo',
  'ivory',
  'khaki',
  'lavender',
  'lavenderblush',
  'lawngreen',
  'lemonchiffon',
  'lightblue',
  'lightcoral',
  'lightcyan',
  'lightgoldenrodyellow',
  'lightgray',
  'lightgreen',
  'lightgrey',
  'lightpink',
  'lightsalmon',
  'lightseagreen',
  'lightskyblue',
  'lightslategray',
  'lightslategrey',
  'lightsteelblue',
  'lightyellow',
  'lime',
  'limegreen',
  'linen',
  'magenta',
  'maroon',
  'mediumaquamarine',
  'mediumblue',
  'mediumorchid',
  'mediumpurple',
  'mediumseagreen',
  'mediumslateblue',
  'mediumspringgreen',
  'mediumturquoise',
  'mediumvioletred',
  'midnightblue',
  'mintcream',
  'mistyrose',
  'moccasin',
  'navajowhite',
  'navy',
  'oldlace',
  'olive',
  'olivedrab',
  'orange',
  'orangered',
  'orchid',
  'palegoldenrod',
  'palegreen',
  'paleturquoise',
  'palevioletred',
  'papayawhip',
  'peachpuff',
  'peru',
  'pink',
  'plum',
  'powderblue',
  'purple',
  'rebeccapurple',
  'red',
  'rosybrown',
  'royalblue',
  'saddlebrown',
  'salmon',
  'sandybrown',
  'seagreen',
  'seashell',
  'sienna',
  'silver',
  'skyblue',
  'slateblue',
  'slategray',
  'slategrey',
  'snow',
  'springgreen',
  'steelblue',
  'tan',
  'teal',
  'thistle',
  'tomato',
  'turquoise',
  'violet',
  'wheat',
  'white',
  'whitesmoke',
  'yellow',
  'yellowgreen',
];
const CURRENT_COLOR_KEYWORD = 'currentcolor';
// <deprecated-system-color>
const DEPRECATED_SYSTEM_COLOR_KEYWORD = [
  'ActiveBorder',
  'ActiveCaption',
  'AppWorkspace',
  'Background',
  'ButtonFace',
  'ButtonHighlight',
  'ButtonShadow',
  'ButtonText',
  'CaptionText',
  'GrayText',
  'Highlight',
  'HighlightText',
  'InactiveBorder',
  'InactiveCaption',
  'InactiveCaptionText',
  'InfoBackground',
  'InfoText',
  'Menu',
  'MenuText',
  'Scrollbar',
  'ThreeDDarkShadow',
  'ThreeDFace',
  'ThreeDHighlight',
  'ThreeDLightShadow',
  'ThreeDShadow',
  'Window',
  'WindowFrame',
  'WindowText',
];
export const COLOR_KEYWORDS = keywordsMap(NAMED_COLOR_KEYWORDS.concat(CURRENT_COLOR_KEYWORD).concat(DEPRECATED_SYSTEM_COLOR_KEYWORD));
export const DEFAULT_COLOR = 'currentcolor';

// <'outline-color'>
export const OUTLINE_COLOR_INVERT_KEYWORD = 'invert';

// <background-color>
export const DEFAULT_BACKGROUND_COLOR = 'transparent';

// <gradient>
export const GRADIENT_FUNCTIONS = keywordsMap([
  'linear-gradient',
  'repeating-linear-gradient',
  'radial-gradient',
  'repeating-radial-gradient',
  'conic-gradient',
]);

// <image>
export const IMAGE_FUNCTIONS = keywordsMap([
  'url',
  'image',
  'image-set',
  'element',
  'paint',
  'cross-fade',
]);

// <bg-image>
export const BG_IMAGE_NONE_KEYWORD = 'none';
export const DEFAULT_BG_IMAGE = 'none';

// <bg-position>
export const BG_POSITION_CENTER_KEYWORD = 'center';
export const BG_POSITION_VERTICAL_KEYWORDS = [
  'top',
  'bottom',
];
export const BG_POSITION_VERTICAL_KEYWORDS_MAP = keywordsMap(BG_POSITION_VERTICAL_KEYWORDS);
export const BG_POSITION_HORIZONTAL_KEYWORDS = [
  'left',
  'right',
];
export const BG_POSITION_HORIZONTAL_KEYWORDS_MAP = keywordsMap(BG_POSITION_HORIZONTAL_KEYWORDS);
export const BG_POSITION_ALL_EDGES_KEYWORDS = keywordsMap(BG_POSITION_HORIZONTAL_KEYWORDS.concat(BG_POSITION_VERTICAL_KEYWORDS));
export const DEFAULT_BG_POSITION = '0% 0%';

// <bg-size>
export const BG_SIZE_KEYWORDS = keywordsMap([
  'cover',
  'contain',
]);
export const DEFAULT_BG_SIZE = 'auto auto';

// <repeat-style>
export const REPEAT_STYLE_SINGLE_KEYWORDS = keywordsMap([
  'repeat-x',
  'repeat-y',
]);
export const REPEAT_STYLE_MULTIPLE_KEYWORDS = keywordsMap([
  'repeat',
  'space',
  'round',
  'no-repeat',
]);
export const DEFAULT_REPEAT_STYLE = 'repeat';

// <attachment>
export const ATTACHMENT_KEYWORDS = keywordsMap([
  'scroll',
  'fixed',
  'local',
]);
export const DEFAULT_ATTACHMENT = 'scroll';

// <box>
export const BOX_KEYWORDS = keywordsMap([
  'border-box',
  'padding-box',
  'content-box',
]);
export const DEFAULT_BACKGROUND_ORIGIN = 'padding-box';
export const DEFAULT_BACKGROUND_CLIP = 'border-box';

// <font>
export const FONT_SINGLE_VALUE_KEYWORDS = keywordsMap([
  'caption',
  'icon',
  'menu',
  'message-box',
  'small-caption',
  'status-bar',
]);

export const COMMON_FONT_PREFIX_NORMAL = 'normal';

// <font-style>
export const FONT_STYLE_KEYWORDS = keywordsMap([
  COMMON_FONT_PREFIX_NORMAL,
  'italic',
]);
export const FONT_STYLE_OBLIQUE_KEYWORD = 'oblique';
export const DEFAULT_FONT_STYLE = COMMON_FONT_PREFIX_NORMAL;

// <font-variant>
export const FONT_VARIANT_KEYWORDS = keywordsMap([
  COMMON_FONT_PREFIX_NORMAL,
  'small-caps',
]);
export const DEFAULT_FONT_VARIANT = COMMON_FONT_PREFIX_NORMAL;

// <font-weight>
const FONT_WEIGHT_ABSOLUTE_KEYWORDS = [
  COMMON_FONT_PREFIX_NORMAL,
  'bold',
];
const FONT_WEIGHT_RELATIVE_KEYWORDS = [
  'lighter',
  'bolder',
];
export const FONT_WEIGHT_KEYWORDS = keywordsMap(FONT_WEIGHT_ABSOLUTE_KEYWORDS.concat(FONT_WEIGHT_RELATIVE_KEYWORDS));
export const FONT_WEIGHT_NUMBER_RANGE_MIN = 1;
export const FONT_WEIGHT_NUMBER_RANGE_MAX = 1000;
export const DEFAULT_FONT_WEIGHT = COMMON_FONT_PREFIX_NORMAL;

// <font-stretch>
export const FONT_STRETCH_KEYWORDS = keywordsMap([
  COMMON_FONT_PREFIX_NORMAL,
  'ultra-condensed',
  'extra-condensed',
  'condensed',
  'semi-condensed',
  'semi-expanded',
  'expanded',
  'extra-expanded',
  'ultra-expanded',
]);
export const DEFAULT_FONT_STRETCH = COMMON_FONT_PREFIX_NORMAL;

// <font-size>
const FONT_SIZE_ABSOLUTE_KEYWORDS = [
  'xx-small',
  'x-small',
  'small',
  'medium',
  'large',
  'x-large',
  'xx-large',
  'xxx-large',
];
const FONT_SIZE_RELATIVE_KEYWORDS = [
  'larger',
  'smaller',
];
export const FONT_SIZE_KEYWORDS = keywordsMap(FONT_SIZE_ABSOLUTE_KEYWORDS.concat(FONT_SIZE_RELATIVE_KEYWORDS));
export const DEFAULT_FONT_SIZE = 'medium';

// <line-height>
export const LINE_HEIGHT_KEYWORD = 'normal';
export const DEFAULT_LINE_HEIGHT = 'normal';

// <font-family>
export const FONT_FAMILY_GENERIC_KEYWORDS = keywordsMap([
  'serif',
  'sans-serif',
  'cursive',
  'fantasy',
  'monospace',
  'system-ui',
  'ui-serif',
  'ui-sans-serif',
  'ui-monospace',
  'ui-rounded',
  'emoji',
  'math',
  'fangsong',
]);
export const DEFAULT_FONT_FAMILY = '';

// <flex>
export const FLEX_SINGLE_VALUE_KEYWORDS = keywordsMap([
  'initial',
  'auto',
  'none',
]);

// <flex-grow>
export const DEFAULT_FLEX_GROW = '0';
export const AUTO_FLEX_GROW = '1';

// <flex-shrink>
export const DEFAULT_FLEX_SHRINK = '1';
export const NONE_FLEX_SHRINK = '0';

// <flex-basis>
export const FLEX_BASIS_CONTENT_KEYWORD = 'content';
export const FLEX_BASIS_INTRINSIC_SIZING_KEYWORDS = keywordsMap([
  'fill',
  'max-content',
  'min-content',
  'fit-content',
]);
export const INITIAL_FLEX_BASIS = 'auto';
export const DEFAULT_FLEX_BASIS = '0';

// <overflow>
export const OVERFLOW_KEYWORDS = keywordsMap([
  'visible',
  'hidden',
  'clip',
  'scroll',
  'auto'
]);
export const DEFAULT_OVERFLOW = 'visible';
