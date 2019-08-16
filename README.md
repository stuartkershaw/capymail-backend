<img src="https://cdn.theatlantic.com/assets/media/img/photo/2018/11/photos-companionable-capybaras/c02_142762210/main_900.jpg?1543518717" />

capymail backend
===
> Realtime messaging with mailgun and socket.io

## Configure

Include a `.env` file with the following environment variables:

```
CORS_ORIGIN=http://localhost:8080
MAILGUN_API_KEY={your mailgun api key}
MAILGUN_DOMAIN={your mailgun domain}
MONGODB_URI=mongodb://localhost/dev
NODE_ENV=development
SECRET={a random string}
```

Configure a Catch All route in your mailgain dashboard:
* {your API_URL} /webhooks/mailgun/catchall

## Start

* Start the mongodb `npm run dbon`
* Start the API server `npm run api_start`
