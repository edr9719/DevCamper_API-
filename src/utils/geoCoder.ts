import NodeGeocoder from 'node-geocoder';
import { config } from '../config';

const options: NodeGeocoder.Options = {
  provider: (config.GeoProvider as NodeGeocoder.Providers) || 'mapquest',
  apiKey: config.GeoAPIKey,
  formatter: null,
};

export const geocoder = NodeGeocoder(options);
