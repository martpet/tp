export type CognitoIdentity = {
  userId: string;
  providerName: string;
  providerType: string;
  primary: boolean;
  dateCreated: number;
};
