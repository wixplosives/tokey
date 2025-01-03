export function initPreview(
    input: HTMLTextAreaElement,
    output: HTMLElement,
    tokenizeValues: (value: string) => any[],
    renderer = renderShallowToken,
) {
    const render = true;
    let start = 0;
    let tokens: { start: number; end: number }[] = [];
    let end = 0;
    function updateTokens() {
        start = performance.now();
        tokens = tokenizeValues(input.value);
        end = performance.now();
    }

    function updateHTML() {
        const range = {
            start: input.selectionStart,
            end: input.selectionEnd,
        };

        output.innerHTML = `time: ${end - start}ms\ntokens: ${tokens.length}\n${
            render ? tokens.map(renderer(range)).join('\n') : ''
        }`;
    }

    function updateOutput() {
        updateTokens();
        updateHTML();
    }

    input.oninput = updateOutput;
    document.addEventListener('selectionchange', updateHTML);
    document.addEventListener('playground:updateOutput', updateOutput);
}

export function renderShallowToken(range: {
    start: number;
    end: number;
}): (value: { start: number; end: number }, index: number, array: any[]) => string {
    return (token) => {
        if (isInRange(token, range)) {
            return `<strong>${JSON.stringify(token, null, 2)}</strong>`;
        } else {
            return JSON.stringify(token, null, 2);
        }
    };
}

export function renderToken(
    token: any,
    range: { start: number; end: number },
    level = 0,
    parentInRange = false,
) {
    const isArray = Array.isArray(token);
    const open = isArray ? '[' : '{';
    const close = isArray ? ']' : '}';
    const inRange =
        'start' in token && 'end' in token
            ? isInRange(token as { start: number; end: number }, range)
            : parentInRange;

    let out = open + '\n';
    for (const [k, v] of Object.entries(token as object)) {
        out += '  '.repeat(1 + level) + (isArray ? '' : k + ': ');
        if (typeof v === 'object' && v !== null) {
            out += renderToken(v, range, level + 1, inRange);
        } else {
            out += JSON.stringify(v);
        }
        out += ',\n';
    }
    out += '  '.repeat(level) + close;
    return `<span data-in-rage="${inRange}" style="--level: ${level}">${out}</span>`;
}

export function renderNestedToken(range: {
    start: number;
    end: number;
}): (value: any, index: number, array: any[]) => string {
    return (token) => {
        return renderToken(token, range);
    };
}

export function isInRange(
    token: { start: number; end: number },
    range: { start: number; end: number },
) {
    if (range.end === range.start) {
        if (token.start <= range.start && range.start < token.end) {
            return true;
        }
    } else {
        if ((token.start > range.start || token.end > range.start) && token.start < range.end) {
            return true;
        }
    }
    return false;
}
