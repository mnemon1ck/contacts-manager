import _ from 'lodash';
import axios from 'axios';
import keycode from 'keycode';
import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
	CMButton, CMModal, CMInput, CMTextArea
} from '../../common';
import { authenticated } from '../../../utils';
import {
	LOADING,
	ADD_CONTACT
} from '../../../redux/actions';

class CreateContactModal extends React.Component {
	static propTypes = {
		onClose: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired
	};

	state = {
		name: '',
		phone: '',
		comment: ''
	};

	submit = () => {
		const { dispatch, onClose } = this.props;
		const { name, phone, comment } = this.state;

		dispatch({ type: LOADING, value: true });

		axios
			.post('/api/create-contact', { name, phone, comment })
			.then(authenticated((response) => {
				dispatch({ type: ADD_CONTACT, contact: response.data });
				onClose();
			}));
	};

	submitOnEnter = (event) => {
		if (event.which === keycode.codes.enter) {
			this.submit();
			// Remove focus from the active input to forbid the
			// user to enter date while the loading is underway.
			document.activeElement.blur();
		}
	};

	render() {
		const { onClose } = this.props;
		const { phone, name, comment } = this.state;

		const nameValidations = {
			'Should be at least 3 symbols long': _.size(name) >= 3,
			'Should be shorter than 100 symbols': _.size(name) < 12
		};

		const phoneValidations = {
			'Should contain only numbers': /^\d*$/.test(phone),
			'Should be exactly 8 characters long': _.size(phone) === 8
		};

		const isNameValid = _.every(nameValidations, validation => validation);
		const isPhoneValid = _.every(phoneValidations, validation => validation);

		return (
			<CMModal header="CREATE CONTACT" onClose={onClose}>
				<div className="CreateContactModal">
					<CMInput
						className="CreateContactModal-name-input"
						value={name}
						validations={nameValidations}
						autoFocus="autofocus"
						onChange={event => this.setState({ name: event.target.value })}
						onKeyDown={this.submitOnEnter}
						placeholder="Name"
						type="text"
					/>

					<CMInput
						className="CreateContactModal-phone-input"
						validations={phoneValidations}
						value={phone}
						onChange={event => this.setState({ phone: event.target.value })}
						onKeyDown={this.submitOnEnter}
						placeholder="Phone"
						type="text"
					/>

					<CMTextArea
						className="CreateContactModal-comment-input"
						value={comment}
						onChange={event => this.setState({ comment: event.target.value })}
						onKeyDown={this.submitOnEnter}
						placeholder="Comment (optional)"
					/>

					<CMButton
						className="CreateContactModal-submit-button"
						color="blue"
						onClick={this.submit}
						disabled={!isNameValid || !isPhoneValid}
					>
						CREATE CONTACT
					</CMButton>
				</div>
			</CMModal>
		);
	}
}

export default connect()(CreateContactModal);
