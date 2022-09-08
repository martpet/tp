const oauth = (part: string) => `/oauth2/${part}`;

export const authPaths = {
  token: oauth('token'),
  authorize: oauth('authorize'),
  revoke: oauth('revoke'),
  logout: '/logout',
};
