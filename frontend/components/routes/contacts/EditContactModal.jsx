import _ from 'lodash';
import keycode from 'keycode';
import axios from 'axios';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
	CMButton, CMModal, CMInput, CMTextArea
} from '../../common';
import { authenticated } from '../../../utils';
import {
	LOADING,
	DELETE_CONTACT,
	EDIT_CONTACT
} from '../../../redux/actions';

class EditContactModal extends React.Component {
	static propTypes = {
		contact: PropTypes.object.isRequired,
		onClose: PropTypes.func.isRequired,
		dispatch: PropTypes.func.isRequired
	};

	state = {
		name: this.props.contact.name,
		phone: this.props.contact.phone,
		comment: this.props.contact.comment
	};

	deleteContact = () => {
		const { contact, onClose, dispatch } = this.props;

		dispatch({ type: LOADING, value: true });

		axios
			.post('/api/delete-contact', { id: contact.id })
			.then(authenticated(() => {
				dispatch({ type: DELETE_CONTACT, id: contact.id });
				onClose();
			}));
	};

	updateContact = () => {
		const { onClose, contact, dispatch } = this.props;
		const { name, phone, comment } = this.state;

		dispatch({ type: LOADING, value: true });

		axios
			.post('/api/edit-contact', { id: contact.id, name, phone, comment })
			.then((response) => {
				if (response.data === 'CONTACT_NOT_FOUND') {
					onClose(true);
					dispatch({ type: DELETE_CONTACT, id: contact.id });
				} else {
					dispatch({ type: EDIT_CONTACT, contact: response.data });
					onClose(false);
				}
			});
	};

	submitOnEnter = (event) => {
		if (event.which === keycode.codes.enter) {
			this.updateContact();
			// Remove focus from the active input to forbid the
			// user to enter date while the loading is underway.
			document.activeElement.blur();
		}
	};

	render() {
		const { name, phone, comment } = this.state;
		const { onClose } = this.props;

		const nameValidations = {
			'Should be at least 3 symbols long': _.size(name) >= 3,
			'Should be shorter than 100 symbols': _.size(name) < 100
		};

		const phoneValidations = {
			'Should contain only numbers': /^\d*$/.test(phone),
			'Should be exactly 8 characters long': _.size(phone) === 8
		};

		const isNameValid = _.every(nameValidations, validation => validation);
		const isPhoneValid = _.every(phoneValidations, validation => validation);

		return (
			<CMModal header="EDIT CONTACT" onClose={onClose}>
				<div className="EditContactModal">
					<CMInput
						className="EditContactModal-name-input"
						validations={nameValidations}
						value={name}
						autoFocus="autofocus"
						onChange={event => this.setState({ name: event.target.value })}
						onKeyDown={this.submitOnEnter}
						placeholder="Name"
						type="text"
					/>

					<CMInput
						className="EditContactModal-phone-input"
						validations={phoneValidations}
						value={phone}
						onChange={event => this.setState({ phone: event.target.value })}
						onKeyDown={this.submitOnEnter}
						placeholder="Phone"
						type="text"
					/>

					<CMTextArea
						value={comment}
						onChange={event => this.setState({ comment: event.target.value })}
						onKeyDown={this.submitOnEnter}
						placeholder="Comment (optional)"
						type="text"
					/>

					<div className="EditContactModal-buttons">
						<CMButton
							className="EditContactModal-save-button"
							color="blue"
							onClick={this.updateContact}
							disabled={!isNameValid || !isPhoneValid}
						>
							SAVE CONTACT
						</CMButton>

						<CMButton
							className="EditContactModal-delete-button"
							color="red"
							onClick={this.deleteContact}
							disabled={false}
						>
							DELETE CONTACT
						</CMButton>
					</div>
				</div>
			</CMModal>
		);
	}
}

export default connect()(EditContactModal);
