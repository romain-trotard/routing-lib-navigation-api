import usePrompt from "../lib/usePrompt";
import Modal from 'react-modal';
import { useRef, useState } from "react";

Modal.setAppElement('#root');

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

export default function Prompt({
    when,
    message = 'Are you sure you want to leave? You will lose unsaved changes',
}: { when: boolean, message?: string; }) {
    const [showModal, setShowModal] = useState(false);
    const promiseResolve = useRef<((value: boolean) => void) | undefined>(undefined);

    const promptUser = () => {
        const promise = new Promise<boolean>(resolve => {
            promiseResolve.current = resolve;
        })

        setShowModal(true);

        return promise;
    }
    const closeModal = () => {
        promiseResolve.current = undefined;
        setShowModal(false);
    }

    usePrompt({ when, promptUser, message });

    return (
        <Modal isOpen={showModal} onRequestClose={closeModal} style={customStyles}>
            <p>{message}</p>
            <button type="button" onClick={() => {
                promiseResolve.current?.(false)
                closeModal();
            }}>Cancel</button>
            <button type="button" onClick={() => {
                promiseResolve.current?.(true);
                closeModal()
            }}>Confirm</button>
        </Modal>
    );
}
