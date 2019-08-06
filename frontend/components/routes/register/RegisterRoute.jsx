import _ from 'lodash';
import PropTypes from 'prop-types';
import axios from 'axios';
import keycode from 'keycode';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
	CMButton, CMInput, CMModal
} from '../../common';
import { LOADING } from '../../../redux/actions';

class RegisterRoute extends React.Component {
	static propTypes = {
		dispatch: PropTypes.func.isRequired,
		history: PropTypes.object.isRequired
	};

	state = {
		username: '',
		password: '',
		showTakenError: false
	};

	submitOnEnter = (event) => {
		if (event.which === keycode.codes.enter) {
			this.register();
			// Remove focus from the active input to forbid the
			// user to enter date while the loading is underway.
			document.activeElement.blur();
		}
	};

	register = () => {
		const { history, dispatch } = this.props;
		const { username, password } = this.state;

		dispatch({ type: LOADING, value: true });

		axios
			.post('/api/create-account', { username, password })
			.then((response) => {
				if (response.data === 'USERNAME_TAKEN') this.setState({ showTakenError: true });
				else history.push('/login');

				dispatch({ type: LOADING, value: false });
			});
	};

	render() {
		const { history } = this.props;
		const { showTakenError, username, password } = this.state;

		const passwordValidations = {
			'Should at least 3 symbols long': _.size(password) > 3,
			'Should contain at least 1 digit': /\d+/g.test(password),
			'Should contain at least 1 letter': /[A-z]+/g.test(password)
		};
		const usernameValidations = {
			'Should be at least 3 symbols long': _.size(username) >= 3,
			'Should be shorter than 12 symbols': _.size(username) < 12
		};

		const passwordValid = _.every(passwordValidations, validation => validation);
		const usernameValid = _.every(usernameValidations, validation => validation);

		return (
			<form className="RegisterRoute">
				<div className="RegisterRoute-tabs">
					<div className="RegisterRoute-tab login" onClick={() => history.push('/login')}>
						Log in
					</div>
					<div className="RegisterRoute-tab register">
						Register
					</div>
				</div>

				<CMInput
					className="RegisterRoute-username-input"
					validations={usernameValidations}
					placeholder="Username"
					onKeyDown={usernameValid && passwordValid ? this.submitOnEnter : null}
					onChange={event => this.setState({ username: event.target.value })}
					autoFocus="autofocus"
					autoComplete="username"
					value={username}
					type="text"
				/>

				<CMInput
					className="RegisterRoute-password-input"
					validations={passwordValidations}
					placeholder="Password"
					autoComplete="new-password"
					onKeyDown={passwordValid && passwordValid ? this.submitOnEnter : null}
					onChange={event => this.setState({ password: event.target.value })}
					value={password}
					type="password"
				/>

				<CMButton
					className="RegisterRoute-submit-button"
					autoComplete="new-password"
					color="blue"
					onClick={this.register}
					disabled={!passwordValid || !usernameValid}
				>
					REGISTER
				</CMButton>
				{
					showTakenError ?
						<CMModal
							type="ERROR"
							header="ERROR"
							onClose={() => this.setState({ showTakenError: false })}
						>
							<div className="RegisterRoute-username-taken-error">
								This username is already taken.
							</div>
						</CMModal> : null
				}
			</form>
		);
	}
}

export default connect()(withRouter(RegisterRoute));
