import React from 'react';
import Dialog from '@reach/dialog';
import '@reach/dialog/styles.css';

function Modal() {
    const [showDialog, setShowDialog] = React.useState(true);
    const open = () => setShowDialog(true);
    const close = () => setShowDialog(false);

    return (
        <>
            <Dialog
                className="absolute m-0 bottom-0 w-full rounded-t-md"
                isOpen={showDialog}
                onDismiss={close}
            >
                <p className="text-center text-xl font-bold">You've won!</p>
                <button
                    onClick={close}
                    className="bg-[#023a63] text-white px-16 py-2 rounded block mt-8 mx-auto"
                >
                    G8!
                </button>
            </Dialog>
        </>
    );
}

export default Modal;
