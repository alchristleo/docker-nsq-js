// import { Model, DataTypes } from 'sequelize';
import Models from '..';
import { GeolocModel } from './interface';

/**
 * Operation to insert data to db
 * @param jsonData 
 */
export async function addGeolocData (jsonData: GeolocModel): Promise<any> {
	const {
		ip,
		regionName,
		city,
		district,
		zip,
		lon,
		lat,
		isp,
	} = jsonData;

	/**
	 * record [array] array of data
	 * created means new row inserted
	 */
	await Models.Geoloc.upsert(
		{
			ip: ip,
			regionName: regionName,
			city: city,
			district: district,
			zip: zip,
			longitude: lon,
			latitude: lat,
			isp: isp

		},
		{ returning: true }
	)
	.then((value): [Object, boolean] => {
		if (value[1]) {
			console.log('[UPSERT OPERATION] - NOT FOUND ANY UNIQUE CONSTRAINT KEY');
			console.log('[UPSERT OPERATION] - SUCCESS INSERTING NEW ROW!')
		} else {
			console.log('[UPSERT OPERATION] - FOUND UNIQUE CONSTRAINT KEY');
			console.log('[UPSERT OPERATION] - SUCCESS UPDATING DATA!')
		}
		return value;
	})
	.catch(err => {
		console.error('[UPSERT OPERATION] - FAILED')
		console.error(err);
	});
}