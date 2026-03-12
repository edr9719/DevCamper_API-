import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5002', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoURI: String(process.env.MONGO_URI),
  GeoProvider: process.env.GEOCODER_PROVIDER,
  GeoAPIKey: process.env.GEOCODER_API_KEY,
} as const;
