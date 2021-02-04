import React from 'react';
import { Link } from 'react-router-dom';

import './Button.css';

const Button = ({ href, children, to, exact, size, danger, inverse,friend ,onClick, type, disabled }) => {
	if (href) {
		return (
			<a
				className={`button button--${size || 'default'} ${inverse && 'button--inverse'} ${danger &&
					'button--danger'}`}
				href={href}
			>
				{children}
			</a>
		);
	}
	if (to) {
		return (
			<Link
				to={to}
				exact={exact}
				className={`button button--${size || 'default'} ${inverse && 'button--inverse'} ${danger &&
					'button--danger'}`}
			>
				{children}
			</Link>
		);
	}
	return (
		<button
			className={`button button--${size || 'default'} ${inverse && 'button--inverse'} ${danger &&
				'button--danger'} ${friend && 'button--friend'}`}
			type={type}
			onClick={onClick}
			disabled={disabled}
		>
			{children}
		</button>
	);
};

export default Button;
