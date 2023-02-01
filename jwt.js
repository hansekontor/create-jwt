const jwt = require('jsonwebtoken');
const jwa = require('jwa');
const crypto = require('crypto');
const  { decodeSubjectChain, encodeSubject } = require('relay-jwt');
require('dotenv').config();

// create key pair
const algorithm = 'ES256';
const ecdsa = jwa(algorithm);

let privateKey, publicKey;

if (process.env.PRIVKEY && process.env.PUBKEY) {
    privateKey = JSON.parse(process.env.PRIVKEY).privateKey;
    publicKey = JSON.parse(process.env.PUBKEY).publicKey;
} else {
    const keyPair = crypto.generateKeyPairSync( 'ec', {
        namedCurve: 'secp256k1',
        'publicKeyEncoding': {
            'type': 'spki',
            'format': 'pem'
        },
        'privateKeyEncoding': {
            'type': 'pkcs8',
            'format': 'pem'
        }
    });
    privateKey = keyPair.privateKey;
    publicKey = keyPair.publicKey;
    console.log("New keypair has been created. Save them if needed.");
    console.log(JSON.stringify({publicKey: keyPair.publicKey}));
    console.log(JSON.stringify({privateKey: keyPair.privateKey}));
}

// create token
const previousDecoded = jwt.decode(process.env.JWT_UPSTREAM); 
console.log("Previous token being used:", previousDecoded);
const chainParams = [
    {
        type: process.env.TYPE, // 0 = percentage, 1 = fixed
        amount: process.env.AMOUNT //  Int - If percentage, amount/1000 / if fixed, base units 
    }
];
const subParams = {
    version: 1, // Int - 1 is standard
    type: chainParams[0].type,
    amount: chainParams[0].amount,
    publicKey, // PEM encoded string
    previous: previousDecoded.sub
};
const subject = encodeSubject(subParams, privateKey, ecdsa.sign).toString("base64");
const token = jwt.sign({}, privateKey, { 
    algorithm,
    subject,
    audience: process.env.AUDIENCE,
    issuer: process.env.ISSUER
});
console.log("New token has been created:", token);
