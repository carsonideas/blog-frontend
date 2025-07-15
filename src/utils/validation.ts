/**
 * my email validation using a regular expression
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * my preser Password validation rules:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * - Contains at least one special character
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

/**
 * my Username validation rules:
 * - Between 3 and 20 characters long
 * - Contains only alphanumeric characters and underscores
 * - Starts with a letter
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{2,19}$/;
  return usernameRegex.test(username);
};

/**
 * my name validation rules:
 * - Between 2 and 50 characters long
 * - Contains only letters, spaces, hyphens, and apostrophes
 */
export const isValidName = (name: string): boolean => {
  const nameRegex = /^[A-Za-z\s'-]{2,50}$/;
  return nameRegex.test(name);
};

/**
 * Blog title validation rules:
 * - Between 3 and 100 characters long
 * - Not just whitespace
 */
export const isValidBlogTitle = (title: string): boolean => {
  const trimmedTitle = title.trim();
  return trimmedTitle.length >= 3 && trimmedTitle.length <= 100;
};

/**
 * Blog content validation rules:
 * - At least 100 characters long
 * - Not just whitespace
 */
export const isValidBlogContent = (content: string): boolean => {
  const trimmedContent = content.trim();
  return trimmedContent.length >= 10;
};