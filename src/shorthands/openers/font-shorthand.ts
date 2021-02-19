import type { FontPrefixes, FontSuffixes, Fonts } from '../shorthand-css-data';
import type { EvaluatedAst, OpenedShorthand, ShorthandPart } from '../shorthand-types';

import {
  fontDataType,
  fontStyleDataType,
  fontVariantDataType,
  fontWeightDataType,
  fontStretchDataType,
  fontSizeDataType,
  lineHeightDataType,
  fontFamilyDataType,
  COMMON_FONT_PREFIX_NORMAL,
} from '../../css-data-types';
import { unorderedListShorthandOpener, createShorthandOpener } from '../shorthand-parser-utils';

const fontPrefixShorthandParts: ShorthandPart<string>[] = [
  { prop: 'font-style',   dataType: fontStyleDataType, multipleItems: true },
  { prop: 'font-variant', dataType: fontVariantDataType },
  { prop: 'font-weight',  dataType: fontWeightDataType  },
  { prop: 'font-stretch', dataType: fontStretchDataType },
];
const fontSizeShorthandPart: ShorthandPart<string> = {
  prop: 'font-size',
  dataType: fontSizeDataType,
  mandatory: true,
};
const fontSuffixShorthandParts: ShorthandPart<string>[] = [
  fontSizeShorthandPart,
  { prop: 'line-height', dataType: lineHeightDataType },
  {
    prop: 'font-family',
    dataType: fontFamilyDataType,
    multipleItems: true,
    mandatory: true,
  },
];

const openFontShorthandPrefixInner = unorderedListShorthandOpener<FontPrefixes>(fontPrefixShorthandParts, { commonValue: COMMON_FONT_PREFIX_NORMAL });
const openFontShorthandSuffixInner = unorderedListShorthandOpener<FontSuffixes>(fontSuffixShorthandParts);

// TODO: Though not directly settable by font, the longhands font-size-adjust and font-kerning are also reset to their initial values.
// font
export const openFontShorthand = createShorthandOpener<Fonts>({
  prop: 'font',
  singleKeywordPart: { prop: 'font', dataType: fontDataType },
  parts: fontPrefixShorthandParts.concat(fontSuffixShorthandParts) as ShorthandPart<Fonts>[],
  openShorthand: (astNodes, api) => {
    let opened: OpenedShorthand<string> = {};

    const prefixEndPart = fontSizeShorthandPart;
    let prefixEndIndex = -1;
    for (let i = 0; i < astNodes.length; i++) {
      if (prefixEndPart.dataType.predicate(astNodes[i].value)) {
        prefixEndIndex = i;
        break;
      }
    }
    if (prefixEndIndex !== -1) {
      opened = {
        ...openFontShorthandPrefixInner(
          astNodes.slice(0, prefixEndIndex),
          api,
        ) as Record<FontPrefixes, EvaluatedAst>,
        ...openFontShorthandSuffixInner(
          astNodes.slice(prefixEndIndex),
          api,
        ) as Record<FontSuffixes, EvaluatedAst>,
      };
    } else {
      // TODO: Better error + Test error
      throw new Error('Invalid input! No mandatory item match');
    }

    return opened;
  },
});
