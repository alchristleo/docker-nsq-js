import { Model } from 'sequelize';

export interface GeolocModel extends Model {
        ip?: string;
        regionName?: string;
        city?: string;
        district: string;
        zip: string;
        lon: string;
        lat: string;
        isp: string;
}