const _ = require('lodash');
const authenticated = require('./common/middlewares/authenticated');

global.app.post('/api/edit-contact', authenticated, (req, res) => {
	const { comment, name, phone } = req.body;

	if (_.size(name) < 3) return res.status(500).send('NAME_TOO_SHORT');
	if (_.size(name) > 100) return res.status(500).send('NAME_TOO_LONG');

	if (_.size(phone) !== 8) return res.status(500).send('INVALID_PHONE_LENGTH');
	if (!/^\d+$/.test(phone)) return res.status(500).send('INVALID_PHONE_FORMAT');

	const contact = _.find(req.user.contacts, { id: req.body.id });
	if (!contact) return res.send('CONTACT_NOT_FOUND');

	contact.phone = phone;
	contact.name = name;
	contact.comment = comment;

	return res.send(contact);
});
