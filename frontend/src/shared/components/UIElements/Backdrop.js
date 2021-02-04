import React from 'react';
import { createPortal } from 'react-dom';

import './Backdrop.css';

const Backdrop = ({ clickHandler }) => {
	const content = <div className="backdrop" onClick={clickHandler}></div>;
	const domEl = document.getElementById('backdrop-hook');

	return createPortal(content, domEl);
};

export default Backdrop;
