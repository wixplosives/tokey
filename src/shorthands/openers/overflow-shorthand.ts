import type { Overflows } from '../shorthand-css-data';

import { overflowDataType } from '../../css-data-types';
import {
  splitShorthandOpener,
  unorderedListShorthandOpener,
  createShorthandOpener,
} from '../shorthand-parser-utils';

// overflow
export const openOverflowShorthand = createShorthandOpener<Overflows>({
  prop: 'overflow',
  parts: [
    {
      prop: 'overflow-x',
      dataType: overflowDataType,
      opener: splitShorthandOpener(['overflow-x', 'overflow-y']),
    },
    {
      prop: 'overflow-y',
      dataType: overflowDataType,
    },
  ],
  openShorthand: (astNodes, api, parts) => unorderedListShorthandOpener(parts)(astNodes, api),
});
