import { IncrementalJSONParser } from '../src/incremental-json-parser';
import { readdirSync, createReadStream } from 'fs';

// https://github.com/nst/JSONTestSuite

const onlyFile = ''; //'y_object_escaped_null_in_key.json';

const files = readdirSync(__dirname + '/parsing-json');
function next() {
    if (files.length === 0) {
        return;
    }
    const file = files.shift()!;
    if (onlyFile && file !== onlyFile) {
        next();
        return;
    }
    const shouldPass = file.startsWith('y_');
    const shouldIT = file.startsWith('i_');
    const s = createReadStream(__dirname + `/parsing-json/${file}`, { encoding: 'utf8' });
    const parser = new IncrementalJSONParser();
    let hasError: unknown;
    s.on('data', (chunk) => {
        try {
            parser.parseChunk(chunk as string);
        } catch (error) {
            hasError = error;
            s.close();
        }
    });
    s.on('end', () => {
        try {
            parser.endOfInput();
        } catch (error) {
            hasError = error;
        }
        next();
    });
    s.on('close', () => {
        if (hasError && shouldPass) {
            console.log('Failed:', file);
            console.log(hasError);
        }
        if (shouldIT && hasError) {
            console.log('Failed:', file);
            console.log(hasError);
        }
        next();
    });
}

next();
