// ToDo: move to types.ts
/**
 * convert object|array into a replica deep readonly type
 */
export type Immutable<T> = T extends (infer R)[]
  ? ReadonlyArray<Immutable<R>>
  : T extends Function
  ? T
  : T extends object
  ? {
      readonly [P in keyof T]: Immutable<T[P]>;
    }
  : T;