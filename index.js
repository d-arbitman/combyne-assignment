'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

// for JSON request payloads
app.use(bodyParser.json());

// add API routes
routes(app);

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`Server listening on ${port}`);
