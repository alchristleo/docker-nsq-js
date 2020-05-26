
import axios from 'axios';
import { config } from '../config/config';
import { addGeolocData } from '../postgres/controllers/addGeolocData';

const c = config.development.ep;

/**
 * Function to fetch data from 3rd party
 * @param ip 
 */
export default async function getLocationDataFromAPI(ip: String): Promise<any> {
        return axios
                .get(`${c.url}${ip}?fields=${c.fields}`, {
                        headers: {
                                Origin: 'https://ip-api.com',
                                Referer: 'https://ip-api.com/docs/api:json',
                                'Sec-Fetch-Mode': 'cors'

                        }
                })
                .then(async result => {
                        if (result.status === 200) {
                                console.log('[IP-API] - Fetch data success!');
                                await addGeolocData({ ip, ...result.data});

                                return result;
                        } 

                        return result;
                })
                .catch(error => {
                        const err = new Error(error.message);
                        console.log('[IP-API] - Fetch data error', err);

                        return;
                });
};