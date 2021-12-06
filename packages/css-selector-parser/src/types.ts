/**
 * convert object|array into a replica deep readonly type
 */
export type Immutable<T> = T extends Function ? T : T extends object ? ImmutableMap<T> : T;

export type ImmutableMap<T> = {
    readonly [P in keyof T]: Immutable<T[P]>;
};
