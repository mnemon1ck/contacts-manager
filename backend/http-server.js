const _ = require('lodash');
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../cm.config');

global.app = express();
global.app.use(bodyParser.json());
global.app.use(cookieParser());

global.config = {
	PORT: process.argv[2] || config.PORT,
	SERVER_DELAY: process.argv[3] || config.SERVER_DELAY
};

// Introduce an artificial delay to emulate loading on the frontend side.
if (global.config.SERVER_DELAY !== 0) {
	global.app.use((req, res, next) => setTimeout(next, global.config.SERVER_DELAY));
}

// Require all files dynamically in the '/api' directory, this way when
// a new api is created there would be no need to add a new require statement.
_.each(fs.readdirSync('./backend/api'), path => path.indexOf('.') > -1 ? require(`./api/${path}`) : undefined);

// Serve API and static data from node, in a real world app there most likely would be
// something like nginx in front of the node.
global.app.use(express.static('./dist'));

// If none of the above middlewares handled the request.
global.app.use((req, res) => {
	if (req.url.startsWith('/api')) res.status(500).send('API_DOES_NOT_EXIST');
	else fs.createReadStream('./dist/index.html').pipe(res);
});

global.app.listen(global.config.PORT, () => {
	console.log(`Listening at http://localhost:${global.config.PORT}`) // eslint-disable-line
});

// Global state, in the real world application it would be stored in a database.
global.gs = {
	users: []
};
