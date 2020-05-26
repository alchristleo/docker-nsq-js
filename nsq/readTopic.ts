import nsq from 'nsqjs';
import { config } from '../config/config';
import getLocationDataFromAPI from '../api/handler';

const c = config.development.nsq;

/**
 * Function to read topic
 */
const readMessage = (): void => {
	const reader = new nsq.Reader(c.topic, c.channel, {
		lookupdHTTPAddresses: 'host.docker.internal:4161'
	});

	console.log('==========================');
	console.log(`[NSQ] - Connecting to NSQ!`);
	reader.connect();

	reader.on('message', async msg => {
		const ip = msg.body.toString();
		console.log('[NSQ] - Received message [%s]: %s', msg.id, msg.body.toString());

		console.log('============================');
		console.log('[UPSERT OPERATION] - BEGIN UPSERT OPERATION');
		const result = await getLocationDataFromAPI(ip);

		if (result) {
			msg.finish();
			console.log('[NSQ] - Closed reader connection')
		} else {
			// Requeuing message until we notify nsq if the message has been handled.
			msg.requeue(5000, false);
		}
	});
};

export default readMessage;