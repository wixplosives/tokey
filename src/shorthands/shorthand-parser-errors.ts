export class ShorthandParserError extends Error {
  constructor(message: string, prop?: string) {
    super(`Shorthand Parser Error! ${prop ? ('[' + prop + '] ') : ''}${message}`);
  }
}

export class NoMandatoryPartMatchError extends ShorthandParserError {
  constructor(prop: string, partProp: string) {
    super(`No mandatory match on shorthand part: "${partProp}".`, prop);
  }
}

export class InvalidEdgesInputLengthError extends ShorthandParserError {
  constructor(prop: string, length: number) {
    super(`Invalid edges input length: "${length}".`, prop);
  }
}

export class NoDataTypeMatchError extends ShorthandParserError {
  constructor(value: string) {
    super(`No data-type match: "${value}".`);
  }
}
