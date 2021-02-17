import type { Margins } from '../shorthand-css-data';

import { createShorthandOpenerFromPart, edgesShorthandOpener } from '../shorthand-parser-utils';
import { ALWAYS_DATA_TYPE } from '../../css-data-types';

// margin
export const openMarginShorthand = createShorthandOpenerFromPart<Margins>({
  prop: 'margin',
  dataType: ALWAYS_DATA_TYPE,
  opener: edgesShorthandOpener('margin'),
  openedProps: [
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
  ],
});
