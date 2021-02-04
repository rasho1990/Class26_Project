import React from 'react';
import ReactDOM from 'react-dom';

const ModalOverlay = ({
	className,
	style,
	headerClass,
	contentClass,
	footer,
	footerClass,
	onSubmit,
	header,
	children,
}) => {
	const defaultFormHandler = event => event.preventDefault();
	const domEl = document.getElementById('modal-hook');
	const content = (
		<div className={`modal ${className}`} style={style}>
			<header className={`modal__header ${headerClass}`}>{header}</header>
			<form onSubmit={onSubmit ? onSubmit : defaultFormHandler}>
				<div className={`modal__content ${contentClass}`}>{children}</div>
				<footer className={`modal__footer ${footerClass}`}>{footer}</footer>
			</form>
		</div>
	);
	return ReactDOM.createPortal(content, domEl);
};

export default ModalOverlay;
