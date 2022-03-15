import React from 'react';
import LevelRating from '../LevelRating/LevelRating';
import Modal from './Modal';

const WinModal = ({ resetGame, goToNextLevel }) => {
    return (
        <Modal initiallyVisible hideOnClickOutside={false}>
            {({ close }) => {
                return (
                    <>
                        <p className="mb-4 text-xl font-bold text-center">You've won!</p>
                        <LevelRating rating={2} starSize={48} className="pt-6 w-36" />
                        <button
                            onClick={() => {
                                resetGame();
                                close();
                            }}
                            className="bg-[#023a63] text-white px-16 py-2 rounded block mt-6 mx-auto"
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
