import { initPreview } from './client/view';
import { parseValueSyntax } from '../packages/css-value-parser/src/value-syntax-parser';
import { valueDefinitions } from '../packages/css-value-parser/src/value-definitions';

const topBar = document.getElementById('top-bar');
const input = document.getElementById('input') as HTMLTextAreaElement;
const output = document.getElementById('output');
const select = document.createElement('select');

Object.keys(valueDefinitions.props).forEach((key) => {
    const option = document.createElement('option');
    option.value = valueDefinitions.props[key].syntax;
    option.textContent = key;
    select.appendChild(option);
});

select.selectedIndex = 0;
topBar.appendChild(select);

initPreview(input, output, (...args) => [parseValueSyntax(...args)]);

select.onchange = () => {
    setValue(select.value);
};

function setValue(value) {
    input.value = value;
    document.dispatchEvent(new CustomEvent('playground:updateOutput'));
}
setValue(select.value);
