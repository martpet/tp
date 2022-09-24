export type SessionsTableItem = {
  id: string;
  userId: string;
  created: number;
  idToken: string;
  refreshToken: string;
  refreshTokenExpires: number;
};
