## Geoloc project

### Prerequisite
- Docker
- Node
- Your favorite postgre rdms

![Alt text](diagram.png?raw=true "Image 1")

## How It Works
- Basically our express app will init postgres connection and postgres models
- Our nsqjs library will be init on start up and immediately listen to specific topic that we defined
- Also we will expose our local express endpoint `/subnet` that is running in port 3000, this endpoint will receive a post request with request body the subnet ip.
- After that we will push the subnet ip as json format and we will use our nsqjs client to publish the topic into our nsq server
- Once the topic published, our nsqjs that already listen to that topic will consume the message.
- We will use this message to fetch some data from 3rd party.
- if response was successful then we will use UPSERT operation to insert the data to our postgre db.
- if response was not successful then we will just requeue the nsq message.
- To ensure our system is fully reliable if our endpoint rps is high, you can try this locally by executing the `test.sh`, this script will try to curl our endpoint with unique subnet `xxx.xxx.(1-100)` as req.body.
```bash
test.sh
```

## How to start

### There are 2 ways to start the app

#### You can use docker, the docker-compose yml is provided. 
First you need to add `host.docker.internal` to your `/etc/hosts`
```bash
127.0.0.1 host.docker.internal
```

Then run as a background service:
```bash
docker-compose up -d
```

Check if our client already running well.
```bash
docker logs <CONTAINER_NAME> --tail 100
```
If server is successfully listening to port 3000 then it is already successful.

#### Second option is to run it locally.
You need to change all of the host `host.docker.internal` back to `localhost` in all of the `.ts` file.
Then install manually and start express server
```bash
yarn install
yarn dev
```

#### Setting up postgres connection
In order to bootstrap the database system, a freshly initialized system always contains one predefined role. This role is always a "superuser", and by default (unless altered when running initdb) it will have the same name as the operating system user that initialized the database cluster. Customarily, this role will be named `postgres`. In order to create more roles you first have to connect as "superuser" initial role. If error occured on your postgres, eg: role `alchrist` does not exist. Then you need to add new role manually.

```bash
$ docker exec -it <POSTGRES_CONTAINER_NAME> bash
```
In order to create a new role, first we need to login using superuser in psql cli
```bash
$ psql postgres -U postgres
```
Now we can create new role
```bash
$ CREATE ROLE alchrist WITH LOGIN PASSWORD '168';
$ ALTER ROLE ALCHRIST CREATEDB;
$ \q
```
Try login with new role just created.
```bash
$ psql postgres -U alchrist
```
Now we can access our postgres using any RDMS with config below:
```bash
Host: localhost
Port: 5432
Username: alchrist
Password: 168
Database: locationdb
```

*Just up your docker compose again if your pg setup already running well. 
```bash
docker-compose up -d
```

#### Verify if nsq already running
Try bashing
```bash
curl --location --request POST 'http://localhost:4151/pub?topic=test' \
--header 'Content-Type: text/plain' \
--data-raw '{
	"text": "some message"
}'
```
If it returns `OK` then your topic has been successfully created, to verify it you can open in nsqdamin ui http://localhost:4171/topics/test

### Glossary
- UPSERT? It stands for `INSERT ... ON CONFLICT UPDATE` [wiki](https://wiki.postgresql.org/wiki/UPSERT) this will ensure that our table has no duplicate UNIQUE key. If unique key already exists, we just update the other field value, if not exist, new row will be created.
