export const valueDefinitions = {
  props: {
    "<'--*'>": {
      syntax: "<declaration-value>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/--*",
    },
    "<'accent-color'>": {
      syntax: "auto | <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/accent-color",
    },
    "<'align-content'>": {
      syntax:
        "normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/align-content",
    },
    "<'align-items'>": {
      syntax:
        "normal | stretch | <baseline-position> | [ <overflow-position>? <self-position> ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/align-items",
    },
    "<'align-self'>": {
      syntax:
        "auto | normal | stretch | <baseline-position> | <overflow-position>? <self-position>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/align-self",
    },
    "<'align-tracks'>": {
      syntax:
        "[ normal | <baseline-position> | <content-distribution> | <overflow-position>? <content-position> ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/align-tracks",
    },
    "<'all'>": {
      syntax: "initial | inherit | unset | revert",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/all",
    },
    "<'animation'>": {
      syntax: "<single-animation>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation",
      subProps: [
        "<'animation-delay'>",
        "<'animation-direction'>",
        "<'animation-duration'>",
        "<'animation-fill-mode'>",
        "<'animation-iteration-count'>",
        "<'animation-name'>",
        "<'animation-play-state'>",
        "<'animation-timing-function'>",
      ],
    },
    "<'animation-delay'>": {
      syntax: "<time>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-delay",
    },
    "<'animation-direction'>": {
      syntax: "<single-animation-direction>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-direction",
    },
    "<'animation-duration'>": {
      syntax: "<time>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-duration",
    },
    "<'animation-fill-mode'>": {
      syntax: "<single-animation-fill-mode>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode",
    },
    "<'animation-iteration-count'>": {
      syntax: "<single-animation-iteration-count>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-iteration-count",
    },
    "<'animation-name'>": {
      syntax: "[ none | <keyframes-name> ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-name",
    },
    "<'animation-play-state'>": {
      syntax: "<single-animation-play-state>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-play-state",
    },
    "<'animation-timing-function'>": {
      syntax: "<easing-function>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/animation-timing-function",
    },
    "<'appearance'>": {
      syntax: "none | auto | textfield | menulist-button | <compat-auto>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/appearance",
    },
    "<'aspect-ratio'>": {
      syntax: "auto | <ratio>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio",
    },
    "<'backdrop-filter'>": {
      syntax: "none | <filter-function-list>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter",
    },
    "<'backface-visibility'>": {
      syntax: "visible | hidden",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/backface-visibility",
    },
    "<'background'>": {
      syntax: "[ <bg-layer> , ]* <final-bg-layer>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background",
      subProps: [
        "<'background-attachment'>",
        "<'background-clip'>",
        "<'background-color'>",
        "<'background-image'>",
        "<'background-origin'>",
        "<'background-position'>",
        "<'background-repeat'>",
        "<'background-size'>",
      ],
    },
    "<'background-attachment'>": {
      syntax: "<attachment>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-attachment",
    },
    "<'background-blend-mode'>": {
      syntax: "<blend-mode>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-blend-mode",
    },
    "<'background-clip'>": {
      syntax: "<box>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip",
    },
    "<'background-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-color",
    },
    "<'background-image'>": {
      syntax: "<bg-image>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-image",
    },
    "<'background-origin'>": {
      syntax: "<box>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-origin",
    },
    "<'background-position'>": {
      syntax: "<bg-position>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-position",
    },
    "<'background-position-x'>": {
      syntax:
        "[ center | [ [ left | right | x-start | x-end ]? <length-percentage>? ]! ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-position-x",
    },
    "<'background-position-y'>": {
      syntax:
        "[ center | [ [ top | bottom | y-start | y-end ]? <length-percentage>? ]! ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-position-y",
    },
    "<'background-repeat'>": {
      syntax: "<repeat-style>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-repeat",
    },
    "<'background-size'>": {
      syntax: "<bg-size>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/background-size",
    },
    "<'block-size'>": {
      syntax: "<'width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/block-size",
    },
    "<'border'>": {
      syntax: "<line-width> || <line-style> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border",
      subProps: ["<'border-color'>", "<'border-style'>", "<'border-width'>"],
    },
    "<'border-block'>": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block",
      subProps: [
        "<'border-block-color'>",
        "<'border-block-style'>",
        "<'border-block-width'>",
      ],
    },
    "<'border-block-color'>": {
      syntax: "<'border-top-color'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-color",
    },
    "<'border-block-end'>": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-end",
      subProps: [
        "<'border-block-end-color'>",
        "<'border-block-end-style'>",
        "<'border-block-end-width'>",
      ],
    },
    "<'border-block-end-color'>": {
      syntax: "<'border-top-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-end-color",
    },
    "<'border-block-end-style'>": {
      syntax: "<'border-top-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-end-style",
    },
    "<'border-block-end-width'>": {
      syntax: "<'border-top-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-end-width",
    },
    "<'border-block-start'>": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-start",
      subProps: [
        "<'border-block-start-color'>",
        "<'border-block-start-style'>",
        "<'border-block-start-width'>",
      ],
    },
    "<'border-block-start-color'>": {
      syntax: "<'border-top-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-start-color",
    },
    "<'border-block-start-style'>": {
      syntax: "<'border-top-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-start-style",
    },
    "<'border-block-start-width'>": {
      syntax: "<'border-top-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-start-width",
    },
    "<'border-block-style'>": {
      syntax: "<'border-top-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-style",
    },
    "<'border-block-width'>": {
      syntax: "<'border-top-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-block-width",
    },
    "<'border-bottom'>": {
      syntax: "<line-width> || <line-style> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom",
      subProps: [
        "<'border-bottom-color'>",
        "<'border-bottom-style'>",
        "<'border-bottom-width'>",
      ],
    },
    "<'border-bottom-color'>": {
      syntax: "<'border-top-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-color",
    },
    "<'border-bottom-left-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-left-radius",
    },
    "<'border-bottom-right-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-right-radius",
    },
    "<'border-bottom-style'>": {
      syntax: "<line-style>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-style",
    },
    "<'border-bottom-width'>": {
      syntax: "<line-width>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-bottom-width",
    },
    "<'border-collapse'>": {
      syntax: "collapse | separate",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-collapse",
    },
    "<'border-color'>": {
      syntax: "<color>{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-color",
      subProps: [
        "<'border-bottom-color'>",
        "<'border-left-color'>",
        "<'border-right-color'>",
        "<'border-top-color'>",
      ],
    },
    "<'border-end-end-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-end-end-radius",
    },
    "<'border-end-start-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-end-start-radius",
    },
    "<'border-image'>": {
      syntax:
        "<'border-image-source'> || <'border-image-slice'> [ / <'border-image-width'> | / <'border-image-width'>? / <'border-image-outset'> ]? || <'border-image-repeat'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-image",
      subProps: [
        "<'border-image-outset'>",
        "<'border-image-repeat'>",
        "<'border-image-slice'>",
        "<'border-image-source'>",
        "<'border-image-width'>",
      ],
    },
    "<'border-image-outset'>": {
      syntax: "[ <length> | <number> ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-outset",
    },
    "<'border-image-repeat'>": {
      syntax: "[ stretch | repeat | round | space ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-repeat",
    },
    "<'border-image-slice'>": {
      syntax: "<number-percentage>{1,4} && fill?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-slice",
    },
    "<'border-image-source'>": {
      syntax: "none | <image>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-source",
    },
    "<'border-image-width'>": {
      syntax: "[ <length-percentage> | <number> | auto ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-image-width",
    },
    "<'border-inline'>": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline",
      subProps: [
        "<'border-inline-color'>",
        "<'border-inline-style'>",
        "<'border-inline-width'>",
      ],
    },
    "<'border-inline-color'>": {
      syntax: "<'border-top-color'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-color",
    },
    "<'border-inline-end'>": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end",
      subProps: [
        "<'border-inline-end-color'>",
        "<'border-inline-end-style'>",
        "<'border-inline-end-width'>",
      ],
    },
    "<'border-inline-end-color'>": {
      syntax: "<'border-top-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-color",
    },
    "<'border-inline-end-style'>": {
      syntax: "<'border-top-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-style",
    },
    "<'border-inline-end-width'>": {
      syntax: "<'border-top-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-end-width",
    },
    "<'border-inline-start'>": {
      syntax: "<'border-top-width'> || <'border-top-style'> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start",
      subProps: [
        "<'border-inline-start-color'>",
        "<'border-inline-start-style'>",
        "<'border-inline-start-width'>",
      ],
    },
    "<'border-inline-start-color'>": {
      syntax: "<'border-top-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-color",
    },
    "<'border-inline-start-style'>": {
      syntax: "<'border-top-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-style",
    },
    "<'border-inline-start-width'>": {
      syntax: "<'border-top-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-start-width",
    },
    "<'border-inline-style'>": {
      syntax: "<'border-top-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-style",
    },
    "<'border-inline-width'>": {
      syntax: "<'border-top-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-inline-width",
    },
    "<'border-left'>": {
      syntax: "<line-width> || <line-style> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-left",
      subProps: [
        "<'border-left-color'>",
        "<'border-left-style'>",
        "<'border-left-width'>",
      ],
    },
    "<'border-left-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-color",
    },
    "<'border-left-style'>": {
      syntax: "<line-style>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-style",
    },
    "<'border-left-width'>": {
      syntax: "<line-width>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-left-width",
    },
    "<'border-radius'>": {
      syntax: "<length-percentage>{1,4} [ / <length-percentage>{1,4} ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-radius",
      subProps: [
        "<'border-top-left-radius'>",
        "<'border-top-right-radius'>",
        "<'border-bottom-right-radius'>",
        "<'border-bottom-left-radius'>",
      ],
    },
    "<'border-right'>": {
      syntax: "<line-width> || <line-style> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-right",
      subProps: [
        "<'border-right-color'>",
        "<'border-right-style'>",
        "<'border-right-width'>",
      ],
    },
    "<'border-right-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-color",
    },
    "<'border-right-style'>": {
      syntax: "<line-style>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-style",
    },
    "<'border-right-width'>": {
      syntax: "<line-width>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-right-width",
    },
    "<'border-spacing'>": {
      syntax: "<length> <length>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-spacing",
    },
    "<'border-start-end-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-start-end-radius",
    },
    "<'border-start-start-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-start-start-radius",
    },
    "<'border-style'>": {
      syntax: "<line-style>{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-style",
      subProps: [
        "<'border-bottom-style'>",
        "<'border-left-style'>",
        "<'border-right-style'>",
        "<'border-top-style'>",
      ],
    },
    "<'border-top'>": {
      syntax: "<line-width> || <line-style> || <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top",
      subProps: [
        "<'border-top-color'>",
        "<'border-top-style'>",
        "<'border-top-width'>",
      ],
    },
    "<'border-top-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-color",
    },
    "<'border-top-left-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-left-radius",
    },
    "<'border-top-right-radius'>": {
      syntax: "<length-percentage>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-right-radius",
    },
    "<'border-top-style'>": {
      syntax: "<line-style>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-style",
    },
    "<'border-top-width'>": {
      syntax: "<line-width>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-top-width",
    },
    "<'border-width'>": {
      syntax: "<line-width>{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/border-width",
      subProps: [
        "<'border-bottom-width'>",
        "<'border-left-width'>",
        "<'border-right-width'>",
        "<'border-top-width'>",
      ],
    },
    "<'bottom'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/bottom",
    },
    "<'@page#page-margin-box-type'>": {
      syntax: "@page <page-selector-list> {",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@page#page-margin-box-type",
    },
    "<'box-decoration-break'>": {
      syntax: "slice | clone",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-decoration-break",
    },
    "<'box-shadow'>": {
      syntax: "none | <shadow>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow",
    },
    "<'box-sizing'>": {
      syntax: "content-box | border-box",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing",
    },
    "<'break-after'>": {
      syntax:
        "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/break-after",
    },
    "<'break-before'>": {
      syntax:
        "auto | avoid | always | all | avoid-page | page | left | right | recto | verso | avoid-column | column | avoid-region | region",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/break-before",
    },
    "<'break-inside'>": {
      syntax: "auto | avoid | avoid-page | avoid-column | avoid-region",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/break-inside",
    },
    "<'calc()'>": {
      syntax: "calc( <calc-sum> )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/calc()",
    },
    "<'caption-side'>": {
      syntax:
        "top | bottom | block-start | block-end | inline-start | inline-end",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/caption-side",
    },
    "<'caret-color'>": {
      syntax: "auto | <color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/caret-color",
    },
    "<'@font-feature-values#@character-variant'>": {
      syntax: "@font-feature-values <family-name># {",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-feature-values#@character-variant",
    },
    "<'font-variant-alternates#character-variant()'>": {
      syntax:
        "normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates#character-variant()",
    },
    "<'@charset'>": {
      syntax: '@charset "<charset>";',
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@charset",
    },
    "<'clamp()'>": {
      syntax: "clamp( <calc-sum>#{3} )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/clamp()",
    },
    "<'clear'>": {
      syntax: "none | left | right | both | inline-start | inline-end",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/clear",
    },
    "<'clip'>": {
      syntax: "<shape> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/clip",
    },
    "<'clip-path'>": {
      syntax: "<clip-source> | [ <basic-shape> || <geometry-box> ] | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/clip-path",
    },
    "<'color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/color",
    },
    "<'color-adjust'>": {
      syntax: "economy | exact",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/color-adjust",
    },
    "<'color-scheme'>": {
      syntax: "normal | [ light | dark | <custom-ident> ]+",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme",
    },
    "<'column-count'>": {
      syntax: "<integer> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-count",
    },
    "<'column-fill'>": {
      syntax: "auto | balance | balance-all",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-fill",
    },
    "<'column-gap'>": {
      syntax: "normal | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap",
    },
    "<'column-rule'>": {
      syntax:
        "<'column-rule-width'> || <'column-rule-style'> || <'column-rule-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule",
    },
    "<'column-rule-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-color",
    },
    "<'column-rule-style'>": {
      syntax: "<'border-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-style",
    },
    "<'column-rule-width'>": {
      syntax: "<'border-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule-width",
    },
    "<'column-span'>": {
      syntax: "none | all",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-span",
    },
    "<'column-width'>": {
      syntax: "<length> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/column-width",
    },
    "<'columns'>": {
      syntax: "<'column-width'> || <'column-count'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/columns",
      subProps: ["<'column-count'>", "<'column-width'>"],
    },
    "<'contain'>": {
      syntax: "none | strict | content | [ size || layout || style || paint ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/contain",
    },
    "<'content'>": {
      syntax:
        "normal | none | [ <content-replacement> | <content-list> ] [/ <string> ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/content",
    },
    "<'counter()'>": {
      syntax: "counter( <custom-ident>, <counter-style>? )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/counter()",
    },
    "<'counter-increment'>": {
      syntax: "[ <custom-ident> <integer>? ]+ | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/counter-increment",
    },
    "<'counter-reset'>": {
      syntax: "[ <custom-ident> <integer>? ]+ | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/counter-reset",
    },
    "<'counter-set'>": {
      syntax: "[ <custom-ident> <integer>? ]+ | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/counter-set",
    },
    "<'@counter-style'>": {
      syntax: "@counter-style <counter-style-name> {",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style",
    },
    "<'counters()'>": {
      syntax: "counters( <custom-ident>, <string>, <counter-style>? )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/counters()",
    },
    "<'cross-fade()'>": {
      syntax: "cross-fade( <cf-mixing-image> , <cf-final-image>? )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/cross-fade()",
    },
    "<'cursor'>": {
      syntax:
        "[ [ <url> [ <x> <y> ]? , ]* [ auto | default | none | context-menu | help | pointer | progress | wait | cell | crosshair | text | vertical-text | alias | copy | move | no-drop | not-allowed | e-resize | n-resize | ne-resize | nw-resize | s-resize | se-resize | sw-resize | w-resize | ew-resize | ns-resize | nesw-resize | nwse-resize | col-resize | row-resize | all-scroll | zoom-in | zoom-out | grab | grabbing ] ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/cursor",
    },
    "<':dir'>": {
      syntax: ":dir( [ ltr | rtl ] )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/:dir",
    },
    "<'direction'>": {
      syntax: "ltr | rtl",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/direction",
    },
    "<'display'>": {
      syntax:
        "[ <display-outside> || <display-inside> ] | <display-listitem> | <display-internal> | <display-box> | <display-legacy>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/display",
    },
    "<'empty-cells'>": {
      syntax: "show | hide",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/empty-cells",
    },
    "<'env()'>": {
      syntax: "env( <custom-ident> , <declaration-value>? )",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/env()",
    },
    "<'filter'>": {
      syntax: "none | <filter-function-list>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/filter",
    },
    "<'flex'>": {
      syntax: "none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex",
      subProps: ["<'flex-grow'>", "<'flex-shrink'>", "<'flex-basis'>"],
    },
    "<'flex-basis'>": {
      syntax: "content | <'width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-basis",
    },
    "<'flex-direction'>": {
      syntax: "row | row-reverse | column | column-reverse",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction",
    },
    "<'flex-flow'>": {
      syntax: "<'flex-direction'> || <'flex-wrap'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-flow",
      subProps: ["<'flex-direction'>", "<'flex-wrap'>"],
    },
    "<'flex-grow'>": {
      syntax: "<number>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-grow",
    },
    "<'flex-shrink'>": {
      syntax: "<number>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-shrink",
    },
    "<'flex-wrap'>": {
      syntax: "nowrap | wrap | wrap-reverse",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap",
    },
    "<'float'>": {
      syntax: "left | right | none | inline-start | inline-end",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/float",
    },
    "<'font'>": {
      syntax:
        "[ [ <'font-style'> || <font-variant-css21> || <'font-weight'> || <'font-stretch'> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'> ] | caption | icon | menu | message-box | small-caption | status-bar",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font",
      subProps: [
        "<'font-family'>",
        "<'font-size'>",
        "<'font-stretch'>",
        "<'font-style'>",
        "<'font-variant'>",
        "<'font-weight'>",
        "<'line-height'>",
      ],
    },
    "<'font-family'>": {
      syntax: "[ <family-name> | <generic-family> ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-family",
    },
    "<'font-feature-settings'>": {
      syntax: "normal | <feature-tag-value>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings",
    },
    "<'@font-feature-values'>": {
      syntax: "@font-feature-values <family-name># {",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-feature-values",
    },
    "<'font-kerning'>": {
      syntax: "auto | normal | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-kerning",
    },
    "<'font-language-override'>": {
      syntax: "normal | <string>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-language-override",
    },
    "<'font-optical-sizing'>": {
      syntax: "auto | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing",
    },
    "<'font-size'>": {
      syntax: "<absolute-size> | <relative-size> | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size",
    },
    "<'font-size-adjust'>": {
      syntax:
        "none | [ ex-height | cap-height | ch-width | ic-width | ic-height ]? [ from-font | <number> ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-size-adjust",
    },
    "<'font-stretch'>": {
      syntax: "<font-stretch-absolute>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-stretch",
    },
    "<'font-style'>": {
      syntax: "normal | italic | oblique <angle>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-style",
    },
    "<'font-synthesis'>": {
      syntax: "none | [ weight || style ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-synthesis",
    },
    "<'font-variant'>": {
      syntax:
        "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant",
      subProps: [
        "<'font-variant-alternates'>",
        "<'font-variant-caps'>",
        "<'font-variant-east-asian'>",
        "<'font-variant-ligatures'>",
        "<'font-variant-numeric'>",
      ],
    },
    "<'font-variant-alternates'>": {
      syntax:
        "normal | [ stylistic( <feature-value-name> ) || historical-forms || styleset( <feature-value-name># ) || character-variant( <feature-value-name># ) || swash( <feature-value-name> ) || ornaments( <feature-value-name> ) || annotation( <feature-value-name> ) ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-alternates",
    },
    "<'font-variant-caps'>": {
      syntax:
        "normal | small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-caps",
    },
    "<'font-variant-east-asian'>": {
      syntax:
        "normal | [ <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-east-asian",
    },
    "<'font-variant-ligatures'>": {
      syntax:
        "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-ligatures",
    },
    "<'font-variant-numeric'>": {
      syntax:
        "normal | [ <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric",
    },
    "<'font-variant-position'>": {
      syntax: "normal | sub | super",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-position",
    },
    "<'font-variation-settings'>": {
      syntax: "normal | [ <string> <number> ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-variation-settings",
    },
    "<'font-weight'>": {
      syntax: "<font-weight-absolute> | bolder | lighter",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight",
    },
    "<'forced-color-adjust'>": {
      syntax: "auto | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/forced-color-adjust",
    },
    "<'gap'>": {
      syntax: "<'row-gap'> <'column-gap'>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/gap",
    },
    "<'grid'>": {
      syntax:
        "<'grid-template'> | <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? | [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid",
      subProps: [
        "<'grid-auto-columns'>",
        "<'grid-auto-flow'>",
        "<'grid-auto-rows'>",
        "<'grid-template-areas'>",
        "<'grid-template-columns'>",
        "<'grid-template-rows'>",
      ],
    },
    "<'grid-area'>": {
      syntax: "<grid-line> [ / <grid-line> ]{0,3}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area",
      subProps: [
        "<'grid-row-start'>",
        "<'grid-column-start'>",
        "<'grid-row-end'>",
        "<'grid-column-end'>",
      ],
    },
    "<'grid-auto-columns'>": {
      syntax: "<track-size>+",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns",
    },
    "<'grid-auto-flow'>": {
      syntax: "[ row | column ] || dense",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow",
    },
    "<'grid-auto-rows'>": {
      syntax: "<track-size>+",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows",
    },
    "<'grid-column'>": {
      syntax: "<grid-line> [ / <grid-line> ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column",
      subProps: ["<'grid-column-end'>", "<'grid-column-start'>"],
    },
    "<'grid-column-end'>": {
      syntax: "<grid-line>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end",
    },
    "<'grid-column-start'>": {
      syntax: "<grid-line>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start",
    },
    "<'grid-row'>": {
      syntax: "<grid-line> [ / <grid-line> ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row",
      subProps: ["<'grid-row-end'>", "<'grid-row-start'>"],
    },
    "<'grid-row-end'>": {
      syntax: "<grid-line>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end",
    },
    "<'grid-row-start'>": {
      syntax: "<grid-line>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start",
    },
    "<'grid-template'>": {
      syntax:
        "none | [ <'grid-template-rows'> / <'grid-template-columns'> ] | [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template",
      subProps: [
        "<'grid-template-areas'>",
        "<'grid-template-columns'>",
        "<'grid-template-rows'>",
      ],
    },
    "<'grid-template-areas'>": {
      syntax: "none | <string>+",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas",
    },
    "<'grid-template-columns'>": {
      syntax:
        "none | <track-list> | <auto-track-list> | subgrid <line-name-list>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns",
    },
    "<'grid-template-rows'>": {
      syntax:
        "none | <track-list> | <auto-track-list> | subgrid <line-name-list>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-rows",
    },
    "<'hanging-punctuation'>": {
      syntax: "none | [ first || [ force-end | allow-end ] || last ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation",
    },
    "<'height'>": {
      syntax:
        "auto | <length> | <percentage> | min-content | max-content | fit-content | fit-content(<length-percentage>)",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/height",
    },
    "<'hyphens'>": {
      syntax: "none | manual | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens",
    },
    "<'image-orientation'>": {
      syntax: "from-image | <angle> | [ <angle>? flip ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/image-orientation",
    },
    "<'image-rendering'>": {
      syntax: "auto | crisp-edges | pixelated",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering",
    },
    "<'image-resolution'>": {
      syntax: "[ from-image || <resolution> ] && snap?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/image-resolution",
    },
    "<'initial-letter'>": {
      syntax: "normal | [ <number> <integer>? ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/initial-letter",
    },
    "<'initial-letter-align'>": {
      syntax: "[ auto | alphabetic | hanging | ideographic ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/initial-letter-align",
    },
    "<'inline-size'>": {
      syntax: "<'width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inline-size",
    },
    "<'inset'>": {
      syntax: "<'top'>{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset",
    },
    "<'inset-block'>": {
      syntax: "<'top'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block",
      subProps: ["<'inset-block-end'>", "<'inset-block-start'>"],
    },
    "<'inset-block-end'>": {
      syntax: "<'top'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-end",
    },
    "<'inset-block-start'>": {
      syntax: "<'top'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset-block-start",
    },
    "<'inset-inline'>": {
      syntax: "<'top'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline",
      subProps: ["<'inset-inline-end'>", "<'inset-inline-start'>"],
    },
    "<'inset-inline-end'>": {
      syntax: "<'top'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-end",
    },
    "<'inset-inline-start'>": {
      syntax: "<'top'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/inset-inline-start",
    },
    "<'isolation'>": {
      syntax: "auto | isolate",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/isolation",
    },
    "<'justify-content'>": {
      syntax:
        "normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-content",
    },
    "<'justify-items'>": {
      syntax:
        "normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ] | legacy | legacy && [ left | right | center ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-items",
    },
    "<'justify-self'>": {
      syntax:
        "auto | normal | stretch | <baseline-position> | <overflow-position>? [ <self-position> | left | right ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-self",
    },
    "<'justify-tracks'>": {
      syntax:
        "[ normal | <content-distribution> | <overflow-position>? [ <content-position> | left | right ] ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/justify-tracks",
    },
    "<'left'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/left",
    },
    "<'letter-spacing'>": {
      syntax: "normal | <length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/letter-spacing",
    },
    "<'line-break'>": {
      syntax: "auto | loose | normal | strict | anywhere",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-break",
    },
    "<'line-height'>": {
      syntax: "normal | <number> | <length> | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height",
    },
    "<'line-height-step'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/line-height-step",
    },
    "<'list-style'>": {
      syntax:
        "<'list-style-type'> || <'list-style-position'> || <'list-style-image'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/list-style",
      subProps: [
        "<'list-style-image'>",
        "<'list-style-position'>",
        "<'list-style-type'>",
      ],
    },
    "<'list-style-image'>": {
      syntax: "<image> | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-image",
    },
    "<'list-style-position'>": {
      syntax: "inside | outside",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-position",
    },
    "<'list-style-type'>": {
      syntax: "<counter-style> | <string> | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/list-style-type",
    },
    "<'margin'>": {
      syntax: "[ <length> | <percentage> | auto ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin",
      subProps: [
        "<'margin-bottom'>",
        "<'margin-left'>",
        "<'margin-right'>",
        "<'margin-top'>",
      ],
    },
    "<'margin-block'>": {
      syntax: "<'margin-left'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block",
      subProps: ["<'margin-block-end'>", "<'margin-block-start'>"],
    },
    "<'margin-block-end'>": {
      syntax: "<'margin-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-end",
    },
    "<'margin-block-start'>": {
      syntax: "<'margin-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-block-start",
    },
    "<'margin-bottom'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-bottom",
    },
    "<'margin-inline'>": {
      syntax: "<'margin-left'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline",
      subProps: ["<'margin-inline-start'>", "<'margin-inline-end'>"],
    },
    "<'margin-inline-end'>": {
      syntax: "<'margin-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-end",
    },
    "<'margin-inline-start'>": {
      syntax: "<'margin-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline-start",
    },
    "<'margin-left'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-left",
    },
    "<'margin-right'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-right",
    },
    "<'margin-top'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-top",
    },
    "<'margin-trim'>": {
      syntax: "none | in-flow | all",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/margin-trim",
    },
    "<'mask'>": {
      syntax: "<mask-layer>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask",
      subProps: [
        "<'mask-clip'>",
        "<'mask-composite'>",
        "<'mask-image'>",
        "<'mask-mode'>",
        "<'mask-origin'>",
        "<'mask-position'>",
        "<'mask-repeat'>",
        "<'mask-size'>",
      ],
    },
    "<'mask-border'>": {
      syntax:
        "<'mask-border-source'> || <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? || <'mask-border-repeat'> || <'mask-border-mode'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border",
      subProps: [
        "<'mask-border-mode'>",
        "<'mask-border-outset'>",
        "<'mask-border-repeat'>",
        "<'mask-border-slice'>",
        "<'mask-border-source'>",
        "<'mask-border-width'>",
      ],
    },
    "<'mask-border-mode'>": {
      syntax: "luminance | alpha",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border-mode",
    },
    "<'mask-border-outset'>": {
      syntax: "[ <length> | <number> ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border-outset",
    },
    "<'mask-border-repeat'>": {
      syntax: "[ stretch | repeat | round | space ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border-repeat",
    },
    "<'mask-border-slice'>": {
      syntax: "<number-percentage>{1,4} fill?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border-slice",
    },
    "<'mask-border-source'>": {
      syntax: "none | <image>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border-source",
    },
    "<'mask-border-width'>": {
      syntax: "[ <length-percentage> | <number> | auto ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-border-width",
    },
    "<'mask-clip'>": {
      syntax: "[ <geometry-box> | no-clip ]#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-clip",
    },
    "<'mask-composite'>": {
      syntax: "<compositing-operator>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-composite",
    },
    "<'mask-image'>": {
      syntax: "<mask-reference>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image",
    },
    "<'mask-mode'>": {
      syntax: "<masking-mode>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-mode",
    },
    "<'mask-origin'>": {
      syntax: "<geometry-box>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-origin",
    },
    "<'mask-position'>": {
      syntax: "<position>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-position",
    },
    "<'mask-repeat'>": {
      syntax: "<repeat-style>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-repeat",
    },
    "<'mask-size'>": {
      syntax: "<bg-size>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-size",
    },
    "<'mask-type'>": {
      syntax: "luminance | alpha",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mask-type",
    },
    "<'masonry-auto-flow'>": {
      syntax: "[ pack | next ] || [ definite-first | ordered ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/masonry-auto-flow",
    },
    "<'math-style'>": {
      syntax: "normal | compact",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/math-style",
    },
    "<'max-block-size'>": {
      syntax: "<'max-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-block-size",
    },
    "<'max-height'>": {
      syntax:
        "none | <length-percentage> | min-content | max-content | fit-content | fit-content(<length-percentage>)",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-height",
    },
    "<'max-inline-size'>": {
      syntax: "<'max-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-inline-size",
    },
    "<'max-width'>": {
      syntax:
        "none | <length-percentage> | min-content | max-content | fit-content | fit-content(<length-percentage>)",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/max-width",
    },
    "<'min-block-size'>": {
      syntax: "<'min-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-block-size",
    },
    "<'min-height'>": {
      syntax:
        "auto | <length> | <percentage> | min-content | max-content | fit-content | fit-content(<length-percentage>)",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-height",
    },
    "<'min-inline-size'>": {
      syntax: "<'min-width'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-inline-size",
    },
    "<'min-width'>": {
      syntax:
        "auto | <length> | <percentage> | min-content | max-content | fit-content | fit-content(<length-percentage>)",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/min-width",
    },
    "<'mix-blend-mode'>": {
      syntax: "<blend-mode>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/mix-blend-mode",
    },
    "<'object-fit'>": {
      syntax: "fill | contain | cover | none | scale-down",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit",
    },
    "<'object-position'>": {
      syntax: "<position>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/object-position",
    },
    "<'offset'>": {
      syntax:
        "[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/offset",
      subProps: [
        "<'offset-anchor'>",
        "<'offset-distance'>",
        "<'offset-path'>",
        "<'offset-position'>",
        "<'offset-rotate'>",
      ],
    },
    "<'offset-anchor'>": {
      syntax: "auto | <position>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/offset-anchor",
    },
    "<'offset-distance'>": {
      syntax: "<length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/offset-distance",
    },
    "<'offset-path'>": {
      syntax:
        "none | ray( [ <angle> && <size> && contain? ] ) | <path()> | <url> | [ <basic-shape> || <geometry-box> ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path",
    },
    "<'offset-position'>": {
      syntax: "auto | <position>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/offset-position",
    },
    "<'offset-rotate'>": {
      syntax: "[ auto | reverse ] || <angle>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/offset-rotate",
    },
    "<'opacity'>": {
      syntax: "<alpha-value>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/opacity",
    },
    "<'order'>": {
      syntax: "<integer>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/order",
    },
    "<'orphans'>": {
      syntax: "<integer>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/orphans",
    },
    "<'outline'>": {
      syntax: "[ <'outline-color'> || <'outline-style'> || <'outline-width'> ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline",
      subProps: ["<'outline-color'>", "<'outline-style'>", "<'outline-width'>"],
    },
    "<'outline-color'>": {
      syntax: "<color> | invert",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline-color",
    },
    "<'outline-offset'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline-offset",
    },
    "<'outline-style'>": {
      syntax: "auto | <'border-style'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline-style",
    },
    "<'outline-width'>": {
      syntax: "<line-width>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/outline-width",
    },
    "<'overflow'>": {
      syntax: "[ visible | hidden | clip | scroll | auto ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow",
      subProps: ["<'overflow-x'>", "<'overflow-y'>"],
    },
    "<'overflow-anchor'>": {
      syntax: "auto | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor",
    },
    "<'overflow-block'>": {
      syntax: "visible | hidden | clip | scroll | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-block",
    },
    "<'overflow-clip-margin'>": {
      syntax: "<visual-box> || [0,∞]>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-clip-margin",
    },
    "<'overflow-inline'>": {
      syntax: "visible | hidden | clip | scroll | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-inline",
    },
    "<'overflow-wrap'>": {
      syntax: "normal | break-word | anywhere",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap",
    },
    "<'overflow-x'>": {
      syntax: "visible | hidden | clip | scroll | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x",
    },
    "<'overflow-y'>": {
      syntax: "visible | hidden | clip | scroll | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-y",
    },
    "<'overscroll-behavior'>": {
      syntax: "[ contain | none | auto ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior",
    },
    "<'overscroll-behavior-block'>": {
      syntax: "contain | none | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior-block",
    },
    "<'overscroll-behavior-inline'>": {
      syntax: "contain | none | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior-inline",
    },
    "<'overscroll-behavior-x'>": {
      syntax: "contain | none | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior-x",
    },
    "<'overscroll-behavior-y'>": {
      syntax: "contain | none | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior-y",
    },
    "<'padding'>": {
      syntax: "[ <length> | <percentage> ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding",
      subProps: [
        "<'padding-bottom'>",
        "<'padding-left'>",
        "<'padding-right'>",
        "<'padding-top'>",
      ],
    },
    "<'padding-block'>": {
      syntax: "<'padding-left'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block",
      subProps: ["<'padding-block-end'>", "<'padding-block-start'>"],
    },
    "<'padding-block-end'>": {
      syntax: "<'padding-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-end",
    },
    "<'padding-block-start'>": {
      syntax: "<'padding-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-block-start",
    },
    "<'padding-bottom'>": {
      syntax: "<length> | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-bottom",
    },
    "<'padding-inline'>": {
      syntax: "<'padding-left'>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline",
      subProps: ["<'padding-inline-end'>", "<'padding-inline-start'>"],
    },
    "<'padding-inline-end'>": {
      syntax: "<'padding-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-end",
    },
    "<'padding-inline-start'>": {
      syntax: "<'padding-left'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-inline-start",
    },
    "<'padding-left'>": {
      syntax: "<length> | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-left",
    },
    "<'padding-right'>": {
      syntax: "<length> | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-right",
    },
    "<'padding-top'>": {
      syntax: "<length> | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/padding-top",
    },
    "<'page-break-after'>": {
      syntax: "auto | always | avoid | left | right | recto | verso",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-after",
    },
    "<'page-break-before'>": {
      syntax: "auto | always | avoid | left | right | recto | verso",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-before",
    },
    "<'page-break-inside'>": {
      syntax: "auto | avoid",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/page-break-inside",
    },
    "<'paint-order'>": {
      syntax: "normal | [ fill || stroke || markers ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/paint-order",
    },
    "<'perspective'>": {
      syntax: "none | <length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/perspective",
    },
    "<'perspective-origin'>": {
      syntax: "<position>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/perspective-origin",
    },
    "<'place-content'>": {
      syntax: "<'align-content'> <'justify-content'>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/place-content",
      subProps: ["<'align-content'>", "<'justify-content'>"],
    },
    "<'place-items'>": {
      syntax: "<'align-items'> <'justify-items'>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/place-items",
      subProps: ["<'align-items'>", "<'justify-items'>"],
    },
    "<'place-self'>": {
      syntax: "<'align-self'> <'justify-self'>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/place-self",
      subProps: ["<'align-self'>", "<'justify-self'>"],
    },
    "<'pointer-events'>": {
      syntax:
        "auto | none | visiblePainted | visibleFill | visibleStroke | visible | painted | fill | stroke | all | inherit",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events",
    },
    "<'position'>": {
      syntax: "static | relative | absolute | sticky | fixed",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/position",
    },
    "<'quotes'>": {
      syntax: "none | auto | [ <string> <string> ]+",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/quotes",
    },
    "<'resize'>": {
      syntax: "none | both | horizontal | vertical | block | inline",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/resize",
    },
    "<'right'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/right",
    },
    "<'rotate'>": {
      syntax: "none | <angle> | [ x | y | z | <number>{3} ] && <angle>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/rotate",
    },
    "<'row-gap'>": {
      syntax: "normal | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap",
    },
    "<'ruby-align'>": {
      syntax: "start | center | space-between | space-around",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/ruby-align",
    },
    "<'ruby-position'>": {
      syntax: "[ alternate || [ over | under ] ] | inter-character",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/ruby-position",
    },
    "<'scale'>": {
      syntax: "none | <number>{1,3}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scale",
    },
    "<'scroll-behavior'>": {
      syntax: "auto | smooth",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior",
    },
    "<'scroll-margin'>": {
      syntax: "<length>{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin",
      subProps: [
        "<'scroll-margin-bottom'>",
        "<'scroll-margin-left'>",
        "<'scroll-margin-right'>",
        "<'scroll-margin-top'>",
      ],
    },
    "<'scroll-margin-block'>": {
      syntax: "<length>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-block",
      subProps: [
        "<'scroll-margin-block-end'>",
        "<'scroll-margin-block-start'>",
      ],
    },
    "<'scroll-margin-block-end'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-block-end",
    },
    "<'scroll-margin-block-start'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-block-start",
    },
    "<'scroll-margin-bottom'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-bottom",
    },
    "<'scroll-margin-inline'>": {
      syntax: "<length>{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-inline",
      subProps: [
        "<'scroll-margin-inline-end'>",
        "<'scroll-margin-inline-start'>",
      ],
    },
    "<'scroll-margin-inline-end'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-inline-end",
    },
    "<'scroll-margin-inline-start'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-inline-start",
    },
    "<'scroll-margin-left'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-left",
    },
    "<'scroll-margin-right'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-right",
    },
    "<'scroll-margin-top'>": {
      syntax: "<length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-margin-top",
    },
    "<'scroll-padding'>": {
      syntax: "[ auto | <length-percentage> ]{1,4}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding",
      subProps: [
        "<'scroll-padding-bottom'>",
        "<'scroll-padding-left'>",
        "<'scroll-padding-right'>",
        "<'scroll-padding-top'>",
      ],
    },
    "<'scroll-padding-block'>": {
      syntax: "[ auto | <length-percentage> ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-block",
      subProps: [
        "<'scroll-padding-block-end'>",
        "<'scroll-padding-block-start'>",
      ],
    },
    "<'scroll-padding-block-end'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-block-end",
    },
    "<'scroll-padding-block-start'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-block-start",
    },
    "<'scroll-padding-bottom'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-bottom",
    },
    "<'scroll-padding-inline'>": {
      syntax: "[ auto | <length-percentage> ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-inline",
      subProps: [
        "<'scroll-padding-inline-end'>",
        "<'scroll-padding-inline-start'>",
      ],
    },
    "<'scroll-padding-inline-end'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-inline-end",
    },
    "<'scroll-padding-inline-start'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-inline-start",
    },
    "<'scroll-padding-left'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-left",
    },
    "<'scroll-padding-right'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-right",
    },
    "<'scroll-padding-top'>": {
      syntax: "auto | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-padding-top",
    },
    "<'scroll-snap-align'>": {
      syntax: "[ none | start | end | center ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-align",
    },
    "<'scroll-snap-stop'>": {
      syntax: "normal | always",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-stop",
    },
    "<'scroll-snap-type'>": {
      syntax:
        "none | [ x | y | block | inline | both ] [ mandatory | proximity ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type",
    },
    "<'scrollbar-color'>": {
      syntax: "auto | <color>{2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color",
    },
    "<'scrollbar-gutter'>": {
      syntax: "auto | stable && both-edges?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter",
    },
    "<'scrollbar-width'>": {
      syntax: "auto | thin | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-width",
    },
    "<'shape-image-threshold'>": {
      syntax: "<alpha-value>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/shape-image-threshold",
    },
    "<'shape-margin'>": {
      syntax: "<length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/shape-margin",
    },
    "<'shape-outside'>": {
      syntax: "none | [ <shape-box> || <basic-shape> ] | <image>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/shape-outside",
    },
    "<'tab-size'>": {
      syntax: "<integer> | <length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/tab-size",
    },
    "<'table-layout'>": {
      syntax: "auto | fixed",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout",
    },
    "<'text-align'>": {
      syntax: "start | end | left | right | center | justify | match-parent",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-align",
    },
    "<'text-align-last'>": {
      syntax: "auto | start | end | left | right | center | justify",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-align-last",
    },
    "<'text-combine-upright'>": {
      syntax: "none | all | [ digits <integer>? ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-combine-upright",
    },
    "<'text-decoration'>": {
      syntax:
        "<'text-decoration-line'> || <'text-decoration-style'> || <'text-decoration-color'> || <'text-decoration-thickness'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration",
      subProps: [
        "<'text-decoration-color'>",
        "<'text-decoration-line'>",
        "<'text-decoration-style'>",
        "<'text-decoration-thickness'>",
      ],
    },
    "<'text-decoration-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-color",
    },
    "<'text-decoration-line'>": {
      syntax:
        "none | [ underline || overline || line-through || blink ] | spelling-error | grammar-error",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-line",
    },
    "<'text-decoration-skip'>": {
      syntax:
        "none | [ objects || [ spaces | [ leading-spaces || trailing-spaces ] ] || edges || box-decoration ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-skip",
    },
    "<'text-decoration-skip-ink'>": {
      syntax: "auto | all | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-skip-ink",
    },
    "<'text-decoration-style'>": {
      syntax: "solid | double | dotted | dashed | wavy",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-style",
    },
    "<'text-decoration-thickness'>": {
      syntax: "auto | from-font | <length> | <percentage> ",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration-thickness",
    },
    "<'text-emphasis'>": {
      syntax: "<'text-emphasis-style'> || <'text-emphasis-color'>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis",
      subProps: ["<'text-emphasis-color'>", "<'text-emphasis-style'>"],
    },
    "<'text-emphasis-color'>": {
      syntax: "<color>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis-color",
    },
    "<'text-emphasis-position'>": {
      syntax: "[ over | under ] && [ right | left ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis-position",
    },
    "<'text-emphasis-style'>": {
      syntax:
        "none | [ [ filled | open ] || [ dot | circle | double-circle | triangle | sesame ] ] | <string>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-emphasis-style",
    },
    "<'text-indent'>": {
      syntax: "<length-percentage> && hanging? && each-line?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-indent",
    },
    "<'text-justify'>": {
      syntax: "auto | inter-character | inter-word | none",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-justify",
    },
    "<'text-orientation'>": {
      syntax: "mixed | upright | sideways",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-orientation",
    },
    "<'text-overflow'>": {
      syntax: "[ clip | ellipsis | <string> ]{1,2}",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow",
    },
    "<'text-rendering'>": {
      syntax: "auto | optimizeSpeed | optimizeLegibility | geometricPrecision",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-rendering",
    },
    "<'text-shadow'>": {
      syntax: "none | <shadow-t>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-shadow",
    },
    "<'text-size-adjust'>": {
      syntax: "none | auto | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-size-adjust",
    },
    "<'text-transform'>": {
      syntax:
        "none | capitalize | uppercase | lowercase | full-width | full-size-kana",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform",
    },
    "<'text-underline-offset'>": {
      syntax: "auto | <length> | <percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-offset",
    },
    "<'text-underline-position'>": {
      syntax: "auto | from-font | [ under || [ left | right ] ]",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/text-underline-position",
    },
    "<'top'>": {
      syntax: "<length> | <percentage> | auto",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/top",
    },
    "<'touch-action'>": {
      syntax:
        "auto | none | [ [ pan-x | pan-left | pan-right ] || [ pan-y | pan-up | pan-down ] || pinch-zoom ] | manipulation",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",
    },
    "<'transform'>": {
      syntax: "none | <transform-list>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform",
    },
    "<'transform-box'>": {
      syntax: "content-box | border-box | fill-box | stroke-box | view-box",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-box",
    },
    "<'transform-origin'>": {
      syntax:
        "[ <length-percentage> | left | center | right | top | bottom ] | [ [ <length-percentage> | left | center | right ] && [ <length-percentage> | top | center | bottom ] ] <length>?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-origin",
    },
    "<'transform-style'>": {
      syntax: "flat | preserve-3d",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transform-style",
    },
    "<'transition'>": {
      syntax: "<single-transition>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition",
      subProps: [
        "<'transition-delay'>",
        "<'transition-duration'>",
        "<'transition-property'>",
        "<'transition-timing-function'>",
      ],
    },
    "<'transition-delay'>": {
      syntax: "<time>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-delay",
    },
    "<'transition-duration'>": {
      syntax: "<time>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-duration",
    },
    "<'transition-property'>": {
      syntax: "none | <single-transition-property>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-property",
    },
    "<'transition-timing-function'>": {
      syntax: "<easing-function>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/transition-timing-function",
    },
    "<'translate'>": {
      syntax: "none | <length-percentage> [ <length-percentage> <length>? ]?",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/translate",
    },
    "<'unicode-bidi'>": {
      syntax:
        "normal | embed | isolate | bidi-override | isolate-override | plaintext",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/unicode-bidi",
    },
    "<'user-select'>": {
      syntax: "auto | text | none | contain | all",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/user-select",
    },
    "<'vertical-align'>": {
      syntax:
        "baseline | sub | super | text-top | text-bottom | middle | top | bottom | <percentage> | <length>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/vertical-align",
    },
    "<'visibility'>": {
      syntax: "visible | hidden | collapse",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/visibility",
    },
    "<'white-space'>": {
      syntax: "normal | pre | nowrap | pre-wrap | pre-line | break-spaces",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/white-space",
    },
    "<'widows'>": {
      syntax: "<integer>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/widows",
    },
    "<'width'>": {
      syntax:
        "auto | <length> | <percentage> | min-content | max-content | fit-content | fit-content(<length-percentage>)",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/width",
    },
    "<'will-change'>": {
      syntax: "auto | <animateable-feature>#",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/will-change",
    },
    "<'word-break'>": {
      syntax: "normal | break-all | keep-all | break-word",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/word-break",
    },
    "<'word-spacing'>": {
      syntax: "normal | <length-percentage>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/word-spacing",
    },
    "<'writing-mode'>": {
      syntax:
        "horizontal-tb | vertical-rl | vertical-lr | sideways-rl | sideways-lr",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/writing-mode",
    },
    "<'z-index'>": {
      syntax: "auto | <integer>",
      mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/z-index",
    },
  },
  atRules: {
    "@counter-style": {
      "<'additive-symbols'>": {
        syntax: "[ <integer> && <symbol> ]#",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/additive-symbols",
      },
      "<'fallback'>": {
        syntax: "<counter-style-name>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/fallback",
      },
      "<'negative'>": {
        syntax: "<symbol> <symbol>?",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/negative",
      },
      "<'pad'>": {
        syntax: "<integer> && <symbol>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/pad",
      },
      "<'prefix'>": {
        syntax: "<symbol>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/prefix",
      },
      "<'range'>": {
        syntax: "[ [ <integer> | infinite ]{2} ]# | auto",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/range",
      },
      "<'speak-as'>": {
        syntax:
          "auto | bullets | numbers | words | spell-out | <counter-style-name>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/speak-as",
      },
      "<'suffix'>": {
        syntax: "<symbol>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/suffix",
      },
      "<'symbols'>": {
        syntax: "<symbol>+",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/symbols",
      },
      "<'system'>": {
        syntax:
          "cyclic | numeric | alphabetic | symbolic | additive | [ fixed <integer>? ] | [ extends <counter-style-name> ]",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@counter-style/system",
      },
    },
    "@font-face": {
      "<'ascent-override'>": {
        syntax: "normal | <percentage>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override",
      },
      "<'descent-override'>": {
        syntax: "normal | <percentage>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/descent-override",
      },
      "<'font-display'>": {
        syntax: "[ auto | block | swap | fallback | optional ]",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display",
      },
      "<'font-family'>": {
        syntax: "<family-name>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-family",
      },
      "<'font-stretch'>": {
        syntax: "<font-stretch-absolute>{1,2}",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-stretch",
      },
      "<'font-style'>": {
        syntax: "normal | italic | oblique <angle>{0,2}",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-style",
      },
      "<'font-variant'>": {
        syntax:
          "normal | none | [ <common-lig-values> || <discretionary-lig-values> || <historical-lig-values> || <contextual-alt-values> || stylistic(<feature-value-name>) || historical-forms || styleset(<feature-value-name>#) || character-variant(<feature-value-name>#) || swash(<feature-value-name>) || ornaments(<feature-value-name>) || annotation(<feature-value-name>) || [ small-caps | all-small-caps | petite-caps | all-petite-caps | unicase | titling-caps ] || <numeric-figure-values> || <numeric-spacing-values> || <numeric-fraction-values> || ordinal || slashed-zero || <east-asian-variant-values> || <east-asian-width-values> || ruby ]",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variant",
        subProps: [
          "<'font-variant-alternates'>",
          "<'font-variant-caps'>",
          "<'font-variant-east-asian'>",
          "<'font-variant-ligatures'>",
          "<'font-variant-numeric'>",
        ],
      },
      "<'font-variation-settings'>": {
        syntax: "normal | [ <string> <number> ]#",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-variation-settings",
      },
      "<'font-weight'>": {
        syntax: "<font-weight-absolute>{1,2}",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-weight",
      },
      "<'line-gap-override'>": {
        syntax: "normal | <percentage>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/line-gap-override",
      },
      "<'size-adjust'>": {
        syntax: "<percentage>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust",
      },
      "<'src'>": {
        syntax: "[ <url> [ format( <string># ) ]? | local( <family-name> ) ]#",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src",
      },
      "<'unicode-range'>": {
        syntax: "<unicode-range>#",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range",
      },
    },
    "@property": {
      "<'inherits'>": {
        syntax: "true | false",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@property/inherits",
      },
      "<'initial-value'>": {
        syntax: "<string>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@property/initial-value",
      },
      "<'syntax'>": {
        syntax: "<string>",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@property/syntax",
      },
    },
    "@page": {
      "<'size'>": {
        syntax:
          "<length>{1,2} | auto | [ <page-size> || [ portrait | landscape ] ]",
        mdn: "https://developer.mozilla.org/en-US/docs/Web/CSS/@page/size",
      },
    },
  },
};
