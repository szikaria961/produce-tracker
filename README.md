# Produce Tracker
A small webapp that helps you keep track of your produce by sending you a text message when they're getting closer to expiring.

![Produce Tracker](http://www.sabazikaria.com/images/preview-produce-tracker.gif)


## Requirements

*Technical Requirements*
- `Node.js >= v14`

*Operational*
- Twilio API Access Token

*Hardware*
- Raspberry Pi 3

## Development

### API Access
- You'll need your own Twilio API Credentials. You can go [here](https://www.twilio.com/messaging) to register an application with Twilio API and generate your own `TWILIO_AUTH_TOKEN`, `TWILIO_ACCOUNT_SID` and a `FROM` number, save this value somewhere private for later.

### Installation

```
git clone https://github.com/szikaria961/produce-tracker.git
cd produce-tracker
npm install
cp .example-env .env
```

Open the `.env` file in a text editor of your choice and fill in the `TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID and FROM` value with the token generated from their website.

### Server

```
npm run dev
```

View development app at `http://localhost:8000`

### Testing

```
npm run test
```

## Deployment

### SSH into Raspberry Pi

_* Make sure you have your [Pi setup](https://www.w3schools.com/nodejs/nodejs_raspberrypi.asp)._

Obtain an IP address by running the command below of Ethernet interface, inet6 addr is YOUR IP address.
```
ifconfig eth0
```

The default credentials are:
```
username: pi
password: raspberry
```

On Mac or Linux you can just simply run:
```
ssh pi@192.168.178.73
```

_* make sure you [install Node.js and npm](https://linuxize.com/post/how-to-install-node-js-on-raspberry-pi/) on Raspberry Pi_.

### Clone the project again, but now in your Pi:
```
git clone https://github.com/szikaria961/produce-tracker.git
cd produce-tracker
npm install
cp .example-env .env
```

Open the `.env` file in a text editor of your choice and fill in the `TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID and FROM` value with the token generated from their website.

### Install PM2 to daemanize the application
```
sudo npm install -g pm2
```

Start the application with PM2
```
npm run daemon
```

and you should see
```
[PM2] Applying action restartProcessId on app [produce_tracker](ids: [ 0 ])
[PM2] [produce_tracker](0) ✓
┌─────┬────────────────────┬─────────────┬─────────┬─────────┬──────────┬────────┬──────┬───────────┬──────────┬──────────┬──────────┬──────────┐
│ id  │ name               │ namespace   │ version │ mode    │ pid      │ uptime │ ↺    │ status    │ cpu      │ mem      │ user     │ watching │
├─────┼────────────────────┼─────────────┼─────────┼─────────┼──────────┼────────┼──────┼───────────┼──────────┼──────────┼──────────┼──────────┤
│ 0   │ produce_tracker    │ default     │ 1.0.0   │ fork    │ 26570    │ 0s     │ 151  │ online    │ 0%       │ 21.2mb   │ pi       │ disabled │
└─────┴────────────────────┴─────────────┴─────────┴─────────┴──────────┴────────┴──────┴───────────┴──────────┴──────────┴──────────┴──────────┘
```
Add cron job to receive text messages of expiring produces from Twilio everyday at 10am:
```
crontab -e
```
Add the following:
```
# ┌───────────── minute (0 - 59)
# │ ┌───────────── hour (0 - 23)
# │ │ ┌───────────── day of month (1 - 31)
# │ │ │ ┌───────────── month (1 - 12)
# │ │ │ │ ┌───────────── day of week (0 - 6) (Sunday to Saturday;
# │ │ │ │ │                                       7 is also Sunday on some systems)
# │ │ │ │ │
# │ │ │ │ │
# * * * * *  command_to_execute

# run produce-tracker once a day

0 10 * * 1-7 node /home/pi/github/produce-tracker/scripts/check-produce.js
```

## License

[MIT](https://choosealicense.com/licenses/mit/)