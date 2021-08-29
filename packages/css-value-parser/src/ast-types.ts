export interface CSSValueAST<TYPE extends string> {
  type: TYPE;
  start: number;
  end: number;
}

export type BaseAstNode = CustomIdent | DashedIdent | String | Number | Integer;

/* types */

// custom
export type BuildVarAst = CSSValueAST<`build-var`> & {
  subType: string;
  id: string;
};

// separators
export type RawComma = CSSValueAST<`,`>;
export type RawSpace = CSSValueAST<` `>;

// textual
export type CustomIdent = CSSValueAST<`<custom-ident>`>;
export type DashedIdent = CSSValueAST<`<dashed-ident>`>;
export type String = CSSValueAST<`<string>`>;
export type Url = CSSValueAST<`<url>`>;
// numeric
export type Integer = CSSValueAST<`<integer>`>;
export type Number = CSSValueAST<`<number>`>;
export type Percentage = CSSValueAST<`<percentage>`>;
export type Ratio = CSSValueAST<`<ratio>`>;
// distance
export type Length = CSSValueAST<`<length>`>;
// other quantities
export type Angle = CSSValueAST<`<angle>`>;
export type Time = CSSValueAST<`<time>`>;
export type Frequency = CSSValueAST<`<frequency>`>;
export type Resolution = CSSValueAST<`<resolution>`>;
// other
export type Color = CSSValueAST<`<color>`>;
export type Image = CSSValueAST<`<image>`>;
export type Position = CSSValueAST<`<position>`>;
// attribute
export type Attribute = CSSValueAST<`<attr()>`>;
// mathematical
/* 
<calc()>
<min()>
<max()>
<clamp()>
<round()>
<mod()>
<rem()>
<sin()>
<cos()>
<tan()>
<asin()>
<acos()>
<atan()>
<atan2()>
<pow()>
<sqrt()>
<hypot()>
<log()>
<exp()>
<abs()>
<sign()>

<calc-sum>, <calc-product>, <calc-value>, <calc-constant>
*/
