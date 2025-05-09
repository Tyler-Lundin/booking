'use server';

import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;
if (!ENCRYPTION_KEY) {
  throw new Error('ENCRYPTION_KEY environment variable is required');
}

const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

const scryptAsync = promisify(scrypt);

export async function encrypt(text: string): Promise<string> {
  try {
    const salt = randomBytes(SALT_LENGTH);
    const key = await scryptAsync(ENCRYPTION_KEY, salt, KEY_LENGTH) as Buffer;
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const combined = Buffer.concat([salt, iv, authTag, encrypted]);
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedText: string): Promise<string> {
  try {
    const combined = Buffer.from(encryptedText, 'base64');
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + 16);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + 16);
    const key = await scryptAsync(ENCRYPTION_KEY, salt, KEY_LENGTH) as Buffer;
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

export async function encryptFields<T extends Record<string, unknown>>(
  obj: T,
  fields: Array<keyof T>
): Promise<T> {
  const encrypted = { ...obj };
  for (const field of fields) {
    const value = obj[field];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        // Handle nested objects
        const nestedObj = value as Record<string, unknown>;
        for (const [key, val] of Object.entries(nestedObj)) {
          if (val !== undefined && val !== null) {
            nestedObj[key] = await encrypt(String(val));
          }
        }
        encrypted[field] = nestedObj as T[keyof T];
      } else {
        encrypted[field] = await encrypt(String(value)) as T[keyof T];
      }
    }
  }
  return encrypted;
}

export async function decryptFields<T extends Record<string, unknown>>(
  obj: T,
  fields: Array<keyof T>
): Promise<T> {
  const decrypted = { ...obj };
  for (const field of fields) {
    const value = obj[field];
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        // Handle nested objects
        const nestedObj = value as Record<string, unknown>;
        for (const [key, val] of Object.entries(nestedObj)) {
          if (val !== undefined && val !== null) {
            nestedObj[key] = await decrypt(String(val));
          }
        }
        decrypted[field] = nestedObj as T[keyof T];
      } else {
        decrypted[field] = await decrypt(String(value)) as T[keyof T];
      }
    }
  }
  return decrypted;
} 