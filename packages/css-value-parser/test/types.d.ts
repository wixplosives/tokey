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
        values: Array<{
            name: string;
            value?: string;
        }>;
    }
    export function listAll(): Promise<Record<string, SpecData>>;
}
