import { GetSecretValueCommand, SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { ManagerResponse } from './ManagerResponse';

export const getEnvSecretName = (name: string | undefined) => {
  if (!name || name.trim().length === 0) {
    throw new Error('Secret name was not provided with a value');
  }
  return name;
};

export const getEnvSecrets = async (secretName: string): Promise<ManagerResponse> => {
  const response = await new SecretsManagerClient().send(
    new GetSecretValueCommand({
      SecretId: getEnvSecretName(secretName),
    }),
  );

  return JSON.parse(<string>response.SecretString);
};
