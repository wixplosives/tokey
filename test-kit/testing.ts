export function test<T, U>(
  input: T,
  aFn: (input: T) => U,
  expected: U,
  log = console.log.bind(console)
) {
  const actual = aFn(input);
  const normInput = JSON.stringify(input);
  if (!isMatch(actual, expected)) {
    const e = JSON.stringify(expected, null, 2);
    const a = JSON.stringify(actual, null, 2);
    throw new Error(`Fail Input: ${normInput}\n${a}\nTo\n${e}`);
  } else {
    log(`Pass Input: ${normInput}`);
  }
}

test.TODO = function <T, U>(
  input: T,
  aFn: (input: T) => U,
  expected: U,
  log = console.log.bind(console)
) {
  try {
    test(input, aFn, expected, log);
  } catch (e) {
    console.warn("TODO Failed: " + JSON.stringify(input));
  }
};

function isMatch(a: any, b: any): boolean {
  if (a === b) {
    return true;
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return false;
    }
    return a.every((v, i) => {
      return isMatch(v, b[i]);
    });
  }
  if (typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a);
    const bk = Object.keys(b);
    if (ak.length !== bk.length) {
      return false;
    }
    return ak.every((k) => {
      return isMatch(a[k], b[k]);
    });
  }
  return false;
}
