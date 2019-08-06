const authenticated = require('./common/middlewares/authenticated');

global.app.post('/api/get-current-user', authenticated, (req, res) => res.send({
	username: req.user.username,
	contacts: req.user.contacts
}));
