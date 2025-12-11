/**
 * Generates a unique username based on a prefix and current timestamp.
 * @param prefix The prefix for the username.
 * @returns A unique username string.
 */
export const generateUniqueUsername = (prefix: string = 'user'): string => {
  return `${prefix}${Date.now()}`;
};

/**
 * Generates a unique email address.
 * @param prefix The prefix for the email.
 * @returns A unique email string.
 */
export const generateUniqueEmail = (prefix: string = 'test'): string => {
  return `${prefix}${Date.now()}@example.com`;
};

/**
 * Generates a random phone number with a given prefix.
 * @param prefix The prefix for the phone number (default: '021').
 * @returns A random phone number string.
 */
export const generateRandomPhone = (prefix: string = '021'): string => {
  const randomDigits = Math.floor(1000000 + Math.random() * 9000000); // 7 digits
  return `${prefix}${randomDigits}`;
};
