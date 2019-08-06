import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import cookies from 'js-cookie';
import { LOGOUT } from '../redux/actions';

class Header extends React.Component {
	static propTypes = {
		isAuthenticated: PropTypes.bool.isRequired,
		username: PropTypes.string,
		history: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	};

	static defaultProps = {
		username: null
	};

	logout = () => {
		const { history, dispatch } = this.props;
		cookies.remove('token');
		dispatch({ type: LOGOUT });
		history.push('/login');
	};

	render() {
		const { isAuthenticated, username } = this.props;

		return (
			<div className="Header">
				<div className="Header-logo">Contacts Manager</div>
				{
					isAuthenticated ?
						<div className="Header-logout" onClick={this.logout}>
							<span>Log out </span>
							<small>
								<i>{`(${username})`}</i>
							</small>
						</div> : null
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({
	isAuthenticated: !!state.currentUser,
	username: state.currentUser ? state.currentUser.username : null
});

export default connect(mapStateToProps)(withRouter(Header));
