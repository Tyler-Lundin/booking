import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error('NEXT_PUBLIC_ENCRYPTION_KEY environment variable is required');
}

const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const KEY_LENGTH = 32;

const scryptAsync = promisify(scrypt);

export async function encrypt(text: string): Promise<string> {
  try {
    // Generate a random salt
    const salt = randomBytes(SALT_LENGTH);
    
    // Derive the encryption key using the salt
    const key = await scryptAsync(ENCRYPTION_KEY, salt, KEY_LENGTH) as Buffer;
    
    // Generate a random initialization vector
    const iv = randomBytes(IV_LENGTH);
    
    // Create the cipher
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    
    // Encrypt the text
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final()
    ]);
    
    // Get the authentication tag
    const authTag = cipher.getAuthTag();
    
    // Combine salt, iv, authTag, and encrypted data
    const combined = Buffer.concat([salt, iv, authTag, encrypted]);
    
    // Return as base64 string
    return combined.toString('base64');
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export async function decrypt(encryptedText: string): Promise<string> {
  try {
    // Convert from base64
    const combined = Buffer.from(encryptedText, 'base64');
    
    // Extract components
    const salt = combined.slice(0, SALT_LENGTH);
    const iv = combined.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const authTag = combined.slice(SALT_LENGTH + IV_LENGTH, SALT_LENGTH + IV_LENGTH + 16);
    const encrypted = combined.slice(SALT_LENGTH + IV_LENGTH + 16);
    
    // Derive the key using the salt
    const key = await scryptAsync(ENCRYPTION_KEY, salt, KEY_LENGTH) as Buffer;
    
    // Create the decipher
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(authTag);
    
    // Decrypt the text
    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final()
    ]);
    
    return decrypted.toString('utf8');
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}

// Helper function to encrypt specific fields in an object
export async function encryptFields<T extends Record<string, any>>(
  obj: T,
  fields: Array<keyof T>
): Promise<T> {
  const encrypted = { ...obj };
  
  for (const field of fields) {
    if (obj[field] !== undefined && obj[field] !== null) {
      encrypted[field] = await encrypt(String(obj[field])) as T[keyof T];
    }
  }
  
  return encrypted;
}

// Helper function to decrypt specific fields in an object
export async function decryptFields<T extends Record<string, any>>(
  obj: T,
  fields: Array<keyof T>
): Promise<T> {
  const decrypted = { ...obj };
  
  for (const field of fields) {
    if (obj[field] !== undefined && obj[field] !== null) {
      decrypted[field] = await decrypt(String(obj[field])) as T[keyof T];
    }
  }
  
  return decrypted;
} 