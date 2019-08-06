import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import cookies from 'js-cookie';
import PropTypes from 'prop-types';

export default function CMPrivateRoute({ component: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) => {
				const token = cookies.get('token');
				return token ?
					<Component {...props} /> :
					<Redirect to={{ pathname: '/login' }} />;
			}}
		/>
	);
}

CMPrivateRoute.propTypes = {
	component: PropTypes.object.isRequired
};
