import React from 'react';

import { Dialog, useDialogState, DialogBackdrop, DialogDisclosure } from 'reakit/Dialog';

function Modal({ initiallyVisible, hideOnClickOutside, children }) {
    const dialog = useDialogState({ visible: initiallyVisible, animated: true });
    const dialogRef = React.useRef(null);

    const close = () => dialog.setVisible(false);

    React.useEffect(() => {
        if (dialog.visible) {
            dialogRef.current.focus();
        }
    }, [dialog.visible]);

    return (
        <div className="h-0">
            <DialogBackdrop
                {...dialog}
                className="fixed top-0 h-full bg-black w-full z-10 bg-opacity-50 flex justify-center items-center"
            >
                <Dialog
                    {...dialog}
                    hideOnClickOutside={hideOnClickOutside}
                    aria-label="Welcome"
                    className="bg-white absolute z-20 bottom-0 w-full p-8 rounded-t-md md:top-0 md:bottom-auto md:w-auto md:relative md:rounded-b-md"
                    ref={dialogRef}
                >
                    {children({ close })}
                </Dialog>
            </DialogBackdrop>
        </div>
    );
}

export default Modal;
