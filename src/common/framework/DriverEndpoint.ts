export const getDriverBaseEndpoint = (): string => process.env.BASE_DRIVER_URL || '';

export const getDriverAPIKey = (): string => process.env.API_KEY || '';
