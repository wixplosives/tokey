/* eslint-disable no-constant-condition */
interface AstNode<Child, Parent> {
    parent: Parent | null;
    children: Child[];
    start: number;
    end: number;
}

interface JsonAstNode extends AstNode<JsonAstNode, JsonAstNode | JsonAstRoot> {
    type:
        | 'object'
        | 'member'
        | 'colon'
        | 'array'
        | 'string'
        | 'number'
        | 'boolean'
        | 'whitespace'
        | 'null';
}

interface JsonAstRoot extends AstNode<JsonAstNode, null> {
    type: 'root';
}

const advance = Symbol('advance');
type AstGenerator = Generator<typeof advance | JsonAstNode | Error, void | string, unknown>;

export class IncrementalJSONParser {
    index = 0;
    input = '';
    char = '';
    root: JsonAstRoot = {
        type: 'root',
        parent: null,
        children: [],
        start: 0,
        end: 0,
    };
    stack: [JsonAstRoot, ...JsonAstNode[]] = [this.root];
    ended = false;
    parser: AstGenerator | null = null;
    constructor(private options: { parents?: boolean } = {}) {}
    private next() {
        if (this.ended) {
            throw new Error(`Cannot parse chunk after endOfInput`);
        }
        if (!this.parser) {
            throw new Error(`Cannot parse chunk before parseChunk`);
        }
        const { value, done } = this.parser.next();
        if (done) {
            this.parser = null;
        } else {
            if (value === advance) {
                this.index++;
                this.char = this.input[this.index];
            } else if (value instanceof Error) {
                throw value;
            } else {
                const node = value;
                // console.log(node.type, '"' + this.input.slice(node.start, node.end) + '"');
                const parent = this.stack[this.stack.length - 1];
                if (this.options.parents) {
                    node.parent = parent;
                }
                parent.children.push(node);
            }
            if (this.index < this.input.length) {
                this.next();
            }
        }
    }
    parseChunk(chunk: string) {
        if (this.ended) {
            throw new Error(`Cannot parse chunk after endOfInput`);
        }
        this.input += chunk;
        this.char = this.input[this.index];
        this.parser = this.parser ?? this.parseElement();
        this.next();
    }
    endOfInput() {
        if (this.parser) {
            this.next();
        }
        this.ended = true;
        this.root.end = this.input.length;
    }
    private createNode(type: JsonAstNode['type'], start: number, end = NaN): JsonAstNode {
        return {
            type,
            parent: null,
            children: [],
            start,
            end,
        };
    }
    private *parseElement(): AstGenerator {
        yield* this.maybeParseWhitespace();
        yield* this.parseValue();
        yield* this.maybeParseWhitespace();
    }
    private *parseValue(): AstGenerator {
        const ch = this.currentChar();
        if (ch === '{') {
            yield* this.parseBlock('object', '}');
        } else if (ch === '[') {
            yield* this.parseBlock('array', ']');
        } else if (ch === '"') {
            yield* this.parseString();
        } else if (ch === 't') {
            yield* this.parseTrue();
        } else if (ch === 'f') {
            yield* this.parseFalse();
        } else if (ch === 'n') {
            yield* this.parseNull();
        } else if (this.isNumberStart(ch)) {
            yield* this.parseNumber();
        } else {
            yield new Error(this.unexpectedCharParseError(ch));
        }
    }
    private *parseBlock(...[type, endBlock]: ['object', '}'] | ['array', ']']): AstGenerator {
        const start = this.index;
        yield advance;
        const node: JsonAstNode = this.createNode(type, start);
        this.stack.push(node);
        const ws = yield* this.consumeWhitespace();
        if (this.currentChar() === endBlock) {
            if (ws) {
                yield this.createNode('whitespace', this.index - ws.length, this.index);
            }
            node.end = this.index + 1;
            this.stack.pop();
            yield node;
            yield advance;
        } else {
            if (type === 'object') {
                yield* this.parseMembers(endBlock);
            } else if (type === 'array') {
                yield* this.parseElements(endBlock);
            } else {
                // TODO: unreachable type
            }
            this.stack.pop();
            node.end = this.index + 1;
            yield node;
            yield advance;
        }
    }
    private *parseElements(endBlock: ']'): AstGenerator {
        while (true) {
            yield* this.parseElement();
            const ch = this.currentChar();
            if (ch === endBlock) {
                break;
            }
            if (ch === ',') {
                yield advance;
            } else {
                yield new Error(`Expected ',' or '${endBlock}'`);
            }
        }
    }
    private *parseMembers(endBlock: '}'): AstGenerator {
        while (true) {
            yield* this.parseMember();
            const ch = this.currentChar();
            if (ch === endBlock) {
                break;
            }
            if (ch === ',') {
                yield advance;
            } else {
                yield new Error(this.unexpectedCharParseError(ch, `',' or '${endBlock}'`));
            }
        }
    }
    private *parseMember(): AstGenerator {
        const start = this.index;
        const node: JsonAstNode = this.createNode('member', start);
        this.stack.push(node);
        yield* this.maybeParseWhitespace();
        yield* this.parseString();
        yield* this.maybeParseWhitespace();
        yield* this.parseColon();
        yield* this.maybeParseWhitespace();
        const ch = this.currentChar();
        if (ch === '}' || ch === ',') {
            node.end = this.index;
            this.stack.pop();
            yield node;
        } else {
            yield* this.parseElement();
            node.end = this.index;
            this.stack.pop();
            yield node;
        }
    }
    private *parseColon(): AstGenerator {
        yield* this.expect(':');
        yield this.createNode('colon', this.index, this.index + 1);
        yield advance;
    }
    private *parseString(): AstGenerator {
        const start = this.index;
        yield* this.expect('"');
        yield advance;
        const node: JsonAstNode = this.createNode('string', start);
        while (true) {
            const ch = this.currentChar();
            if (ch === '"') {
                break;
            }
            if (ch === '\\') {
                yield* this.parseEscape();
            } else {
                yield advance;
            }
        }
        yield advance;
        node.end = this.index;
        yield node;
    }
    private *parseNumber(): AstGenerator {
        const start = this.index;
        const node: JsonAstNode = this.createNode('number', start);
        let ch = this.currentChar();
        if (ch === '-') {
            yield advance;
            ch = this.currentChar();
        }
        if (ch === '0') {
            yield advance;
            ch = this.currentChar();
            if (this.isDigit(ch)) {
                yield new Error(this.unexpectedCharParseError(ch));
            }
        } else if (this.isDigit(ch)) {
            yield* this.parseDigits();
        } else {
            yield new Error(this.unexpectedCharParseError(ch));
        }
        ch = this.currentChar();
        if (ch === '.') {
            yield advance;
            yield* this.parseDigits();
            ch = this.currentChar();
        }
        if (ch === 'e' || ch === 'E') {
            yield advance;
            ch = this.currentChar();
            if (ch === '+' || ch === '-') {
                yield advance;
            }
            yield* this.parseDigits();
        }
        node.end = this.index;
        yield node;
    }
    private *parseDigits(): AstGenerator {
        while (true) {
            const ch = this.currentChar();
            if (this.isDigit(ch)) {
                yield advance;
            } else {
                break;
            }
        }
    }
    private *parseEscape(): AstGenerator {
        yield* this.expect('\\');
        yield advance;
        const ch = this.currentChar();
        if (
            ch === '"' ||
            ch === '\\' ||
            ch === '/' ||
            ch === 'b' ||
            ch === 'f' ||
            ch === 'n' ||
            ch === 'r' ||
            ch === 't'
        ) {
            yield advance;
        } else if (ch === 'u') {
            yield advance;
            yield* this.parseHex();
            yield* this.parseHex();
            yield* this.parseHex();
            yield* this.parseHex();
        } else {
            yield new Error(this.unexpectedCharParseError(ch));
        }
    }
    private *parseHex() {
        const ch = this.currentChar();
        if (this.isDigit(ch) || (ch >= 'A' && ch <= 'F') || (ch >= 'a' && ch <= 'f')) {
            yield advance;
        } else {
            yield new Error(this.unexpectedCharParseError(ch, 'hex digit'));
        }
    }
    private isNumberStart(ch: string) {
        return this.isDigit(ch) || ch === '-';
    }
    private isDigit(ch: string) {
        return ch >= '0' && ch <= '9';
    }
    private *parseTrue(): AstGenerator {
        const start = this.index;
        yield* this.expect('t');
        yield advance;
        yield* this.expect('r');
        yield advance;
        yield* this.expect('u');
        yield advance;
        yield* this.expect('e');
        yield advance;
        yield this.createNode('boolean', start, this.index);
    }
    private *parseFalse(): AstGenerator {
        const start = this.index;
        yield* this.expect('f');
        yield advance;
        yield* this.expect('a');
        yield advance;
        yield* this.expect('l');
        yield advance;
        yield* this.expect('s');
        yield advance;
        yield* this.expect('e');
        yield advance;
        yield this.createNode('boolean', start, this.index);
    }
    private *parseNull(): AstGenerator {
        const start = this.index;
        yield* this.expect('n');
        yield advance;
        yield* this.expect('u');
        yield advance;
        yield* this.expect('l');
        yield advance;
        yield* this.expect('l');
        yield advance;
        yield this.createNode('null', start, this.index);
    }
    private unexpectedCharParseError(ch: string, expected?: string) {
        const input = this.input;
        const lines = input.slice(0, this.index).split('\n');
        const line = lines.length;
        const col = this.index - input.lastIndexOf('\n', this.index);
        const partialView = input.slice(this.index - 10, this.index + 10);
        partialView;
        const msg = `Unexpected character: ${ch} at line ${line} col ${col} near: \n${partialView}\n${
            ' '.repeat(Math.min(input.length - 1, 10)) + '^'
        }`;
        if (expected) {
            return `${msg}. Expected: ${expected}`;
        }
        return msg;
    }
    private *maybeParseWhitespace() {
        const ws = yield* this.consumeWhitespace();
        if (ws) {
            yield this.createNode('whitespace', this.index - ws.length, this.index);
        }
    }
    private *consumeWhitespace(): AstGenerator {
        let ws = '';
        while (true) {
            const ch = this.currentChar();
            if (this.isWhitespace(ch)) {
                ws += ch;
                yield advance;
            } else {
                break;
            }
        }
        return ws;
    }
    private isWhitespace(ch: string) {
        return ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t';
    }
    private *expect(ch: string): AstGenerator {
        const current = this.currentChar();
        if (current !== ch) {
            yield new Error(this.unexpectedCharParseError(current, ch));
        }
    }
    private currentChar() {
        // return this.char;
        return this.input[this.index];
    }
}

// SPEC

// json
//    element

// value
//    object
//    array
//    string
//    number
//    "true"
//    "false"
//    "null"

// object
//     '{' ws '}'
//     '{' members '}'

// members
//     member
//     member ',' members

// member
//     ws string ws ':' element

// array
//     '[' ws ']'
//     '[' elements ']'

// elements
//     element
//     element ',' elements

// element
//     ws value ws

// string
// '"' characters '"'
// characters
//     ""
//     character characters
// character
//     '0020' . '10FFFF' - '"' - '\'
// '\' escape
// escape
//     '"'
//     '\'
//     '/'
//     'b'
//     'f'
//     'n'
//     'r'
//     't'
//     'u' hex hex hex hex

// hex
//     digit
//     'A' . 'F'
//     'a' . 'f'

// number
//     integer fraction exponent

// integer
//     digit
//     onenine digits
//     '-' digit
//     '-' onenine digits

// digits
//     digit
//     digit digits

// digit
//     '0'
//     onenine

// onenine
//     '1' . '9'

// fraction
//     ""
//     '.' digits

// exponent
//     ""
//     'E' sign digits
//     'e' sign digits

// sign
//     ""
//     '+'
//     '-'

// ws
//     ""
//     '0020' ws
//     '000A' ws
//     '000D' ws
//     '0009' ws
