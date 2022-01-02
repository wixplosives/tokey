export function isMatch(a: any, b: any): boolean {
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
    if (typeof a === 'object' && typeof b === 'object') {
        const ak = Object.keys(a as object);
        const bk = Object.keys(b as object);
        if (ak.length !== bk.length) {
            return false;
        }
        return ak.every((k) => {
            return isMatch(a[k], b[k]);
        });
    }
    return false;
}
