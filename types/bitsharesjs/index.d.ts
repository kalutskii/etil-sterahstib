declare module 'bitsharesjs' {
  export class PrivateKey {
    static fromWif(wif: string): PrivateKey;
    static fromSeed(seed: string): PrivateKey;
    toPublicKey(): PublicKey;
  }

  export class PublicKey {
    static fromStringOrThrow(s: string): PublicKey;
    toString(): string;
  }

  export class Aes {
    static decrypt_with_checksum(priv: PrivateKey, pub: PublicKey, nonce: string | number, message: any): Uint8Array | Buffer;

    static encrypt_with_checksum(priv: PrivateKey, pub: PublicKey, nonce: string | number, message: Uint8Array | Buffer | string): any;
  }
}
