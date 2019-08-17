<img src="https://cdn.theatlantic.com/assets/media/img/photo/2018/11/photos-companionable-capybaras/c02_142762210/main_900.jpg?1543518717" />

capymail backend
===
> Realtime messaging with mailgun and socket.io

## Configure

Include a `.env` file with the following environment variables:

```
SECRET={a random string}
CORS_ORIGIN=http://localhost:4000
MONGODB_URI=mongodb://localhost/dev
MAILGUN_DOMAIN={your mailgun domain}
MAILGUN_API_KEY={your mailgun api key}
NODE_ENV=development
API_URL=http://localhost:8000
```

Configure a Catch All route in your mailgain dashboard:
* `API_URL`/webhooks/mailgun/catchall

## Start

* Start the mongodb `npm run dbon`
* Start the API server `npm run start`
