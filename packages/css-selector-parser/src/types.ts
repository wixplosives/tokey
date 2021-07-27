// ToDo: move to types.ts
/**
 * convert object|array into a replica deep readonly type
 */
export type Immutable<T> = T extends (infer R)[]
  ? ImmutableArray<R>
  : T extends Function
  ? T
  : T extends object
  ? ImmutableObject<T>
  : T;

type ImmutableObject<T> = {
  readonly [P in keyof T]: Immutable<T[P]>;
}
type ImmutableArray<T> = ReadonlyArray<Immutable<T>>