import "@babel/polyfill"
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import Model from '../postgres';
import readMessage from '../nsq/readTopic';
import writeMessage from '../nsq/writeTopic';

const app = express();
const port: Number = 3000;

// func init main
const main = async () => {
	await Model.sequelize.sync();
	readMessage();

	app.use(bodyParser.json());

	app.post('/subnet', (req: Request, res: Response) => {
		const subnetip = req.body.subnetip;
		console.log('=========================================');
		console.log('[API] - Receive post request with subnetip: ', subnetip);

		writeMessage(subnetip);
		res.json({ ok: true, body: req.body, type: 'index' });
	});

	app.listen(port, () => console.log(`Server is listening on port ${port}!`));
};

main();