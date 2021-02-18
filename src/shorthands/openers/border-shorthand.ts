import type {
  BorderStyles,
  BorderWidths,
  BorderColors,
  BordersShallow,
  Borders,
  BordersTop,
  BordersRight,
  BordersBottom,
  BordersLeft,
  CssEdge,
} from '../shorthand-css-data';
import type { OpenedShorthand, ShorthandOpener, ShorthandPart } from '../shorthand-types';

import {
  DataType,
  lineStyleDataType,
  lineWidthDataType,
  colorDataType,
} from '../../css-data-types';
import {
  edgesShorthandOpener,
  unorderedListShorthandOpener,
  createShorthandOpener,
  createShorthandOpenerFromPart,
} from '../shorthand-parser-utils';

const borderShorthandPart = <T extends string>(
  prop: string,
  dataType: DataType,
  openedProps?: T[],
): ShorthandPart<T> => ({
  prop,
  dataType,
  opener: openedProps ? edgesShorthandOpener(prop) : undefined,
  openedProps,
});

const borderStyleShorthandPart = borderShorthandPart<BorderStyles>(
  'border-style',
  lineStyleDataType,
  [
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
  ],
);
const borderWidthShorthandPart = borderShorthandPart<BorderWidths>(
  'border-width',
  lineWidthDataType,
  [
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
  ],
);

const borderColorShorthandPart = borderShorthandPart<BorderColors>(
  'border-color',
  colorDataType,
  [
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
  ],
);

const borderShorthandParts: ShorthandPart<string>[] = [
  borderStyleShorthandPart,
  borderWidthShorthandPart,
  borderColorShorthandPart,
];

// border
export const openBorderShorthand = createShorthandOpener<Borders>({
  prop: 'border',
  parts: borderShorthandParts as ShorthandPart<Borders>[],
  openShorthand: (astNodes, api, parts, shallow) => unorderedListShorthandOpener(parts, { shallow })(astNodes, api),
});
export const openBorderShorthandShallow: ShorthandOpener<BordersShallow> =
  (shortHand, api) => openBorderShorthand(shortHand, api, true) as unknown as OpenedShorthand<BordersShallow>;

const borderEdgeProp = (edge: CssEdge, item: string) => `border-${edge}-${item}`;
const borderEdgeShorthandOpener = <T extends string>(
  edge: CssEdge,
) => createShorthandOpener<T>({
  prop: `border-${edge}`,
  parts: [
    borderShorthandPart<BorderStyles>(borderEdgeProp(edge, 'style'), lineStyleDataType),
    borderShorthandPart<BorderWidths>(borderEdgeProp(edge, 'width'), lineWidthDataType),
    borderShorthandPart<BorderColors>(borderEdgeProp(edge, 'color'), colorDataType),
  ] as ShorthandPart<T>[],
  openShorthand: (astNodes, api, parts) => unorderedListShorthandOpener(parts, { shallow: true })(astNodes, api),
});

// border-top
export const openBorderTopShorthand = borderEdgeShorthandOpener<BordersTop>('top');

// border-right
export const openBorderRightShorthand = borderEdgeShorthandOpener<BordersRight>('right');

// border-bottom
export const openBorderBottomShorthand = borderEdgeShorthandOpener<BordersBottom>('bottom');

// border-left
export const openBorderLeftShorthand = borderEdgeShorthandOpener<BordersLeft>('left');

// border-style
export const openBorderStyleShorthand = createShorthandOpenerFromPart(borderStyleShorthandPart);

// border-width
export const openBorderWidthShorthand = createShorthandOpenerFromPart(borderWidthShorthandPart);

// border-color
export const openBorderColorShorthand = createShorthandOpenerFromPart(borderColorShorthandPart);
