import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import {
	Redirect, Switch, Route
} from 'react-router-dom';
import cn from 'classnames';
import CreateContactModal from './CreateContactModal';
import EditContactModal from './EditContactModal';
import { CMModal } from '../../common';
import { authenticated } from '../../../utils';
import {
	LOADING,
	CONTACTS,
	SORTING,
	EDIT_FILTER
} from '../../../redux/actions';

class ContactsRoute extends React.Component {
	static propTypes = {
		contacts: PropTypes.array.isRequired,
		filters: PropTypes.object.isRequired,
		sorting: PropTypes.string.isRequired,
		history: PropTypes.object.isRequired,
		dispatch: PropTypes.func.isRequired
	};

	generateRandoms = () => {
		const { dispatch } = this.props;
		dispatch({ type: LOADING, value: true });
		axios
			.post('/api/generate-randoms')
			.then(authenticated(response => dispatch({ type: CONTACTS, data: response.data })));
	};

	renderHeader = (label, className, renderFilter, renderSorting) => {
		const { dispatch, sorting, filters } = this.props;
		const sortingAsc = `${className.toUpperCase()}_ASC`;
		const sortingDesc = `${className.toUpperCase()}_DESC`;

		return (
			<div key={label} className={cn('ContactsRoute-column-header', className)}>
				<div className="ContactsRoute-row">
					<div className="ContactsRoute-header-text">
						{label}
					</div>
					{
						renderSorting ?
							<>
								<div
									className={cn('ContactsRoute-sorter', 'asc', { active: sorting === sortingAsc })}
									onClick={() => this.onSortingClick(sortingAsc)}
								/>
								<div
									className={cn('ContactsRoute-sorter', 'desc', { active: sorting === sortingDesc })}
									onClick={() => this.onSortingClick(sortingDesc)}
								/>
							</> : null
					}
				</div>
				{
					renderFilter ?
						<input
							className="ContactsRoute-filter-input"
							placeholder="Filter"
							value={filters[className]}
							onChange={event => dispatch({
								type: EDIT_FILTER,
								name: className,
								value: event.target.value
							})}
						/> :
						<input
							className="ContactsRoute-filter-input disabled"
							disabled="disabled"
							type="text"
						/>
				}
			</div>
		);
	};

	renderContact = (contact) => {
		const { filters, history } = this.props;

		return (
			<div
				key={contact.id}
				className={cn('ContactsRoute-contact', `id-${contact.id}`)}
				onClick={() => history.push(`/contacts/${contact.id}`)}
			>
				<div className="ContactsRoute-column id">
					{`#${contact.id + 1}`}
				</div>
				<div className="ContactsRoute-column name">
					<span className="ContactsRoute-match">
						{contact.name.slice(0, _.size(filters.name))}
					</span>
					<span>
						{contact.name.slice(_.size(filters.name))}
					</span>
				</div>
				<div className="ContactsRoute-column phone">
					<span className="ContactsRoute-match">
						{contact.phone.toString().slice(0, _.size(filters.phone))}
					</span>
					<span>
						{contact.phone.toString().slice(_.size(filters.phone))}
					</span>
				</div>
				<div className="ContactsRoute-column comment">
					<span className="ContactsRoute-match">
						{contact.comment.slice(0, _.size(filters.comment))}
					</span>
					<span>
						{contact.comment.slice(_.size(filters.comment))}
					</span>
				</div>
				<div className="ContactsRoute-column ContactsRoute-date">
					{moment(contact.date).format('YYYY MMMM DD')}
				</div>
			</div>
		);
	};

	onSortingClick = (name) => {
		const { dispatch, sorting } = this.props;
		if (sorting !== name) dispatch({ type: SORTING, value: name });
	};

	render() {
		const { contacts, sorting, filters, history } = this.props;

		const displayedContacts = _.filter(contacts, (contact) => {
			const name = contact.name.toLowerCase();
			const phone = contact.phone.toString().toLowerCase();
			const comment = contact.comment.toLowerCase();

			if (!name.startsWith(filters.name.toLowerCase())) return false;
			if (!phone.startsWith(filters.phone.toLowerCase())) return false;
			if (!comment.startsWith(filters.comment.toLowerCase())) return false;

			// If none of the above checks returned it means that the
			// contact has passed all the filters and should be listed.
			return true;
		});

		// Array#sort modifies the initial array but in this case it doesn't really matter.
		displayedContacts.sort((a, b) => {
			const sortFieldName = sorting.split('_')[0].toLowerCase();
			const direction = sorting.split('_')[1];

			if (a[sortFieldName] < b[sortFieldName]) return direction === 'ASC' ? -1 : 1;
			if (a[sortFieldName] > b[sortFieldName]) return direction === 'ASC' ? 1 : -1;

			return 0;
		});

		return (
			<div className="ContactsRoute">
				<div className="ContactsRoute-content">
					<div className="ContactsRoute-table-header">
						{
							[
								this.renderHeader('#', 'id', false, false),
								this.renderHeader('Name', 'name', true, true),
								this.renderHeader('Phone', 'phone', true, true),
								this.renderHeader('Comment', 'comment', true, true),
								this.renderHeader('Creation Date', 'date', false, true)
							]
						}
					</div>
					<div className="ContactsRoute-contacts-list">
						{
							_.isEmpty(displayedContacts) ?
								<div className="ContactsRoute-empty-stub">No contacts to display.</div> :
								_.map(displayedContacts, this.renderContact)
						}
					</div>
					<div className="ContactsRoute-footer">
						<div
							className="ContactsRoute-create-contact-button"
							onClick={() => history.push('/contacts/create')}
						>
							CREATE CONTACT
						</div>

						<span className="ContactsRoute-stats">
							{/* Written in one line and wrapped into a span otherwise the spaces get stripped */}
							<span>
								Total contacts - <b className="ContactsRoute-total-contacts">{_.size(contacts)}</b>, <span>displayed contacts - </span> <b className="ContactsRoute-displayed-contacts">{_.size(displayedContacts)}</b>. {/* eslint-disable-line */}
							</span>
						</span>

						<div className="ContactsRoute-generate-randoms" onClick={this.generateRandoms}>
							GENERATE RANDOM CONTACTS
						</div>
					</div>
				</div>

				<Switch>
					<Route
						path="/contacts/create"
						render={() => <CreateContactModal onClose={() => history.push('/contacts')} />}
					/>
					<Route
						path="/contacts/:id"
						render={(props) => {
							const id = parseInt(props.match.params.id);
							const contact = _.find(contacts, { id });

							return contact ?
								<EditContactModal
									contact={contact}
									onClose={() => history.push('/contacts')}
								/> : // Display an error if the user manually sets the URL to an invalid value.
								<CMModal
									type="ERROR"
									header="ERROR"
									onClose={() => history.push('/contacts')}
								>
									<div className="ContactsRoute-contact-not-found">
										Contact not found.
									</div>
								</CMModal>;
						}}
					/>
					<Route
						path="/contacts/:id"
						render={() => <Redirect to="/contacts" />}
					/>
				</Switch>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	contacts: state.contacts,
	filters: state.filters,
	sorting: state.sorting
});

export default connect(mapStateToProps)(ContactsRoute);
