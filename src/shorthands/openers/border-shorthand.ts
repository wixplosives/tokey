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
import type { ShorthandPart } from '../shorthand-types';

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

const borderStyleShorthand = borderShorthandPart<BorderStyles>(
  'border-style',
  lineStyleDataType,
  [
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
  ],
);
const borderWidthShorthand = borderShorthandPart<BorderWidths>(
  'border-width',
  lineWidthDataType,
  [
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
  ],
);

const borderColorShorthand = borderShorthandPart<BorderColors>(
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
  borderStyleShorthand,
  borderWidthShorthand,
  borderColorShorthand,
];

// border
export const openBorderShorthandShallow = createShorthandOpener<BordersShallow>({
  prop: 'border',
  parts: borderShorthandParts as ShorthandPart<BordersShallow>[],
  openShorthand: (astNodes, api, parts) => unorderedListShorthandOpener(parts, { shallowOpen: true })(astNodes, api),
  shallow: true,
});
export const openBorderShorthand = createShorthandOpener<Borders>({
  prop: 'border',
  parts: borderShorthandParts as ShorthandPart<Borders>[],
  openShorthand: (astNodes, api, parts) => unorderedListShorthandOpener(parts)(astNodes, api),
});

const borderEdgeProp = (edge: CssEdge, item: string) => `border-${edge}-${item}`;
const borderEdgeShorthandParts = <T extends string>(
  edge: CssEdge,
) => createShorthandOpener<T>({
  prop: `border-${edge}`,
  parts: [
    borderShorthandPart<BorderStyles>(borderEdgeProp(edge, 'style'), lineStyleDataType),
    borderShorthandPart<BorderWidths>(borderEdgeProp(edge, 'width'), lineWidthDataType),
    borderShorthandPart<BorderColors>(borderEdgeProp(edge, 'color'), colorDataType),
  ] as ShorthandPart<T>[],
  openShorthand: (astNodes, api, parts) => unorderedListShorthandOpener(parts, { shallowOpen: true })(astNodes, api),
  shallow: true,
});

// border-top
export const openBorderTopShorthand = borderEdgeShorthandParts<BordersTop>('top');

// border-right
export const openBorderRightShorthand = borderEdgeShorthandParts<BordersRight>('right');

// border-bottom
export const openBorderBottomShorthand = borderEdgeShorthandParts<BordersBottom>('bottom');

// border-left
export const openBorderLeftShorthand = borderEdgeShorthandParts<BordersLeft>('left');

// border-style
export const openBorderStyleShorthand = createShorthandOpenerFromPart(borderStyleShorthand);

// border-width
export const openBorderWidthShorthand = createShorthandOpenerFromPart(borderWidthShorthand);

// border-color
export const openBorderColorShorthand = createShorthandOpenerFromPart(borderColorShorthand);
