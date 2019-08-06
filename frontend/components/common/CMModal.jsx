import keycode from 'keycode';
import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

export default class CMModal extends React.Component {
	static propTypes = {
		type: PropTypes.oneOf(['ERROR', 'SUCCESS', 'DEFAULT']),
		header: PropTypes.string.isRequired,
		children: PropTypes.element.isRequired,
		onClose: PropTypes.func.isRequired
	};

	static defaultProps = {
		type: 'DEFAULT'
	};

	componentDidMount() {
		const { onClose } = this.props;
		// There has to be a ref to the listener in order for it to be removed.
		this.listener = event => (event.which === keycode.codes.esc ? onClose() : null);
		document.addEventListener('keydown', this.listener);
	}

	componentWillUnmount() {
		document.removeEventListener('keydown', this.listener);
	}

	onBackdropClick = (event) => {
		const { onClose } = this.props;
		// Call onClose only if the click happened on the backdrop
		// i.e. ignore clicks which happen on the content.
		if (event.target === event.currentTarget) onClose();
	};

	render() {
		const { header, children, type, onClose } = this.props;

		return (
			<div className="CMModal" onClick={this.onBackdropClick}>
				<div className="CMModal-container">
					<div className={cn('CMModal-header', type.toLowerCase())}>
						{header}
						<div className="CMModal-cross" onClick={onClose} />
					</div>
					{children}
				</div>
			</div>
		);
	}
}
