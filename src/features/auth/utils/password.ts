// ABOUTME: Password hashing and verification utilities using Argon2
// ABOUTME: Provides secure password handling compatible with Lucia

import { hash, verify } from '@node-rs/argon2';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  });
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await verify(hash, password);
}