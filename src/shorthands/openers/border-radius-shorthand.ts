import type { BorderRadiuses } from '../shorthand-css-data';
import type { EvaluatedAst, OpenedShorthand } from '../shorthand-types';

import { ALWAYS_DATA_TYPE } from '../../css-data-types';
import {
  edgesShorthandOpener,
  getShorthandLayers,
  createShorthandOpener,
} from '../shorthand-parser-utils';

const singleBorderRadiusShorthandOpenerInner = edgesShorthandOpener<BorderRadiuses>('border-radius', true);

// border-radius
export const openBorderRadiusShorthand = createShorthandOpener<BorderRadiuses>({
  prop: 'border-radius',
  parts: [{
    prop: 'border-radius',
    dataType: ALWAYS_DATA_TYPE,
    openedProps: [
      'border-top-left-radius',
      'border-top-right-radius',
      'border-bottom-right-radius',
      'border-bottom-left-radius',
    ],
  }],
  openShorthand: (astNodes, api) => {
    const [ firstLayer, secondLayer ] = getShorthandLayers(astNodes, '/');
    const firstOpened = singleBorderRadiusShorthandOpenerInner(firstLayer, api);
    const secondOpened = secondLayer && secondLayer.length > 0
      ? singleBorderRadiusShorthandOpenerInner(secondLayer, api)
      : undefined;
    
    let opened: OpenedShorthand<string> = {};
    const props = Object.keys(firstOpened) as BorderRadiuses[];
    for (const prop of props) {
      opened[prop] = [ firstOpened[prop] as EvaluatedAst ];
      if (secondOpened) {
        (opened[prop] as EvaluatedAst[]).push(secondOpened[prop] as EvaluatedAst);
      }
    }
    return opened;
  },
});
