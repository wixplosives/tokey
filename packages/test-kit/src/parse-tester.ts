import { isMatch } from "./is-match";

interface TesterConfig<AST, INPUT extends string> {
  parse: (input: INPUT) => AST;
  stringify?: (ast: AST) => string;
  log?: (...msgs: string[]) => void;
}
interface TestOptions<AST> {
  expectedAst: AST;
  expectedString?: string;
  label?: string;
}

export function createParseTester<AST, INPUT extends string>({
  parse,
  stringify,
}: TesterConfig<AST, INPUT>) {
  const safeParse = (source: INPUT) => {
    try {
      return [parse(source), null];
    } catch (error) {
      return [null, error];
    }
  };
  return (
    source: INPUT,
    { expectedAst, expectedString, label }: TestOptions<AST>
  ) => {
    const [actualAst, parseError] = safeParse(source);
    if (parseError) {
      throw parseError;
    }
    if (!isMatch(actualAst, expectedAst)) {
      const e = JSON.stringify(expectedAst, null, 2);
      const a = JSON.stringify(actualAst, null, 2);
      throw new Error(createParseTester.errors.mismatchAst(a, e, label));
    }
    if (stringify) {
      const actualString = stringify(actualAst);
      expectedString = expectedString ?? source;
      if (actualString !== expectedString) {
        throw new Error(
          createParseTester.errors.mismatchStringify(
            actualString,
            expectedString,
            label
          )
        );
      }
    }
  };
}
createParseTester.errors = {
  mismatchAst(actual: string, expected: string, label = ``) {
    return `${getPrefix(
      label
    )}expected parsed value:\n${actual}\nto equal:\n${expected}`;
  },
  mismatchStringify(actual: string, expected: string, label = ``) {
    return `${getPrefix(
      label
    )}expected stringify value:\n${actual}\nto equal:\n${expected}`;
  },
};
const getPrefix = (label?: string) => (label ? `[${label}] ` : ``);
