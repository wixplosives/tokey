import type { CSSCodeAst } from "../parsers/css-value-tokenizer";
import type { ParseShorthandAPI, ShorthandPropertyOpener } from "./types";

const openExpressions = (ast: CSSCodeAst[], api: ParseShorthandAPI) => {
  const res: CSSCodeAst[] = [];
  for (const node of ast) {
    if (api.isExpression(node)) {
      const inner = api.getValue(node);

      const innerOpen = openExpressions(inner, api);
      res.push(...innerOpen);
    } else {
      res.push(node);
    }
  }
  return res;
};

const openWithOrigin = (ast: CSSCodeAst[], api: ParseShorthandAPI) => {
  const res: { value: CSSCodeAst; origin?: CSSCodeAst }[] = [];
  for (const node of ast) {
    if (api.isExpression(node)) {
      const inner = api.getValue(node);

      const innerOpen = openExpressions(inner, api);
      res.push(
        ...innerOpen.map((value) => ({
          value,
          origin: node,
        }))
      );
    } else {
      res.push({ value: node });
    }
  }
  return res;
};

export const openSidesShorthand: (
  prefix: string,
  suffix: string
) => ShorthandPropertyOpener<string> = (prefix, suffix) => (shortHand, api) => {
  const valueAst = openWithOrigin(shortHand, api);
  if (valueAst.length === 1) {
    return {
      [`${prefix}bottom${suffix}`]: valueAst[0],
      [`${prefix}left${suffix}`]: valueAst[0],
      [`${prefix}right${suffix}`]: valueAst[0],
      [`${prefix}top${suffix}`]: valueAst[0],
    };
  }
  if (valueAst.length === 2) {
    return {
      [`${prefix}bottom${suffix}`]: valueAst[0],
      [`${prefix}left${suffix}`]: valueAst[1],
      [`${prefix}right${suffix}`]: valueAst[1],
      [`${prefix}top${suffix}`]: valueAst[0],
    };
  }
  if (valueAst.length === 3) {
    return {
      [`${prefix}bottom${suffix}`]: valueAst[2],
      [`${prefix}left${suffix}`]: valueAst[1],
      [`${prefix}right${suffix}`]: valueAst[1],
      [`${prefix}top${suffix}`]: valueAst[0],
    };
  }
  return {
    [`${prefix}bottom${suffix}`]: valueAst[2],
    [`${prefix}left${suffix}`]: valueAst[3],
    [`${prefix}right${suffix}`]: valueAst[1],
    [`${prefix}top${suffix}`]: valueAst[0],
  };
};

export const openUnorderedListShorthand: (
  props: Array<{
    names: string[];
    valuePredicate: (ast: CSSCodeAst) => boolean;
  }>
) => ShorthandPropertyOpener<string> = (props) => (shortHand, api) => {
  const valueAst = openWithOrigin(shortHand, api);
  const unfoundProps = [...props];
  const res: Record<string, { value: CSSCodeAst; origin?: CSSCodeAst }> = {};

  for (const node of valueAst) {
    const longHandIdx = unfoundProps.findIndex((prop) =>
      prop.valuePredicate(node.value)
    );
    if (longHandIdx !== -1) {
      const longHand = unfoundProps[longHandIdx];
      unfoundProps.splice(longHandIdx, 1);
      for (const name of longHand.names) {
        res[name] = node;
      }
    }
  }
  return res;
};

export type Margins =
  | "margin-left"
  | "margin-top"
  | "margin-bottom"
  | "margin-right";

export type Paddings =
  | "padding-left"
  | "padding-top"
  | "padding-bottom"
  | "padding-right";

export type BorderStyles =
  | "border-left-style"
  | "border-top-style"
  | "border-bottom-style"
  | "border-right-style";
export type BorderColors =
  | "border-left-color"
  | "border-top-color"
  | "border-bottom-color"
  | "border-right-color";
export type BorderWidths =
  | "border-left-width"
  | "border-top-width"
  | "border-bottom-width"
  | "border-right-width";

export const lineStyles = [
  "none",
  "hidden",
  "dotted",
  "dashed",
  "solid",
  "double",
  "groove",
  "ridge",
  "inset",
  "outset",
];

export const namedColors = [
  "transparent",
  "aliceblue",
  "antiquewhite",
  "aqua",
  "aquamarine",
  "azure",
  "beige",
  "bisque",
  "black",
  "blanchedalmond",
  "blue",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "cornflowerblue",
  "cornsilk",
  "crimson",
  "cyan",
  "darkblue",
  "darkcyan",
  "darkgoldenrod",
  "darkgray",
  "darkgreen",
  "darkgrey",
  "darkkhaki",
  "darkmagenta",
  "darkolivegreen",
  "darkorange",
  "darkorchid",
  "darkred",
  "darksalmon",
  "darkseagreen",
  "darkslateblue",
  "darkslategray",
  "darkslategrey",
  "darkturquoise",
  "darkviolet",
  "deeppink",
  "deepskyblue",
  "dimgray",
  "dimgrey",
  "dodgerblue",
  "firebrick",
  "floralwhite",
  "forestgreen",
  "fuchsia",
  "gainsboro",
  "ghostwhite",
  "gold",
  "goldenrod",
  "gray",
  "green",
  "greenyellow",
  "grey",
  "honeydew",
  "hotpink",
  "indianred",
  "indigo",
  "ivory",
  "khaki",
  "lavender",
  "lavenderblush",
  "lawngreen",
  "lemonchiffon",
  "lightblue",
  "lightcoral",
  "lightcyan",
  "lightgoldenrodyellow",
  "lightgray",
  "lightgreen",
  "lightgrey",
  "lightpink",
  "lightsalmon",
  "lightseagreen",
  "lightskyblue",
  "lightslategray",
  "lightslategrey",
  "lightsteelblue",
  "lightyellow",
  "lime",
  "limegreen",
  "linen",
  "magenta",
  "maroon",
  "mediumaquamarine",
  "mediumblue",
  "mediumorchid",
  "mediumpurple",
  "mediumseagreen",
  "mediumslateblue",
  "mediumspringgreen",
  "mediumturquoise",
  "mediumvioletred",
  "midnightblue",
  "mintcream",
  "mistyrose",
  "moccasin",
  "navajowhite",
  "navy",
  "oldlace",
  "olive",
  "olivedrab",
  "orange",
  "orangered",
  "orchid",
  "palegoldenrod",
  "palegreen",
  "paleturquoise",
  "palevioletred",
  "papayawhip",
  "peachpuff",
  "peru",
  "pink",
  "plum",
  "powderblue",
  "purple",
  "rebeccapurple",
  "red",
  "rosybrown",
  "royalblue",
  "saddlebrown",
  "salmon",
  "sandybrown",
  "seagreen",
  "seashell",
  "sienna",
  "silver",
  "skyblue",
  "slateblue",
  "slategray",
  "slategrey",
  "snow",
  "springgreen",
  "steelblue",
  "tan",
  "teal",
  "thistle",
  "tomato",
  "turquoise",
  "violet",
  "wheat",
  "white",
  "whitesmoke",
  "yellow",
  "yellowgreen",
];

export type Borders = BorderStyles | BorderColors | BorderWidths;

export const openMarginShorthand: ShorthandPropertyOpener<Margins> = openSidesShorthand(
  "margin-",
  ""
);

export const openPaddingShorthand: ShorthandPropertyOpener<Paddings> = openSidesShorthand(
  "padding-",
  ""
);

export const openBorderStyleShorthand: ShorthandPropertyOpener<BorderStyles> = openSidesShorthand(
  "border-",
  "-style"
);

export const isLineWidth = (ast: CSSCodeAst) => {
  if (ast.type === "text") {
    if (ast.text === "thin" || ast.text === "medium" || ast.text === "thick") {
      return true;
    }
  }
  return isLength(ast);
};

export const isLength = (ast: CSSCodeAst) => {
  if (ast.type === "call" && ast.name === "calc") {
    return true;
  }
  if (ast.type === "text") {
    const val = parseFloat(ast.text);
    if (!isNaN(val)) {
      return true;
    }
  }
  return false;
};

export const isColor = (ast: CSSCodeAst) => {
  if (ast.type === "call" && ast.name === "rgba") {
    return true;
  }
  if (ast.type === "text") {
    if (ast.text.startsWith("#")) {
      return true;
    }
    if (namedColors.includes(ast.text)) {
      return true;
    }
  }

  return false;
};

export const isLineStyle = (ast: CSSCodeAst) => {
  if (ast.type === "text") {
    if (lineStyles.includes(ast.text)) {
      return true;
    }
  }

  return false;
};

export const openBorderShorthand: ShorthandPropertyOpener<Borders> = openUnorderedListShorthand(
  [
    {
      names: [
        "border-left-style",
        "border-right-style",
        "border-top-style",
        "border-bottom-style",
      ],
      valuePredicate: isLineStyle,
    },
    {
      names: [
        "border-left-width",
        "border-right-width",
        "border-top-width",
        "border-bottom-width",
      ],
      valuePredicate: isLineWidth,
    },
    {
      names: [
        "border-left-color",
        "border-right-color",
        "border-top-color",
        "border-bottom-color",
      ],
      valuePredicate: isColor,
    },
  ]
);
