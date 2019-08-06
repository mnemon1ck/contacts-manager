import axios from 'axios';
import cookies from 'js-cookie';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	Redirect, Switch, Route, withRouter
} from 'react-router-dom';
import Header from './Header';
import { RegisterRoute, ContactsRoute, LoginRoute } from './routes';
import { CMPrivateRoute, CMPublicRoute, CMLoader } from './common';
import { authenticated } from '../utils';
import {
	CURRENT_USER
} from '../redux/actions';

class App extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		loading: PropTypes.bool.isRequired,
		currentUser: PropTypes.object
	};

	static defaultProps = {
		currentUser: null
	};

	componentDidMount() {
		const { dispatch } = this.props;
		const token = cookies.get('token');

		// Before the app starts user needs to be authenticated if he has credentials.
		if (token) {
			axios
				.post('/api/get-current-user')
				.then(authenticated(response => dispatch({ type: CURRENT_USER, data: response.data })));
		}
	}

	render() {
		const token = cookies.get('token');
		const { loading, currentUser } = this.props;

		// If a token is present we need to authenticate the user first.
		if (token && currentUser === null) return <CMLoader />;

		return (
			<div className="App">
				<Header />
				<div className="App-body">
					<Switch>
						<CMPrivateRoute path="/contacts" component={ContactsRoute} />
						<CMPublicRoute path="/login" component={LoginRoute} />
						<CMPublicRoute path="/register" component={RegisterRoute} />
						<Route
							render={() => { // eslint-disable-line
								// When the user hits any other URL he should be redirected.
								return currentUser ?
									<Redirect to="/contacts" /> :
									<Redirect to="/login" />;
							}}
						/>
					</Switch>
				</div>
				{loading ? <CMLoader /> : null}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	currentUser: state.currentUser,
	loading: state.loading
});

export default connect(mapStateToProps)(withRouter(App));
