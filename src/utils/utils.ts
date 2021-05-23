import crypto from 'crypto';

export const hashPassword = (password: string) => {
  const hashPassword = crypto
    .createHash('sha256')
    .update(password)
    .digest('hex');
  return hashPassword;
};
