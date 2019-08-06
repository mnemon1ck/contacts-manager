import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default function CMButton({ color, onClick, disabled, className, children }) {
	return (
		<div
			onClick={disabled ? null : onClick}
			className={cn('CMButton', className, {
				disabled,
				blue: color === 'blue',
				red: color === 'red'
			})}
		>
			<span className="CMButton-label">{children}</span>
		</div>
	);
}

CMButton.propTypes = {
	className: PropTypes.string.isRequired,
	color: PropTypes.oneOf(['blue', 'red']).isRequired,
	onClick: PropTypes.func.isRequired,
	disabled: PropTypes.bool.isRequired,
	children: PropTypes.string.isRequired
};
