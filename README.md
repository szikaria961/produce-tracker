# Produce Tracker

A small webapp that helps you keep track of the shelf-life of your produces.

## Development

### API Access
- Go to Twilio to generate TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID and FROM number Twilio API.

### Installation

```
git clone https://github.com/szikaria961/produce-tracker.git
cd produce-tracker
npm install
cp .example-env .env
```

Open the `.env` file in your text editor of choice and fill in the `TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID and FROM` value with the token generated from their website.

### Server

```
npm run dev
```

View development app at `http://localhost:8000`
