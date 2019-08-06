import _ from 'lodash';
import axios from 'axios';
import keycode from 'keycode';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import cookies from 'js-cookie';
import { connect } from 'react-redux';
import {
	CMButton, CMInput, CMModal
} from '../../common';
import {
	LOADING,
	CURRENT_USER,
	LOGOUT
} from '../../../redux/actions';

class LoginRoute extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired
	};

	state = {
		username: '',
		password: '',
		invalidCredentials: false
	};

	submitOnEnter = (event) => {
		if (event.which === keycode.codes.enter) {
			this.login();
			// Remove focus from the active input to forbid the
			// user to enter date while the loading is underway.
			document.activeElement.blur();
		}
	};

	login = () => {
		const { dispatch } = this.props;
		const { username, password } = this.state;

		dispatch({ type: LOADING, value: true });

		axios
			.post('/api/create-token', { username, password })
			.then((response) => {
				if (response.data === 'INVALID_CREDENTIALS') return 'INVALID_CREDENTIALS';

				cookies.set('token', response.data.token);
				// Not adding "authenticated" middleware, because there is
				// no way an invalid token can be returned from the backend.
				return axios.post('/api/get-current-user');
			})
			.then((response) => {
				if (response === 'INVALID_CREDENTIALS') {
					this.setState({ invalidCredentials: true });
					dispatch({ type: LOADING, value: false });
				} else {
					dispatch({ type: CURRENT_USER, data: response.data });
				}
			});
	};

	logout = () => {
		const { dispatch } = this.props;

		cookies.remove('username');
		cookies.remove('password');

		dispatch({ type: LOGOUT });
	};

	render() {
		const { username, password, invalidCredentials } = this.state;
		const { history } = this.props;

		return (
			<form className="LoginRoute">
				<div className="LoginRoute-tabs">
					<div className="LoginRoute-tab login">Log in</div>
					<div
						className="LoginRoute-tab register"
						onClick={() => history.push('/register')}
					>
						Register
					</div>
				</div>

				<CMInput
					className="LoginRoute-username-input"
					placeholder="Username"
					onKeyDown={this.submitOnEnter}
					onChange={event => this.setState({ username: event.target.value })}
					autoFocus="autofocus"
					value={username}
					type="text"
				/>

				<CMInput
					className="LoginRoute-password-input"
					placeholder="Password"
					onKeyDown={this.submitOnEnter}
					onChange={event => this.setState({ password: event.target.value })}
					value={password}
					type="password"
				/>

				<CMButton
					className="LoginRoute-submit-button"
					color="blue"
					onClick={this.login}
					disabled={_.isEmpty(username) || _.isEmpty(password)}
				>
					LOG IN
				</CMButton>

				{
					invalidCredentials ?
						<CMModal
							type="ERROR"
							header="ERROR"
							onClose={() => this.setState({ invalidCredentials: false })}
						>
							<div className="LoginRoute-invalid-credentials">
								Invalid credentials.
							</div>
						</CMModal> : null
				}
			</form>
		);
	}
}

export default connect()(withRouter(LoginRoute));
