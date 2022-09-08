export type SessionsTableItem = {
  id: string;
  userId: string;
  accessToken: string;
  refreshToken: string;
  created: number;
  expires: number;
};
