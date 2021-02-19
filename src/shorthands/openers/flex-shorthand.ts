import type { OpenedShorthand } from '../shorthand-types';

import { Flexes, FLEX_KEYWORD_VALUE_MAP } from '../shorthand-css-data';
import {
  flexDataType,
  flexGrowDataType,
  flexShrinkDataType,
  flexBasisDataType,
} from '../../css-data-types';
import { singleKeywordShorthandOpener, createShorthandOpener } from '../shorthand-parser-utils';
import { NoMandatoryPartMatchError } from '../shorthand-parser-errors';

// flex
export const openFlexShorthand = createShorthandOpener<Flexes>({
  prop: 'flex',
  singleKeywordPart: {
    prop: 'flex',
    dataType: flexDataType,
    opener: singleKeywordShorthandOpener(FLEX_KEYWORD_VALUE_MAP),
  },
  parts: [
    { prop: 'flex-grow',   dataType: flexGrowDataType, mandatory: true },
    { prop: 'flex-shrink', dataType: flexShrinkDataType },
    { prop: 'flex-basis',  dataType: flexBasisDataType  },
  ],
  openShorthand: (astNodes, _api, parts) => {
    let opened: OpenedShorthand<string> = {};

    if (parts[0].dataType.predicate(astNodes[0].value)) {
      opened[parts[0].prop] = astNodes[0];

      if (astNodes.length > 1) {
        const secondValue = astNodes[1].value;
        if (parts[1].dataType.predicate(secondValue)) {
          opened[parts[1].prop] = astNodes[1];
          if (astNodes.length > 2) {
            if (parts[2].dataType.predicate(astNodes[2].value)) {
              opened[parts[2].prop] = astNodes[2];
            } else {
              throw new NoMandatoryPartMatchError('flex', parts[2].prop);
            }
          }
        } else if (parts[2].dataType.predicate(secondValue)) {
          if (astNodes.length < 3) {
            opened[parts[2].prop] = astNodes[1];
          } else {
            throw new NoMandatoryPartMatchError('flex', parts[1].prop);
          }
        } else {
          throw new NoMandatoryPartMatchError('flex', `${parts[1].prop}, ${parts[2].prop}`);
        }
      }
    } else {
      throw new NoMandatoryPartMatchError('flex', parts[0].prop);
    }

    return opened;
  },
});
