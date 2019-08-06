const _ = require('lodash');
const uuidv4 = require('uuid/v4');

global.app.post('/api/create-token', (req, res) => {
	const { username, password } = req.body;
	const user = _.find(global.gs.users, { username, password });

	if (!user) return res.send('INVALID_CREDENTIALS');

	user.token = uuidv4();
	return res.send({ token: user.token });
});
