import React from 'react';
import LevelRating from '../LevelRating/LevelRating';
import Modal from './Modal';

const WinModal = ({ resetGame, goToNextLevel, rating }) => {
    return (
        <Modal initiallyVisible hideOnClickOutside={false}>
            {({ close }) => {
                return (
                    <>
                        <p className="mb-4 text-xl font-bold text-center">You've won!</p>
                        <LevelRating rating={rating} starSize={48} className="pt-6 w-36" />
                        <button
                            onClick={() => {
                                resetGame();
                                close();
                            }}
                            className="mt-6 modal-button"
                        >
                            Reset
                        </button>

                        <button
                            onClick={() => {
                                goToNextLevel();
                                close();
                            }}
                            className="mt-4 modal-button"
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
