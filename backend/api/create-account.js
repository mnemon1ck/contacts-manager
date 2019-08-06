const _ = require('lodash');

global.app.post('/api/create-account', (req, res) => {
	const { password, username } = req.body;

	if (password.length < 3) return res.status(500).send('PASSWORD_TOO_SHORT');
	if (!/\d+/g.test(password)) return res.status(500).send('NO_DIGIT_IN_PASSWORD');
	if (!/[A-z]+/g.test(password)) return res.status(500).send('NO_LETTER_IN_PASSWORD');

	const usernameTaken = _.some(global.gs.users, { username });
	if (usernameTaken) return res.send('USERNAME_TAKEN');

	const user = {
		id: _.size(global.gs.users) + 1,
		username,
		password,
		contacts: [],
		hasDummies: false
	};

	global.gs.users.push(user);
	return res.send(user);
});
