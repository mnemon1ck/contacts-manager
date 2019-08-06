const _ = require('lodash');

// This middleware should be used on all APIs that require the user to be authenticated.
module.exports = (req, res, next) => {
	const { token } = req.cookies;
	const user = _.find(global.gs.users, { token });

	if (user) {
		req.user = user;
		next();
	} else {
		// It is not 500 because this might happen when the user edits the cookie manually, so
		// it is not a programming error and the frontend should handle it instead of crashing.
		res.send('INVALID_TOKEN');
	}
};
