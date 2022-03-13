import React from 'react';
import Modal from './Modal';

const WinModal = ({ resetGame, goToNextLevel }) => {
    return (
        <Modal initiallyVisible hideOnClickOutside={false}>
            {({ close }) => {
                return (
                    <>
                        <p className="text-center text-xl font-bold">You've won!</p>
                        <button
                            onClick={() => {
                                resetGame();
                                close();
                            }}
                            className="bg-[#023a63] text-white px-16 py-2 rounded block mt-8 mx-auto"
                        >
                            Reset
                        </button>

                        <button
                            onClick={() => {
                                goToNextLevel();
                                close();
                            }}
                            className="bg-[#023a63] text-white px-16 py-2 rounded block mt-4 mx-auto"
                        >
                            Next Level
                        </button>
                    </>
                );
            }}
        </Modal>
    );
};

export default WinModal;