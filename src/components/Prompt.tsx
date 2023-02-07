import usePrompt from "../lib/usePrompt";
import Modal from 'react-modal';
import { useRef, useState } from "react";
import { Button, Flex, Text } from "@chakra-ui/react";

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
            <Text fontSize="2xl" fontWeight={600} marginBottom={3}>Are you sure?</Text>
            <Text fontSize="lg">{message}</Text>
            <Flex justifyContent="flex-end" gap={2} paddingTop={3}>
                <Button type="button" variant='outline' onClick={() => {
                    promiseResolve.current?.(false)
                    closeModal();
                }}>
                    Cancel
                </Button>
                <Button type="button" colorScheme="blue" variant='outline' onClick={() => {
                    promiseResolve.current?.(true);
                    closeModal()
                }}>
                    Confirm
                </Button>
            </Flex>
        </Modal>
    );
}

