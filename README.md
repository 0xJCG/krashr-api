# Krashr API

A new repository to improve the Krashr API. If you want to check the original project, you can go to: https://github.com/0xJCG/tfg-krashr.

## Getting started and running the application

This API runs using Node.js and a MongoDB database. First of all, it is necessary to install Node.js, npm and MongoDB:

```
sudo apt-get install nodejs npm mongodb
```

The API needs the MongoDB server to be running to work:

```
mongod --smallfiles
```

Once initiated, the API can be initiated:

```
cd krashr-api
npm install
node app.js
```

## Future improvements

* Improve the API authentication using Passport and OAuth2.
* Activate HTTPS.
