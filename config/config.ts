import dotenv from 'dotenv';

dotenv.config();

export const config = {
        "development": {
                db: {
                        "username": process.env.postgres_user,
                        "password": process.env.postgres_password,
                        "database": process.env.postgres_db,
                },
                ep: {
                        "url": process.env.ep_url,
                        "fields": process.env.ep_fields
                },
                nsq: {
                        "topic": String(process.env.nsq_topic),
                        "channel": String(process.env.nsq_channel)
                }
        }
      
}