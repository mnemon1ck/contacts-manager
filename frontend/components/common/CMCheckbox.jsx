import React from 'react';
import PropTypes from 'prop-types';

export default function CMCheckbox({ onChange, value, children }) {
	return (
		<div className="CMCheckbox" onClick={onChange}>
			<input
				className="CMCheckbox-control"
				checked={value}
				onChange={() => undefined /* prevents a meaningless react warning */}
				type="checkbox"
			/>
			<div className="CMCheckbox-label">
				{children}
			</div>
		</div>
	);
}

CMCheckbox.propTypes = {
	onChange: PropTypes.func.isRequired,
	value: PropTypes.bool.isRequired,
	children: PropTypes.string.isRequired
};
