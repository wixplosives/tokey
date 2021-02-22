import type { Backgrounds } from '../shorthand-css-data';
import type { ShorthandPart } from '../shorthand-types';

import {
  bgImageDataType,
  bgPositionDataType,
  bgSizeDataType,
  repeatStyleDataType,
  attachmentDataType,
  backgroundOriginDataType,
  backgroundClipDataType,
  backgroundColorDataType,
} from '../../css-data-types';
import {
  splitShorthandOpener,
  unorderedListShorthandOpener,
  layersShorthandOpener,
  createShorthandOpener,
} from '../shorthand-parser-utils';

const bgLayerShorthandParts: ShorthandPart<string>[] = [
  { prop: 'background-image',      dataType: bgImageDataType },
  { prop: 'background-position',   dataType: bgPositionDataType,  multipleItems: true },
  { prop: 'background-size',       dataType: bgSizeDataType,      multipleItems: true },
  { prop: 'background-repeat',     dataType: repeatStyleDataType, multipleItems: true },
  { prop: 'background-attachment', dataType: attachmentDataType },
  {
    prop: 'background-origin',
    dataType: backgroundOriginDataType,
    opener: splitShorthandOpener(['background-origin', 'background-clip']),
  },
  { prop: 'background-clip',       dataType: backgroundClipDataType },
];
const lastBgLayerShorthandParts: ShorthandPart<string>[] = [{
  prop: 'background-color',
  dataType: backgroundColorDataType,
}].concat(bgLayerShorthandParts);
export const openBackgroundShorthandLayerInner = unorderedListShorthandOpener<Backgrounds>(bgLayerShorthandParts);
export const openBackgroundShorthandLastLayerInner = unorderedListShorthandOpener<Backgrounds>(lastBgLayerShorthandParts);

// background
export const openBackgroundShorthand = createShorthandOpener<Backgrounds>({
  prop: 'background',
  parts: lastBgLayerShorthandParts as ShorthandPart<Backgrounds>[],
  openShorthand: (astNodes, api) => layersShorthandOpener(
    'background',
    openBackgroundShorthandLayerInner,
    bgLayerShorthandParts,
    openBackgroundShorthandLastLayerInner,
    lastBgLayerShorthandParts,
  )(astNodes, api),
});
