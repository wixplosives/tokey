import type {
  ParseShorthandAPI,
  EvaluatedAst,
  AstEvaluator,
  DataTypeMatch,
  OpenedShorthand,
  ShorthandOpener,
  ShorthandOpenerInner,
  UnorderedListShorthandOptions,
  ShorthandPart,
  ShorthandOpenerData,
} from './shorthand-types';

import { createCssValueAST, CSSCodeAst } from '../parsers/css-value-tokenizer';
import {
  DataTypeType,
  unorderedListPredicate,
  universalDataType,
  DEFAULT_LAYER_SEPERATOR,
} from '../css-data-types';
import {
  CssEdge,
  CssCorner,
  CSS_PROPERTY_DELIMITER,
  EDGE_SHORTHAND_EDGES,
  CORNER_SHORTHAND_CORNERS,
  EDGE_SHORTHAND_INDICES_BY_LENGTH,
} from './shorthand-css-data';
import {
  InvalidEdgesInputLengthError,
  NoDataTypeMatchError,
  NoMandatoryPartMatchError,
} from './shorthand-parser-errors';

const createEvaluateAst = <T>(
  handleExpression: (node: CSSCodeAst, api: ParseShorthandAPI) => T[],
  handleNonExpression: (node: CSSCodeAst) => T,
): AstEvaluator<T> => (ast, api) => {
  const res: T[] = [];
  for (const node of ast) {
    if (api.isExpression(node)) {
      res.push(...handleExpression(node, api));
    } else {
      res.push(handleNonExpression(node));
    }
  }
  return res;
}

const evaluateExpression = (node: CSSCodeAst, api: ParseShorthandAPI) =>
  evaluateAstInner(api.getValue(node), api);

const evaluateAstInner: AstEvaluator<CSSCodeAst> = createEvaluateAst(
  (node, api) => evaluateExpression(node, api),
  node => node,
);

// TODO: Always have origin to values that don't come from a default value (that are specified directly)
export const evaluateAst: AstEvaluator<EvaluatedAst> = createEvaluateAst(
  (origin, api) => evaluateExpression(origin, api).map(value => ({ value, origin })),
  value => ({ value }),
);

const getDataTypeMatch = (
  astNodes: EvaluatedAst[],
  index: number,
  parts: ShorthandPart<string>[],
  prevDataType: DataTypeType,
): DataTypeMatch => {
  for (let i = 0; i < parts.length; i++) {
    let matchAmount = 0;
    if ((matchAmount = Number(
      parts[i].dataType.predicate(
        astNodes[index].value,
        index,
        astNodes,
        prevDataType,
      )
    )) > 0) {
      return { matchAmount, matchIndex: i };
    }
  }

  return { matchAmount: 1, matchIndex: -1 };
};

// TODO: Mark default in value/origin + Test defaults
const getDefaultAst = (value: string): EvaluatedAst => ({
  value: createCssValueAST(value)[0],
});

const setDefaultOpenedProps = <T extends string>(
  shorthandProp: string,
  parts: ShorthandPart<string>[],
  opened: OpenedShorthand<string>,
  shallow?: boolean,
): OpenedShorthand<T> => {
  for (const part of parts) {
    const props = shallow || !part.openedProps ? [part.prop] : part.openedProps;
    for (const prop of props) {
      if (opened[prop] === undefined) {
        if (!part.mandatory) {
          const defaultAst = getDefaultAst(part.dataType.defaultValue);
          opened[prop] = !part.multipleItems ? defaultAst : [defaultAst];
        } else {
          throw new NoMandatoryPartMatchError(shorthandProp, prop);
        }
      }
    };
  };

  return opened;
};

const setCommonProps = <T extends string>(
  parts: ShorthandPart<string>[],
  nodes: EvaluatedAst[],
  opened: OpenedShorthand<string>,
): OpenedShorthand<T> => {
  for (let i = 0; i < parts.length && nodes.length > 0; i++) {
    const { prop } = parts[i];
    if (opened[prop] === undefined) {
      let commonNode: EvaluatedAst | undefined;
      if (commonNode = nodes.shift()) {
        opened[prop] = commonNode;
      }
    }
  }

  return opened;
};

export const edgesShorthandOpener = <T extends string>(
  prop: string,
  corners?: boolean,
): ShorthandOpenerInner<T> => astNodes => {
  // TODO: Validate values?
  if (astNodes.length < 1 || astNodes.length > 4) {
    throw new InvalidEdgesInputLengthError(prop, astNodes.length);
  }

  const [ propPrefix, propSuffix ] = prop.split(CSS_PROPERTY_DELIMITER);
  const prefix = propPrefix + CSS_PROPERTY_DELIMITER;
  const suffix = propSuffix ? (CSS_PROPERTY_DELIMITER + propSuffix) : '';
  const edgeIndices = EDGE_SHORTHAND_INDICES_BY_LENGTH[astNodes.length - 1];
  const edges = !corners ? EDGE_SHORTHAND_EDGES : CORNER_SHORTHAND_CORNERS;

  const edgeProp = (edge: CssEdge | CssCorner) => `${prefix}${edge}${suffix}`;
  const edgeValue = (index: number) => astNodes[edgeIndices[index]];

  return {
    [edgeProp(edges[0])]: edgeValue(0),
    [edgeProp(edges[1])]: edgeValue(1),
    [edgeProp(edges[2])]: edgeValue(2),
    [edgeProp(edges[3])]: edgeValue(3),

  } as OpenedShorthand<string>;
};

export const splitShorthandOpener = <T extends string>(
  props: string[],
): ShorthandOpenerInner<T> => astNodes => {
  let opened: OpenedShorthand<string> = {};
  for (const prop of props) {
    opened[prop] = astNodes[0];
  }
  return opened;
};

export const singleKeywordShorthandOpener = <T extends string>(
  keywordValueMap: Record<string, Record<T, string>>,
): ShorthandOpenerInner<T> => astNodes => {
  let opened: OpenedShorthand<string> = {};
  const keywordValues = keywordValueMap[astNodes[0].value.text];
  const props = Object.keys(keywordValues) as T[];
  for (const prop of props) {
    opened[prop] = getDefaultAst(keywordValues[prop]);
  }
  return opened;
};

export const unorderedListShorthandOpener = <T extends string>(
  parts: ShorthandPart<string>[],
  {
    shallow,
    commonValue,
  }: UnorderedListShorthandOptions = {},
): ShorthandOpenerInner<T> => (astNodes, api) => {
  let opened: OpenedShorthand<string> = {};
  
  const unfoundParts = [...parts];
  const commonMatch = commonValue
    ? unorderedListPredicate(commonValue)
    : () => false;
  let commonNodes: EvaluatedAst[] = [];
  let prevDataType: DataTypeType = DataTypeType.Unknown;
  for (let index = 0; index < astNodes.length; ) {
    let currNode = astNodes[index];
    if (commonValue && commonMatch(currNode.value)) {
      commonNodes.push(astNodes[index++]);
      continue;
    }
    const { matchAmount, matchIndex } = getDataTypeMatch(
      astNodes,
      index,
      unfoundParts,
      prevDataType,
    );
    const foundPart = unfoundParts[matchIndex];
    if (matchIndex !== -1 && foundPart) {      
      let matchLength = matchAmount;
      const { prop, dataType, opener, multipleItems } = foundPart;
      if (dataType.prefix && currNode.value.text === dataType.prefix.prefixChar) {
        currNode = astNodes[++index];
        matchLength--;
      }
      const nodes = matchLength === 1 ? currNode : astNodes.slice(index, index + matchLength);
      if (shallow || !opener) {
        opened[prop] = multipleItems
          ? ((opened[prop] || []) as EvaluatedAst[]).concat(nodes)
          : nodes;
      } else {
        opened = {
          ...opened,
          ...opener(
            Array.isArray(nodes) ? nodes : [nodes],
            api,
          ),
        };
      }
      unfoundParts.splice(matchIndex, 1);
      prevDataType = dataType.dataType;
      index += matchLength;
    } else {
      throw new NoDataTypeMatchError(currNode.value.text);
    }
  }

  if (commonValue) {
    opened = setCommonProps(parts, commonNodes, opened);
  }

  return opened;
};

export const getShorthandLayers = (
  astNodes: EvaluatedAst[],
  seperator = DEFAULT_LAYER_SEPERATOR,
) => {
  let layers: EvaluatedAst[][] = [];
  let layerIndex = 0;
  for (const node of astNodes) {
    if (node.value.text === seperator) {
      layerIndex++;
      continue;
    }
    if (!layers[layerIndex]) {
      layers[layerIndex] = [];
    }
    layers[layerIndex].push(node);
  }
  return layers;
};

export const layersShorthandOpener = <T extends string>(
  prop: string,
  singleLayerOpener: ShorthandOpenerInner<T>,
  singleLayerParts: ShorthandPart<string>[],
  lastLayerOpener?: ShorthandOpenerInner<T>,
  lastLayerParts?: ShorthandPart<string>[],
): ShorthandOpenerInner<T> => (astNodes, api) => {
  const layers = getShorthandLayers(astNodes);
  let openedLayers = (!lastLayerOpener ? layers : layers.slice(0, -1))
    .map(layer => setDefaultOpenedProps(
      prop,
      singleLayerParts,
      singleLayerOpener(layer, api)
    ));
  if (lastLayerOpener) {
    openedLayers = openedLayers.concat([
      setDefaultOpenedProps(
        prop,
        lastLayerParts || [],
        lastLayerOpener(layers[layers.length - 1], api)
      )
    ]);
  }
  
  if (layers.length === 1) {
    return openedLayers[0];
  }
  let opened: OpenedShorthand<string> = {};
  for (const layer of openedLayers) {
    const layerProps = Object.keys(layer) as T[];
    for (const prop of layerProps) {
      const existingValue = opened[prop] as EvaluatedAst;
      const propValue = layer[prop] as EvaluatedAst;
      opened[prop] = !existingValue ? propValue : [existingValue, propValue];
    }
  }
  return opened;
};

const getShorthandPartsProps = <T extends string>(
  parts: ShorthandPart<T>[],
  shallow?: boolean,
) => {
  let partsProps: string[] = [];
  for (const part of parts) {
    partsProps = partsProps.concat(shallow || !part.openedProps ? part.prop : part.openedProps);
  }
  return partsProps;
};

const openSingleKeywordShorthand = <T extends string>(
  shorthandProp: string,
  partProps: string[],
  astNodes: EvaluatedAst[],
  api: ParseShorthandAPI,
  part?: ShorthandPart<T>,
): OpenedShorthand<T> => {
  let opened: OpenedShorthand<string> = {};

  if (astNodes.length === 1) {
    const node = astNodes[0];
    const universalPart: ShorthandPart<string> = {
      prop: shorthandProp,
      dataType: universalDataType,
      opener: splitShorthandOpener(partProps),
    };
    /* Identify shorthand single-keyword with predicate */
    const matchingPart = part && part.dataType.predicate(node.value)
      ? part : (
        universalPart.dataType.predicate(node.value)
          ? universalPart : undefined
      );
    if (matchingPart) {
      /* Return the opened single-keyword shorthand, using opener if it exists */
      opened = (
        matchingPart.opener
          ? matchingPart.opener([node], api)
          : { [matchingPart.prop]: node }
      );
    }
  }

  return opened;
};

export const createShorthandOpener = <T extends string>(
  {
    prop,
    singleKeywordPart,
    parts,
    openShorthand,
  }: ShorthandOpenerData<T>,
): ShorthandOpener<T> => (shortHand, api, shallow) => {
  /* Evaluate the full input AST */
  const astNodes = evaluateAst(shortHand, api);

  /* Try opening the shorthand as a single keyword and return it if so */
  const singleKeywordOpened = openSingleKeywordShorthand(
    prop,
    getShorthandPartsProps(parts, shallow),
    astNodes,
    api,
    singleKeywordPart,
  );
  if (Object.keys(singleKeywordOpened).length > 0) {
    return singleKeywordOpened;
  }

  // TODO: Catch errors and return some value on error?

  /* Open the shorthand using the provided method */
  const opened = openShorthand(astNodes, api, parts, shallow);

  /* Return the opened shorthand, after setting missing default values */
  return setDefaultOpenedProps(prop, parts, opened, shallow);
};

export const createShorthandOpenerFromPart = <T extends string>(
  part: ShorthandPart<T>,
): ShorthandOpener<T> => {
  return createShorthandOpener({
    prop: part.prop,
    parts: [part],
    openShorthand: (astNodes, api, _parts, shallow) => part.opener
      ? part.opener(astNodes, api, shallow)
      : ({} as OpenedShorthand<T>),
  });
};
