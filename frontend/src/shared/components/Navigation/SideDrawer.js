import React from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './SideDrawer.css';

const SideDrawer = ({ children, show, clickHandler }) => {
	const content = (
		<CSSTransition in={show} timeout={200} classNames="slide-in-left" mountOnEnter unmountOnExit>
			<aside className="side-drawer" onClick={clickHandler}>
				{children}
			</aside>
		</CSSTransition>
	);
	const domEl = document.getElementById('drawer-hook');

	return ReactDOM.createPortal(content, domEl);
};

export default SideDrawer;
