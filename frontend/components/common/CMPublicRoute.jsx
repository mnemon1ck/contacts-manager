import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import cookies from 'js-cookie';
import PropTypes from 'prop-types';

export default function CMPublicRoute({ component: Component, ...rest }) {
	return (
		<Route
			{...rest}
			render={(props) => {
				const token = cookies.get('token');
				return token ?
					<Redirect to={{ pathname: '/contacts' }} /> :
					<Component {...props} />;
			}}
		/>
	);
}

CMPublicRoute.propTypes = {
	component: PropTypes.object.isRequired
};
