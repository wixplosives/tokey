declare module '@webref/css' {
    interface SpecData {
        properties: Record<
            string,
            {
                name: string;
                value?: string;
                initial: string;
            }
        >;
        valuespaces: Record<
            string,
            {
                value?: string;
            }
        >;
    }
    export function listAll(): Promise<Record<string, SpecData>>;
}
