import nsq from 'nsqjs';

/**
 * Function to publish message to topic
 * @param subnetip 
 */
export default function writeMessage (subnetip: String): void {
	const w = new nsq.Writer('host.docker.internal', 4150, {});

	console.log('========================================');
	console.log(`[NSQ] - Publish msg to topic: `, subnetip);
	w.connect();

	w.on('ready', () => {
		w.publish('geoloc_ip_subnet', `${subnetip}.1`,  err => {
			if (err) { 
				return console.error(err.message)
			}

			console.log('[NSQ] - Message sent successfully')
			w.close()
		})
	});

	w.on('closed', () => {
		console.log('[NSQ] - Closed writer connection')
	});
};