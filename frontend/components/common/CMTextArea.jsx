import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class CMTextArea extends React.Component {
	static propTypes = {
		className: PropTypes.string,
		validations: PropTypes.object
	};

	static defaultProps = {
		className: null,
		validations: {}
	};

	renderValidation = (value, msg) => (
		<div key={msg} className={cn('CMTextArea-validation', { passed: value, failed: !value })}>
			<div>{value}</div>
			<div>{msg}</div>
		</div>
	);

	render() {
		const { validations, className, ...others } = this.props;
		const isValid = _.every(validations, value => value);

		return (
			<div className="CMTextArea">
				<textarea
					{...others}
					className={cn(className, 'CMTextArea-control', {
						valid: isValid,
						invalid: !isValid
					})}
				/>
				<div className="CMTextArea-validations">
					{_.map(validations, this.renderValidation)}
				</div>
			</div>
		);
	}
}
