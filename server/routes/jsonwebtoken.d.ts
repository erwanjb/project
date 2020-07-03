type Sign = (obj: object, key: string) => string;
type Verify = (token: string, key: string) => object;

declare module 'jsonwebtoken' {
    export const sign: Sign
    export const verify: Verify
} 