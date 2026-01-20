import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class EncryptionService {
  // <--- A MÁGICA ESTÁ NESTE "export"
  private algorithm = 'aes-256-ctr';
  private key: Buffer;

  constructor(private configService: ConfigService) {
    const keyString = this.configService.get<string>('ENCRYPTION_KEY');
    if (!keyString) {
      throw new Error('ENCRYPTION_KEY não definida no .env');
    }
    this.key = Buffer.from(keyString, 'hex');
  }

  encrypt(text: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decrypt(hash: string): string {
    const [ivHex, encryptedHex] = hash.split(':');
    if (!ivHex || !encryptedHex) {
      throw new Error('Hash inválido ou corrompido');
    }
    const iv = Buffer.from(ivHex, 'hex');
    const encryptedText = Buffer.from(encryptedHex, 'hex');
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    const decrypted = Buffer.concat([
      decipher.update(encryptedText),
      decipher.final(),
    ]);
    return decrypted.toString();
  }
}
