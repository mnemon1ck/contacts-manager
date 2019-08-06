const _ = require('lodash');
const moment = require('moment');
const authenticated = require('./common/middlewares/authenticated');

global.app.post('/api/create-contact', authenticated, (req, res) => {
	const { comment, name, phone } = req.body;

	if (_.size(name) < 3) return res.status(500).send('NAME_TOO_SHORT');
	if (_.size(name) > 100) return res.status(500).send('NAME_TOO_LONG');

	if (_.size(phone) !== 8) return res.status(500).send('INVALID_PHONE_LENGTH');
	if (!/^\d+$/.test(phone)) return res.status(500).send('INVALID_PHONE_FORMAT');

	if (comment === undefined) return res.status(500).send('COMMENT_REQUIRED');

	req.user.contacts.push({
		id: _.isEmpty(req.user.contacts) ? 0 : _.last(req.user.contacts).id + 1,
		name,
		phone,
		comment,
		date: moment().valueOf()
	});

	return res.send(_.last(req.user.contacts));
});
