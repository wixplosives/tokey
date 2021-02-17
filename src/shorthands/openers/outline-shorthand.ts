import type { Outlines } from '../shorthand-css-data';

import {
  outlineStyleDataType,
  lineWidthDataType,
  outlineColorDataType,
} from '../../css-data-types';
import { unorderedListShorthandOpener, createShorthandOpener } from '../shorthand-parser-utils';

// outline
export const openOutlineShorthand = createShorthandOpener<Outlines>({
  prop: 'outline',
  parts: [
    { prop: 'outline-style', dataType: outlineStyleDataType },
    { prop: 'outline-width', dataType: lineWidthDataType    },
    { prop: 'outline-color', dataType: outlineColorDataType },
  ],
  openShorthand: (astNodes, api, parts) => unorderedListShorthandOpener(parts)(astNodes, api),
});
