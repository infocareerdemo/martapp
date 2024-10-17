import React from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import { AiOutlineClose } from 'react-icons/ai'
const Alert = ({ title, msg, open, type, onClose, onConfirm }) => {
    
    return (
        <>
            <Modal
                size='md'
                centered
                show={open}
                onHide={onClose}
            >
                <ModalBody>
                    <div className='modal_close_icon_container' onClick={onClose}>
                        <AiOutlineClose className='modal_close_icon' />
                    </div>
                    <div>
                        <div className='modal_container'>
                            <span className='modal_head_txt'>{title}</span>
                        </div>
                        <div className='modal_container' >
                            <div style={{ padding: "20px" }}>

                                <div style={{ display: 'flex', textAlign: 'center' }}>
                                    <span>{msg}</span>
                                </div>
                            </div>
                        </div>
                        <div className='modal_body_container modal_container'>
                            {type === "info" &&
                                <button type="button" onClick={onClose} className="modal_btn info"><text>OK</text></button>
                            }
                            {type === "success" &&
                                <button type="button" onClick={onClose} className="modal_btn SUCCESS"><text>OK</text></button>
                            }
                            {type === "error" &&
                                <button type="button" onClick={onClose} className="modal_btn error"><text>Close</text></button>
                            }
                            {type === "yesorno" &&
                                <>
                                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                                        <button type="button" onClick={onConfirm} className="modal_btn">
                                            <span>Yes</span>
                                        </button>
                                        <span style={{ margin: '0 10px' }}></span>
                                        <button type="button" onClick={onClose} className="modal_btn error">
                                            <span>No</span>
                                        </button>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}

export default Alert;