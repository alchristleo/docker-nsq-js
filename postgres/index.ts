import { Sequelize, Model, DataTypes } from 'sequelize';
import { config } from '../config/config';

const c = config.development.db;

const sequelize = new Sequelize(`postgres://${c.username}:${c.password}@host.docker.internal:5432/${c.database}`);

class Geoloc extends Model {
	public ip!: string;
	public regionName!: string;
	public city!: string;
	public district: string;
	public zip: string;
	public longitude: Float32Array;
	public latitude: Float32Array;
	public isp: string;

	// timestamp
	public readonly createdAt!: Date;
	public readonly updatedAt!: Date;
}

Geoloc.init({
        ip: { type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false },
	regionName: { type: DataTypes.STRING, allowNull: false },
	city: { type: DataTypes.STRING, allowNull: false },
	district: { type: DataTypes.STRING, allowNull: true },
	zip: { type: DataTypes.STRING, allowNull: true },
	longitude: { type: DataTypes.FLOAT, allowNull: true },
	latitude: { type: DataTypes.FLOAT, allowNull: true },
	isp: { type: DataTypes.STRING, allowNull: true }
}, { sequelize, tableName: 'tl_geoloc' });


sequelize.models.Geoloc;

export default { sequelize, Geoloc };
