import _ from 'lodash';
import { createStore } from 'redux';
import {
	LOGIN,
	LOADING,
	LOGOUT,
	ADD_CONTACT,
	DELETE_CONTACT,
	EDIT_CONTACT,
	EDIT_FILTER,
	SORTING,
	CURRENT_USER,
	CONTACTS
} from './actions';

const initialState = {
	loading: false,
	currentUser: null,
	contacts: [],
	filters: {
		name: '',
		phone: '',
		comment: '',
		date: ''
	},
	sorting: 'NAME_ASC'
};

export default createStore((state = initialState, action) => {
	if (action.type === LOGIN) {
		return {
			...state,
			loading: false,
			currentUser: {
				username: action.data.username
			},
			contacts: action.data.contacts
		};
	}

	if (action.type === LOADING) {
		return {
			...state,
			loading: action.value
		};
	}

	if (action.type === LOGOUT) {
		return initialState;
	}

	if (action.type === ADD_CONTACT) {
		return {
			...state,
			contacts: [...state.contacts.concat(action.contact)],
			loading: false
		};
	}

	if (action.type === DELETE_CONTACT) {
		return {
			...state,
			contacts: [..._.reject(state.contacts, { id: action.id })],
			loading: false
		};
	}

	if (action.type === EDIT_CONTACT) {
		const contact = _.find(state.contacts, { id: action.contact.id });
		contact.phone = action.contact.phone;
		contact.name = action.contact.name;
		contact.comment = action.contact.comment;
		return {
			...state,
			contacts: [...state.contacts],
			loading: false
		};
	}

	if (action.type === EDIT_FILTER) {
		return {
			...state,
			filters: {
				...state.filters,
				[action.name]: action.value
			}
		};
	}

	if (action.type === SORTING) {
		return {
			...state,
			sorting: action.value
		};
	}

	if (action.type === CURRENT_USER) {
		return {
			...state,
			loading: false,
			currentUser: {
				username: action.data.username
			},
			contacts: action.data.contacts
		};
	}

	if (action.type === CONTACTS) {
		return {
			...state,
			contacts: action.data,
			loading: false
		};
	}

	return state;
});
