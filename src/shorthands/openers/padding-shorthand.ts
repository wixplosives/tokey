import type { Paddings } from '../shorthand-css-data';

import { edgesShorthandOpener, createShorthandOpenerFromPart } from '../shorthand-parser-utils';
import { ALWAYS_DATA_TYPE } from '../../css-data-types';

// padding
export const openPaddingShorthand = createShorthandOpenerFromPart<Paddings>({
  prop: 'padding',
  dataType: ALWAYS_DATA_TYPE,
  opener: edgesShorthandOpener('padding'),
  openedProps: [
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
  ],
});
