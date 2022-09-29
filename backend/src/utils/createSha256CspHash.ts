import crypto from 'crypto';

export const createSha256CspHash = (content: string) =>
  `sha256-${crypto.createHash('sha256').update(content).digest('base64')}`;
