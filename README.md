####

The server has an authentication mechanism in order not to
expose API to the unintended users. Therefore, make sure you have
set `CDTP_USERNAME` and `CDTP_PASSWORD` environment variables on both
client and server side.

## Server
Make sure you have `Node.js`, `npm` and `MongoDB` installed. 
Run `npm i` to install dependencies.

Run below command to start server. It will listen from port 3000.
```commandline
npm run start
```

The recommended way is deploying the server behind of a reverse proxy 
engine like Apache or Nginx.

## Client
Make sure you have `Python 3.7 or above` installed. 
Run `pip install -r requirements.txt` to install dependencies.

Set the environment variable `CDTP_SERVER` to your server IP address. 
The client will communicate with arduino over serial port called "COM1".

`python3 client.py`