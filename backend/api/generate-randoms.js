const _ = require('lodash');
const faker = require('faker');
const authenticated = require('./common/middlewares/authenticated');

global.app.post('/api/generate-randoms', authenticated, (req, res) => {
	const { user } = req;

	for (let i = 0; i < 10; i += 1) {
		const id = _.isEmpty(user.contacts) ? 0 : _.last(user.contacts).id + 1;
		const date = faker.date.past().getTime();
		const name = faker.name.findName();
		const phone = Math.floor(Math.random() * 10000000000).toString().slice(0, 8);
		const comment = faker.lorem.sentence();

		user.contacts.push({ id, name, date, phone, comment });
	}

	res.send(user.contacts);
});
