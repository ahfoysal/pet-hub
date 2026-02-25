import { customAlphabet } from 'nanoid';

// Exclude confusing chars for readability
const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 5);

export const generateUniqueId = (prefix: string) => {
  return `${prefix}-${nanoid()}`;
};
