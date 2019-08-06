const _ = require('lodash');
const authenticated = require('./common/middlewares/authenticated');

global.app.post('/api/delete-contact', authenticated, (req, res) => {
	if (typeof req.body.id !== 'number') return res.status(500).send('INVALID_ID');
	const contact = _.find(req.user.contacts, { id: req.body.id });
	if (!contact) return res.status(500).send('CONTACT_NOT_FOUND');
	req.user.contacts = _.reject(req.user.contacts, { id: req.body.id });
	return res.send('SUCCESS');
});
