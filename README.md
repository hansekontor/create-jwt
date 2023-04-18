# create-jwt

You should create a JWT for each downstream Relay or merchant connected to your Relay server. Each JWT contains the fees which are added to payment requests sent through the related Relay network.

Follow the relay-jwt protocol, outlined (here)[https://github.com/bux-digital/documentation/blob/main/relay-jwt.md].

* install modules using `npm install`
* initialize your .env file with `cp sample_env .env`
* place your upstream JWT in JWT_UPSTREAM, set TYPE, AMOUNT, AUDIENCE, ISSUER and save the file.
* run `sudo node jwt.js` to receive a keypair. It should be saved to the .env file. With that keypair, a new JWT has been created based on your settings. 
* test the JWT by placing the public key used to create it in the .env file of your relay server. This will be the public key used to verify incoming JWT requests.
* store the created JWT and keypairs safely, and give it out to its audience.

If you have stored your keypair in the JWT .env file, you can repeat steps 2-5 with different fee settings. 
