export const getGrantType = (): string => process.env.GRANT_TYPE || '';

export const getScope = (): string => process.env.SCOPE || '';

export const getClientID = (): string => process.env.CLIENT_ID || '';

export const getClientSecret = (): string => process.env.CLIENT_SECRET || '';

export const getTokenURL = (): string => process.env.TOKEN_ENDPOINT || '';
