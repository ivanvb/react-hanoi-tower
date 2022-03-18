import React from 'react';

import { Dialog, useDialogState, DialogBackdrop } from 'reakit/Dialog';

function Modal({ initiallyVisible, hideOnClickOutside, onSettingsClose, children }) {
    const dialog = useDialogState({ visible: initiallyVisible, animated: true });
    const dialogRef = React.useRef(null);

    const close = () => {
        dialog.setVisible(false);
        dialogRef.current.addEventListener(
            'transitionend',
            function () {
                if (onSettingsClose) onSettingsClose();
            },
            { once: true }
        );
    };

    React.useEffect(() => {
        if (dialog.visible) {
            dialogRef.current.focus();
        }
    }, [dialog.visible]);

    return (
        <div className="h-0">
            <DialogBackdrop
                {...dialog}
                className="fixed top-0 z-10 flex items-center justify-center w-full h-full bg-black bg-opacity-50"
            >
                <Dialog
                    {...dialog}
                    hideOnClickOutside={hideOnClickOutside}
                    aria-label="Welcome"
                    className="absolute bottom-0 z-20 w-full p-8 bg-white rounded-t-md md:top-0 md:bottom-auto md:w-auto md:relative md:rounded-b-md"
                    ref={dialogRef}
                >
                    {children({ close })}
                </Dialog>
            </DialogBackdrop>
        </div>
    );
}

export default Modal;
