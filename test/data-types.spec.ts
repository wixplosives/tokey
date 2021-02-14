import { expect } from 'chai';
import { describe, it } from 'mocha';

import { createCssValueAST } from '../src/parsers/css-value-tokenizer';
import {
  DataTypeType,
  DataTypePredicate,
  DataType,
  lineStyleDataType,
  lineWidthDataType,
  outlineStyleDataType,
  outlineColorDataType,
  colorDataType,
  bgImageDataType,
  bgPositionDataType,
  bgSizeDataType,
  repeatStyleDataType,
  attachmentDataType,
  boxDataType,
  fontStyleDataType,
  fontVariantDataType,
  lengthDataType,
  numberPredicate,
  percentagePredicate,
  lengthPercentageDataType,
  anglePredicate,
  widthDataType,
  fontWeightDataType,
  fontStretchDataType,
  fontSizeDataType,
  lineHeightDataType,
  fontFamilyDataType,
  fontDataType,
  flexGrowDataType,
  flexShrinkDataType,
  flexBasisDataType,
  flexDataType,
  overflowDataType,
  universalDataType,
} from '../src/css-data-types';

type PredicateMatcher = (value: string) => number | boolean;
const matchPredicate = (predicate: DataTypePredicate, prev?: DataTypeType): PredicateMatcher =>
  (value: string) => {
    const valueAst = createCssValueAST(value);
    return predicate(valueAst[0], 0, valueAst.map(value => ({ value })), prev);
  };
const matchDataType = (dataType: DataType, prev?: DataTypeType) =>
  matchPredicate(dataType.predicate, prev);

interface PredicateValidity {
  values: string[],
  expectValue?: number | boolean;
}
interface PredicateValidityData {
  nonValid: PredicateValidity;
  valid: PredicateValidity;
}
const DataTypeSuite = (
  title: string,
  dataType: DataTypeType,
  predicateMatcher: PredicateMatcher,
  validityData: PredicateValidityData,
) => {
  describe(title, () => {
    it(`should not match non ${title}`, () => {
      const { expectValue: nonValidExpectValue = false } = validityData.nonValid;
      validityData.nonValid.values.forEach(nonValidValue => {
        expect(
          predicateMatcher(nonValidValue),
          `${dataType} Expected no match on non ${title}: "${nonValidValue}"`,
        ).to.equal(nonValidExpectValue);
      });
    });

    it(`should match ${title}`, () => {
      const { expectValue: validExpectValue = true } = validityData.valid;
      validityData.valid.values.forEach(validValue => {
        expect(
          predicateMatcher(validValue),
          `${dataType} Expected match on ${title}: "${validValue}"`,
        ).to.equal(validExpectValue);
      });
    });
  });
}

describe('Data Type Predicates', () => {
  describe('<\'border\'>', () => {
    describe(`${DataTypeType.LineStyle}`, () => {
      // syntax: none | hidden | dotted | dashed | solid | double | groove | ridge | inset | outset

      DataTypeSuite(
        `${DataTypeType.LineStyle} keyword`,
        DataTypeType.LineStyle,
        matchDataType(lineStyleDataType),
        {
          nonValid: { values: ['red']    },
          valid:    { values: ['dotted'] },
        },
      );
    });

    describe(`${DataTypeType.LineWidth}`, () => {
      // syntax: <length> | thin | medium | thick
      const matchLineWidth = matchDataType(lineWidthDataType);
      
      DataTypeSuite(
        `${DataTypeType.LineWidth} ${DataTypeType.Length}`,
        DataTypeType.LineWidth,
        matchLineWidth,
        {
          nonValid: { values: ['10']   },
          valid:    { values: ['10px'] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.LineWidth} keyword`,
        DataTypeType.LineWidth,
        matchLineWidth,
        {
          nonValid: { values: ['dotted'] },
          valid:    { values: ['medium'] },
        },
      );
    });
  });

  describe('<\'outline\'>', () => {
    describe(`${DataTypeType.OutlineStyle}`, () => {
      // syntax: auto | <'border-style'>
      const matchOutlineStyle = matchDataType(outlineStyleDataType);

      DataTypeSuite(
        `${DataTypeType.OutlineStyle} keyword`,
        DataTypeType.OutlineStyle,
        matchOutlineStyle,
        {
          nonValid: { values: ['invert'] },
          valid:    { values: ['auto']   },
        },
      );

      DataTypeSuite(
        `${DataTypeType.OutlineStyle} ${DataTypeType.LineStyle}`,
        DataTypeType.OutlineStyle,
        matchOutlineStyle,
        {
          nonValid: { values: ['red']    },
          valid:    { values: ['dotted'] },
        },
      );
    });

    describe(`${DataTypeType.OutlineColor}`, () => {
      // syntax: <color> | invert
      const matchOutlineColor = matchDataType(outlineColorDataType);

      DataTypeSuite(
        `${DataTypeType.OutlineColor} keyword`,
        DataTypeType.OutlineColor,
        matchOutlineColor,
        {
          nonValid: { values: ['auto']   },
          valid:    { values: ['invert'] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.OutlineColor} ${DataTypeType.Color}`,
        DataTypeType.OutlineColor,
        matchOutlineColor,
        {
          nonValid: { values: ['AABBCC'] },
          valid: {
            values: [
              'rgba(255, 114, 0, 1)',
              '#D4E5F9',
              'red',
            ],
          },
        },
      );
    });
  });

  describe('<\'background\'>', () => {
    describe(`${DataTypeType.BgImage}`, () => {
      // syntax: none | <image>
      const matchBgImage = matchDataType(bgImageDataType);

      DataTypeSuite(
        `${DataTypeType.BgImage} keyword`,
        DataTypeType.BgImage,
        matchBgImage,
        {
          nonValid: { values: ['center'] },
          valid:    { values: ['none']   },
        },
      );

      DataTypeSuite(
        `${DataTypeType.Image} function`,
        DataTypeType.BgImage,
        matchBgImage,
        {
          nonValid: { values: ['rgba(255, 114, 0, 1)'] },
          valid:    { values: ['url("myImage.png")']   },
        },
      );

      DataTypeSuite(
        `${DataTypeType.Gradient} function`,
        DataTypeType.BgImage,
        matchBgImage,
        {
          nonValid: { values: ['calc(10px + 2mm)']                                    },
          valid:    { values: ['repeating-radial-gradient(black, transparent 100px)'] },
        },
      );
    });

    describe(`${DataTypeType.BgPosition}`, () => {
      // syntax: [ [ left | center | right | top | bottom | <length-percentage> ] | [ left | center | right | <length-percentage> ] [ top | center | bottom | <length-percentage> ] | [ center | [ left | right ] <length-percentage>? ] && [ center | [ top | bottom ] <length-percentage>? ] ]
      const matchBgPosition = matchDataType(bgPositionDataType);

      DataTypeSuite(
        `${DataTypeType.BgPosition} 1-value syntax`,
        DataTypeType.BgPosition,
        matchBgPosition,
        {
          nonValid: { values: ['contain'] },
          valid: {
            values: [
              'center',
              'right',
              'bottom',
              '5mm',
              '25%',

              // Matching stops after invalid values
              'center cover',
              'right cover',
              'bottom contain',
              '25% contain',
            ],
            expectValue: 1,
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.BgPosition} 2-value syntax`,
        DataTypeType.BgPosition,
        matchBgPosition,
        {
          nonValid: {
            values: [
              '2px left',
              'left right',
              'top 10px',
              'bottom top',
            ],
            expectValue: 1,
          },
          valid: {
            values: [
              '33% 2em',
              '33% center',
              '33% top',
              'center 22rem',
              'center center',
              'center left',
              'center top',
              'left 1px',
              'right center',
              'left bottom',
              'right top',
              'top center',
              'top left',
              'bottom right',

              // Matching stops after 2 values
              '33% 2em top',
              '33% center bottom',
              '33% top left',
              'center 22rem top',
              'center center left',
              'right center top',
              'top center left',

              // Matching stops after invalid values
              'center left cover',
              'center top cover',
              'left 1px contain',
              'left bottom cover',
              'right top cover',
              'top left cover',
              'bottom right cover',
            ],
            expectValue: 2,
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.BgPosition} 3-value syntax`,
        DataTypeType.BgPosition,
        matchBgPosition,
        {
          nonValid: {
            values: [
              'center right bottom',
              'center top left',
              'center left center',
              'left 80rem right',
              'left 80rem 2em',
            ],
            expectValue: 2,
          },
          valid: {
            values: [
              'center left 20px',
              'center bottom 20px',
              'right 5pt center',
              'right 5pt top',
              'top 10px center',
              'top 10px left',

              // Matching stops after 3 values
              'center left 20px top',
              'center bottom 20px left',
              'right 5pt center top',
              'top 10px center left',

              // Matching stops after invalid values
              'right 5pt top contain',
              'top 10px left cover',
            ],
            expectValue: 3,
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.BgPosition} 4-value syntax`,
        DataTypeType.BgPosition,
        matchBgPosition,
        {
          nonValid: {
            values: [
              'left 10px bottom center',
              'left 10px bottom top',
              'left 10px bottom left',
              'top 10px right center',
              'top 10px right bottom',
              'top 10px right right',
            ],
            expectValue: 3,
          },
          valid: {
            values: [
              'left 10px bottom 6mm',
              'top 10px right 6mm',

              // Matching stops after 4 values
              'left 10px bottom 6mm top',
              'top 10px right 6mm bottom',
            ],
            expectValue: 4,
          },
        },
      );
    });

    describe(`${DataTypeType.BgSize}`, () => {
      // syntax: [ <length-percentage> | auto ]{1,2} | cover | contain
      const matchBgSize = matchDataType(bgSizeDataType, DataTypeType.BgPosition);

      DataTypeSuite(
        `${DataTypeType.BgSize} incorrect previous data-type`,
        DataTypeType.BgSize,
        matchDataType(bgSizeDataType),
        {
          nonValid: {
            values: [
              '/ 20%',
              '/ auto 50%',
            ],
          },
          valid: { values: [] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.BgSize} invalid value`,
        DataTypeType.BgSize,
        matchBgSize,
        {
          nonValid: {
            values: [
              // No preceding '/'
              'contain',
              'auto',
              '20%',

              // With '/' but invalid following value
              '/',
              '/ repeat',
              '/ 10',
            ],
          },
          valid: { values: [] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.BgSize} 1-value syntax`,
        DataTypeType.BgSize,
        matchBgSize,
        {
          nonValid: { values: [] },
          valid: {
            values: [
              '/ contain',
              '/ auto',
              '/ 20%',
              '/ 5mm',

              // Matching stops after single keyword is found
              '/ contain contain',
              '/ cover auto',
              '/ cover 10px',

              // Matching stops after invalid values
              '/ auto round',
            ],
            expectValue: 2, // '/' + 1
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.BgSize} 2-value syntax`,
        DataTypeType.BgSize,
        matchBgSize,
        {
          nonValid: { values: [] },
          valid: {
            values: [
              '/ auto auto',
              '/ auto 50%',
              '/ 13cm auto',
              '/ 30% 1mm',

              // Matching stops after '/' + 2 values
              '/ 30% 1mm 10px',
              '/ 30% 1mm auto',
              '/ 30% 1mm cover',
              '/ 30% 1mm scroll',
            ],
            expectValue: 3, // '/' + 2
          },
        },
      );
    });

    describe(`${DataTypeType.RepeatStyle}`, () => {
      // syntax: repeat-x | repeat-y | [ repeat | space | round | no-repeat ]{1,2}
      const matchRepeatStyle = matchDataType(repeatStyleDataType);

      DataTypeSuite(
        `${DataTypeType.RepeatStyle} keyword`,
        DataTypeType.RepeatStyle,
        matchRepeatStyle,
        {
          nonValid: { values: ['local'] },
          valid: {
            values: [
              'repeat-y',

              // Matching stops after single keyword is found
              'repeat-y repeat-y',
              'repeat-x space',
              'repeat-x scroll',
            ],
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.RepeatStyle} 1-value syntax`,
        DataTypeType.RepeatStyle,
        matchRepeatStyle,
        {
          nonValid: { values: ['fixed'] },
          valid: {
            values: [
              'no-repeat',

              // Matching stops after invalid values
              'repeat local',
            ],
            expectValue: 1,
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.RepeatStyle} 2-value syntax`,
        DataTypeType.RepeatStyle,
        matchRepeatStyle,
        {
          nonValid: { values: ['scroll'] },
          valid: {
            values: [
              'repeat round',
              'no-repeat no-repeat',

              // Matching stops after 2 values
              'repeat space round',
            ],
            expectValue: 2,
          },
        },
      );
    });

    describe(`${DataTypeType.Attachment}`, () => {
      // syntax: scroll | fixed | local

      DataTypeSuite(
        `${DataTypeType.Attachment} keyword`,
        DataTypeType.Attachment,
        matchDataType(attachmentDataType),
        {
          nonValid: { values: ['padding-box'] },
          valid:    { values: ['fixed']       },
        },
      );
    });

    describe(`${DataTypeType.Box}`, () => {
      // syntax: border-box | padding-box | content-box

      DataTypeSuite(
        `${DataTypeType.Box} keyword`,
        DataTypeType.Box,
        matchDataType(boxDataType),
        {
          nonValid: { values: ['fixed']       },
          valid:    { values: ['padding-box'] },
        },
      );
    });
  });

  describe('<\'font\'>', () => {
    describe(`${DataTypeType.FontStyle}`, () => {
      // syntax: normal | italic | oblique <angle>?
      const matchFontStyle = matchDataType(fontStyleDataType);

      DataTypeSuite(
        `${DataTypeType.FontStyle} keyword`,
        DataTypeType.FontStyle,
        matchFontStyle,
        {
          nonValid: { values: ['bold'] },
          valid: {
            values: [
              'italic',

              // Matching stops after single keyword is found
              'italic italic',
              'normal oblique',
            ],
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.FontStyle} 1-value syntax`,
        DataTypeType.FontStyle,
        matchFontStyle,
        {
          nonValid: { values: ['small-caps'] },
          valid: {
            values: [
              'oblique',

              // Matching stops after invalid values
              'oblique italic',
              'oblique 30px',
            ],
            expectValue: 1,
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.FontStyle} 2-value syntax`,
        DataTypeType.FontStyle,
        matchFontStyle,
        {
          nonValid: { values: [] },
          valid: {
            values: [
              'oblique 45deg',

              // Matching stops after 2 values
              'oblique 45deg italic',
            ],
            expectValue: 2,
          },
        },
      );
    });

    describe(`${DataTypeType.FontVariant}`, () => {
      // syntax: normal | small-caps

      DataTypeSuite(
        `${DataTypeType.FontVariant} keyword`,
        DataTypeType.FontVariant,
        matchDataType(fontVariantDataType),
        {
          nonValid: { values: ['italic']     },
          valid:    { values: ['small-caps'] },
        },
      );
    });

    describe(`${DataTypeType.FontWeight}`, () => {
      // syntax: <font-weight-absolute> | <font-weight-relative> | [1,1000]
      const matchFontWeight = matchDataType(fontWeightDataType);

      DataTypeSuite(
        `${DataTypeType.FontWeight} keyword`,
        DataTypeType.FontWeight,
        matchFontWeight,
        {
          nonValid: { values: ['italic'] },
          valid:    { values: ['bolder'] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.FontWeight} number`,
        DataTypeType.FontWeight,
        matchFontWeight,
        {
          nonValid: {
            values: [
              '0',
              '1001',
              '10px',
            ],
          },
          valid: {
            values: [
              '1',
              '1000',
              '451',
            ],
          },
        },
      );
    });

    describe(`${DataTypeType.FontStretch}`, () => {
      // syntax: normal | ultra-condensed | extra-condensed | condensed | semi-condensed | semi-expanded | expanded | extra-expanded | ultra-expanded

      DataTypeSuite(
        `${DataTypeType.FontStretch} keyword`,
        DataTypeType.FontStretch,
        matchDataType(fontStretchDataType),
        {
          nonValid: { values: ['italic']         },
          valid:    { values: ['extra-expanded'] },
        },
      );
    });

    describe(`${DataTypeType.FontSize}`, () => {
      // syntax: <length-percentage> | <absolute-size> | <relative-size>
      const matchFontSize = matchDataType(fontSizeDataType);

      DataTypeSuite(
        `${DataTypeType.FontSize} keyword`,
        DataTypeType.FontSize,
        matchFontSize,
        {
          nonValid: { values: ['italic'] },
          valid: {
            values: [
              'x-large',
              'smaller',
            ],
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.FontSize} ${DataTypeType.LengthPercentage}`,
        DataTypeType.FontSize,
        matchFontSize,
        {
          nonValid: { values: ['10']   },
          valid:    { values: ['12mm', '33%'] },
        },
      );
    });

    describe(`${DataTypeType.LineHeight}`, () => {
      // syntax: <number> | <length-percentage> | normal
      const matchLineHeight = matchDataType(lineHeightDataType, DataTypeType.FontSize);

      DataTypeSuite(
        `${DataTypeType.LineHeight} incorrect previous data-type`,
        DataTypeType.LineHeight,
        matchDataType(lineHeightDataType),
        {
          nonValid: {
            values: [
              '/ normal',
              '/ 10',
            ],
          },
          valid: { values: [] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.LineHeight} invalid value`,
        DataTypeType.LineHeight,
        matchLineHeight,
        {
          nonValid: {
            values: [
              // No preceding '/'
              'normal',
              '0',
              '10',
              '15px',
              '50%',

              // With '/' but invalid following value
              '/',
              '/ italic',
            ],
          },
          valid: { values: [] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.LineHeight} keyword`,
        DataTypeType.LineHeight,
        matchLineHeight,
        {
          nonValid: { values: [] },
          valid: {
            values: ['/ normal'],
            expectValue: 2, // '/' + 1
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.LineHeight} ${DataTypeType.Number} | ${DataTypeType.LengthPercentage}`,
        DataTypeType.LineHeight,
        matchLineHeight,
        {
          nonValid: { values: [] },
          valid: {
            values: [
              '/ 0',
              '/ 10',
              '/ 15px',
              '/ 50%',
            ],
            expectValue: 2, // '/' + 1
          },
        },
      );
    });

    describe(`${DataTypeType.FontFamily}`, () => {
      // syntax: <generic-family> | <string>

      DataTypeSuite(
        `${DataTypeType.FontFamily} keyword`,
        DataTypeType.FontFamily,
        matchDataType(fontFamilyDataType),
        {
          nonValid: { values: []          },
          valid:    { values: ['fantasy'] },
        },
      );

      DataTypeSuite(
        `${DataTypeType.FontFamily} <string>`,
        DataTypeType.FontFamily,
        matchDataType(fontFamilyDataType),
        {
          nonValid: { values: ['rgb(0, 0, 0)'] },
          valid: {
            values: [ '"Times New Roman", serif' ],
            expectValue: 3, // string + ',' + text
          },
        },
      );
    });

    describe(`${DataTypeType.Font}`, () => {
      // syntax: caption | icon | menu | message-box | small-caption | status-bar

      DataTypeSuite(
        `${DataTypeType.Font} keyword`,
        DataTypeType.Font,
        matchDataType(fontDataType),
        {
          nonValid: { values: ['10px']          },
          valid:    { values: ['small-caption'] },
        },
      );
    });
  });

  describe('<\'flex\'>', () => {
    describe(`${DataTypeType.FlexGrow}`, () => {
      // syntax: <number>

      DataTypeSuite(
        `${DataTypeType.FlexGrow} ${DataTypeType.Number}`,
        DataTypeType.FlexGrow,
        matchDataType(flexGrowDataType),
        {
          nonValid: { values: ['10px'] },
          valid:    { values: ['10']   },
        },
      );
    });

    describe(`${DataTypeType.FlexShrink}`, () => {
      // syntax: <number>

      DataTypeSuite(
        `${DataTypeType.FlexShrink} ${DataTypeType.Number}`,
        DataTypeType.FlexShrink,
        matchDataType(flexShrinkDataType),
        {
          nonValid: { values: ['10px'] },
          valid:    { values: ['10']   },
        },
      );
    });

    describe(`${DataTypeType.FlexBasis}`, () => {
      // syntax: <width> | content | fill | max-content | min-content | fit-content
      const matchFlexBasis = matchDataType(flexBasisDataType);

      DataTypeSuite(
        `${DataTypeType.FlexBasis} keyword`,
        DataTypeType.FlexBasis,
        matchFlexBasis,
        {
          nonValid: { values: ['icon'] },
          valid: {
            values: [
              'content',
              'fit-content',
            ],
          },
        },
      );

      DataTypeSuite(
        `${DataTypeType.FlexBasis} ${DataTypeType.Width}`,
        DataTypeType.FlexBasis,
        matchFlexBasis,
        {
          nonValid: { values: ['10'] },
          valid: {
            values: [
              'auto',
              '10px',
              '11%',
            ],
          },
        },
      );
    });

    describe(`${DataTypeType.Flex}`, () => {
      // syntax: initial | auto | none

      DataTypeSuite(
        `${DataTypeType.Flex} keyword`,
        DataTypeType.Flex,
        matchDataType(flexDataType),
        {
          nonValid: { values: ['italic'] },
          valid:    { values: ['auto']   },
        },
      );
    });
  });

  describe(`${DataTypeType.Color}`, () => {
    // syntax: <rgb()> | <rgba()> | <hsl()> | <hsla()> | <hex-color> | <named-color> | currentcolor | <deprecated-system-color>
    const matchColor = matchDataType(colorDataType);

    DataTypeSuite(
      `${DataTypeType.Color} function`,
      DataTypeType.Color,
      matchColor,
      {
        nonValid: { values: ['url(pic.png)']         },
        valid:    { values: ['rgba(255, 114, 0, 1)'] },
      },
    );

    DataTypeSuite(
      `${DataTypeType.Color} <hex-color>`,
      DataTypeType.Color,
      matchColor,
      {
        nonValid: {
          values: [
            'AABBCC',
            'A#AA01CC',
            '#AABB02A',
            '#A03BC',
            '#04G',
            '#AA05GH',
          ],
        },
        valid: {
          values: [
            '#AABBCC',
            '#A1B2C3',
            '#D4E5F9',
            '#ABC',
            '#678',
            // '#DDEEFFAA' // TODO?
          ],
        },
      },
    );

    DataTypeSuite(
      `${DataTypeType.Color} keyword`,
      DataTypeType.Color,
      matchColor,
      {
        nonValid: { values: ['medium'] },
        valid: {
          values: [
            'red',
            'currentcolor',
            'InfoBackground',
          ],
        },
      },
    );
  });

  describe(`${DataTypeType.Overflow}`, () => {
    // syntax: visible | hidden | clip | scroll | auto

    DataTypeSuite(
      `${DataTypeType.Universal} keyword`,
      DataTypeType.Universal,
      matchDataType(overflowDataType),
      {
        nonValid: { values: ['none']   },
        valid:    { values: ['hidden'] },
      },
    );
  });

  describe('Dimensions', () => {
    DataTypeSuite(
      `${DataTypeType.Length}`,
      DataTypeType.Length,
      matchDataType(lengthDataType),
      {
        nonValid: {
          values: [
            '10',
            '12.',
            '+-12.2vw',
            '12.1.1ic',
            '10%',
            '1p2x',
            '10px10',
            '10a10px',
            'rgb(255, 114, 0)',
          ],
        },
        valid: {
          values: [
            '0',
            '.0',
            '+0',
            '-0',
            '0.0',
            '+0.0',
            '-0.0',
            '0cm',
            '+0cm',
            '-0cm',
            '0.0cm',
            '+0.0cm',
            '-0.0cm',
            '10px',
            '00060pc',
            '-2em',
            '+3mm',
            '4.5in',
            '4.500in',
            '.64pt',
            '12e5Q',
            '-3.4e-2vh',
            'calc(10px + 2cm)'
          ],
        },
      },
    );

    DataTypeSuite(
      `${DataTypeType.Number}`,
      DataTypeType.Number,
      matchPredicate(numberPredicate),
      {
        nonValid: {
          values: [
            '12.',
            '+-12.2',
            '12.1.1',
            '10px',
            '1px2',
            '.0px0',
            'rgb(255, 114, 0)',
            'calc(10px + 2cm)',
          ],
        },
        valid: {
          values: [
            '0',
            '.0',
            '+0',
            '-0',
            '0.0',
            '+0.0',
            '-0.0',
            '10',
            '00060',
            '-2',
            '+3',
            '4.5',
            '4.500',
            '.64',
            '12e5',
            '-3.4e-2',
          ],
        },
      },
    );

    DataTypeSuite(
      `${DataTypeType.Percentage}`,
      DataTypeType.Percentage,
      matchPredicate(percentagePredicate),
      {
        nonValid: {
          values: [
            '10',
            '20px',
          ],
        },
        valid: { values: ['10%'] },
      },
    );

    DataTypeSuite(
      `${DataTypeType.LengthPercentage}`,
      DataTypeType.LengthPercentage,
      matchDataType(lengthPercentageDataType),
      {
        nonValid: { values: ['10'] },
        valid: {
          values: [
            '10px',
            '11%',
          ],
        },
      },
    );

    DataTypeSuite(
      `${DataTypeType.Angle}`,
      DataTypeType.Angle,
      matchPredicate(anglePredicate),
      {
        nonValid: {
          values: [
            '10',
            '20px',
            '30%',
          ],
        },
        valid: {
          values: [
            '10deg',
            '11grad',
            '12rad',
            '13turn',
          ],
        },
      },
    );

    DataTypeSuite(
      `${DataTypeType.Width}`,
      DataTypeType.Width,
      matchDataType(widthDataType),
      {
        nonValid: { values: ['10'] },
        valid: {
          values: [
            'auto',
            '10px',
            '11%',
          ],
        },
      },
    );
  });

  describe(`${DataTypeType.Universal}`, () => {
    // syntax: inherit | initial | unset

    DataTypeSuite(
      `${DataTypeType.Universal} keyword`,
      DataTypeType.Universal,
      matchDataType(universalDataType),
      {
        nonValid: { values: ['none'] },
        valid: {
          values: [
            'inherit',
            'initial',
            'unset',
          ],
        },
      },
    );
  });
});
