<img src="https://cdn.theatlantic.com/assets/media/img/photo/2018/11/photos-companionable-capybaras/c02_142762210/main_900.jpg?1543518717" />

capymail backend
===
> Realtime messaging with <a href="https://www.mailgun.com/">Mailgun</a> and <a href="https://pusher.com/">Pusher</a>.

API for https://github.com/stuartkershaw/capymail-frontend

## Configure

Include a `.env` file with the following environment variables:

```
NODE_ENV=development
SECRET={ your random string }
API_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:4000
MONGODB_URI=mongodb://localhost/dev
MAILGUN_DOMAIN={ your mailgun domain }
MAILGUN_API_KEY={ your mailgun api key }
PUSHER_KEY={ your Pusher key }
PUSHER_APP_ID={ your Pusher app id }
PUSHER_SECRET={ your Pusher secret }
PUSHER_CLUSTER={ your Pusher cluster }
```

## Local
Configure ngrok (or similar) to serve the local API over the internet.
* `ngrok http { API PORT }`

Configure a Catch All route in your mailgain dashboard:
* `ngrok url`/webhooks/mailgun/catchall

## Live
Configure a Catch All route in your mailgain dashboard:
* `API_URL`/webhooks/mailgun/catchall

## Start
* Start the mongodb `npm run dbon`
* Start the API server `npm run start`
