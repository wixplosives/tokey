export type Descriptors =
    | 'string'
    | 'text'
    | 'line-comment'
    | 'multi-comment'
    | 'unclosed-string'
    | 'unclosed-comment'
    | 'space';

export interface Token<Type = Descriptors> {
    type: Type;
    start: number;
    end: number;
    value: string;
}

export interface TokenGroup<GroupType, Type = Descriptors> {
    type: GroupType;
    start: number;
    end: number;
    value: string;
    tokens: Token<Type>[];
}
