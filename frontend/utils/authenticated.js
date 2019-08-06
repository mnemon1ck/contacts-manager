import cookies from 'js-cookie';
import { store } from '../redux';
import { LOGOUT } from '../redux/actions';

// A high order function which handles the INVALID_TOKEN error.
export default function (fn) {
	return function (response) {
		if (response.data === 'INVALID_TOKEN') {
			// User has invalid credentials in the cookie, it might've happened
			// because the user manually edited the token in chrome dev tools.
			cookies.remove('token');
			store.dispatch({ type: LOGOUT });
		} else fn(response);
	};
}
