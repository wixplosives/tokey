import type { Backgrounds } from '../shorthand-css-data';
import type { EvaluatedAst, OpenedShorthand, ShorthandPart } from '../shorthand-types';

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
  getShorthandLayers,
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
const finalBgLayerShorthandParts: ShorthandPart<string>[] = [{
  prop: 'background-color',
  dataType: backgroundColorDataType,
} as ShorthandPart<string>].concat(bgLayerShorthandParts);

export const openBackgroundShorthandLayerInner = unorderedListShorthandOpener<Backgrounds>(bgLayerShorthandParts);
export const openBackgroundShorthandFinalLayerInner = unorderedListShorthandOpener<Backgrounds>(finalBgLayerShorthandParts);

// background
export const openBackgroundShorthand = createShorthandOpener<Backgrounds>({
  prop: 'background',
  parts: finalBgLayerShorthandParts as ShorthandPart<Backgrounds>[],
  openShorthand: (astNodes, api) => {
    const layers = getShorthandLayers(astNodes);
    const openedLayers = layers
      .slice(0, -1)
      .map(layer => openBackgroundShorthandLayerInner(layer, api))
      .concat([openBackgroundShorthandFinalLayerInner(layers[layers.length - 1], api)]);
    
    if (layers.length === 1) {
      return openedLayers[0];
    }
    let opened: OpenedShorthand<string> = {};
    for (const layer of openedLayers) {
      const layerProps = Object.keys(layer) as Backgrounds[];
      for (const prop of layerProps) {
        const existingValue = opened[prop] as EvaluatedAst;
        const propValue = layer[prop] as EvaluatedAst;
        opened[prop] = !existingValue ? propValue : [existingValue, propValue];
      }
    }
    return opened;
  },
});
