## Testing out nsq, with client nsqjs. nsqd, nsqadmin, nsqlookupd via docker.

## How to start

First you need to add host.docker.internal to your /etc/hosts
```bash
127.0.0.1 host.docker.internal
```

Run express
```bash
yarn install
node server.js
```

Run docker
```bash
docker-compose up -d
```

Open terminal then try to create a post request to your topic
```bash
curl --location --request POST 'http://localhost:4151/pub?topic=test' \
--header 'Content-Type: text/plain' \
--data-raw '{
	"text": "some message"
}'
```
