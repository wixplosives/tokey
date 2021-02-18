import type { ShorthandOpener } from './shorthand-types';
import type { ShorthandsTypeMap } from './shorthand-css-data';

import {
  openBackgroundShorthand,
  openBorderRadiusShorthand,
  openBorderShorthand,
  openBorderTopShorthand,
  openBorderRightShorthand,
  openBorderBottomShorthand,
  openBorderLeftShorthand,
  openBorderStyleShorthand,
  openBorderWidthShorthand,
  openBorderColorShorthand,
  openOutlineShorthand,
  openFlexShorthand,
  openFontShorthand,
  openMarginShorthand,
  openPaddingShorthand,
  openOverflowShorthand,
} from './openers';

type ShorthandMap = { [ K in keyof ShorthandsTypeMap ]: ShorthandOpener<ShorthandsTypeMap[K]> };

const shorthandMap: ShorthandMap = {
  'background':    openBackgroundShorthand,
  'border-radius': openBorderRadiusShorthand,
  'border':        openBorderShorthand,
  'border-top':    openBorderTopShorthand,
  'border-right':  openBorderRightShorthand,
  'border-bottom': openBorderBottomShorthand,
  'border-left':   openBorderLeftShorthand,
  'border-style':  openBorderStyleShorthand,
  'border-width':  openBorderWidthShorthand,
  'border-color':  openBorderColorShorthand,
  'outline':       openOutlineShorthand,
  'flex':          openFlexShorthand,
  'font':          openFontShorthand,
  'margin':        openMarginShorthand,
  'padding':       openPaddingShorthand,
  'overflow':      openOverflowShorthand,
};

export const getShorthandOpener = <T extends keyof ShorthandsTypeMap>(
  prop: T,
) => shorthandMap[prop] as ShorthandOpener<ShorthandsTypeMap[T]>;
