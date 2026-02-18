import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly algorithm = 'aes-256-ctr';

  // 👇 CHAVE DE 32 CARACTERES EXATOS. NÃO MUDE NADA AQUI.
  private readonly key = '12345678901234567890123456789012';

  encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(hash: string): string {
    // Proteção contra hash vazio ou inválido
    if (!hash || !hash.includes(':')) {
      return '';
    }

    const [ivPart, contentPart] = hash.split(':');

    if (!ivPart || !contentPart) {
      return '';
    }

    const iv = Buffer.from(ivPart, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(contentPart, 'hex')),
      decipher.final(),
    ]);

    return decrypted.toString();
  }
}
