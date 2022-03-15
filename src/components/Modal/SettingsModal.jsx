import React from 'react';
import Modal from './Modal';
import LevelRating from '../LevelRating/LevelRating';
import ResetDataButton from '../ResetDataButton/ResetDataButton';

const levels = [2, 3, 4, 5, 6, 7, 8, 9, 10];
const SettingsModal = ({ onSettingsClose, onLevelSelect }) => {
    return (
        <Modal initiallyVisible onSettingsClose={onSettingsClose}>
            {({ close }) => {
                return (
                    <>
                        <h2 className="mb-4 text-xl font-bold">Select an Amount of Disks</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {levels.map((level, i) => {
                                return (
                                    <button
                                        className="bg-[#023a63] text-white w-20 h-20 rounded relative mx-auto"
                                        key={i}
                                        onClick={() => {
                                            onLevelSelect(level);
                                            close();
                                        }}
                                    >
                                        <div className="absolute w-full px-4 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                            <span className="block mb-1 text-xl">{level}</span>
                                            <LevelRating rating={2} className="w-12 pt-2" />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4">
                            <ResetDataButton />
                        </div>
                    </>
                );
            }}
        </Modal>
    );
};

export default SettingsModal;
