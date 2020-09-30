export function initPreview(
  input: HTMLTextAreaElement,
  output: HTMLElement,
  tokenizeValues: (value: string) => any[]
) {
  const render = true;
  let start = 0;
  let tokens: any[] = [];
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
      render
        ? tokens
            .map((token) => {
              if (range.end === range.start) {
                if (token.start <= range.start && range.start < token.end) {
                  return `<strong>${JSON.stringify(token, null, 2)}</strong>`;
                }
              } else {
                if (
                  (token.start > range.start || token.end > range.start) &&
                  token.start < range.end
                ) {
                  return `<strong>${JSON.stringify(token, null, 2)}</strong>`;
                }
              }

              return JSON.stringify(token, null, 2);
            })
            .join("\n")
        : ""
    }`;
  }

  function updateOutput() {
    updateTokens();
    updateHTML();
  }

  input.oninput = updateOutput;
  document.addEventListener("selectionchange", updateHTML);
}
