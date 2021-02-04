import React from "react";
import { CSSTransition } from "react-transition-group";

import Backdrop from "../Backdrop";
import ModalOverlay from "./ModalOverlay";
import "./Modal.css";

const Modal = props => {
	const { show, onCancel } = props;
	return (
		<>
			{show && <Backdrop clickHandler={onCancel} />}
			<CSSTransition in={show} mountOnEnter unmountOnExit timeout={200} classNames='modal'>
				<ModalOverlay {...props} />
			</CSSTransition>
		</>
	);
};

export default Modal;
