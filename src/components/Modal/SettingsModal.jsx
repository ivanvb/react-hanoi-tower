import React from 'react';
import Modal from './Modal';
import LevelRating from '../LevelRating/LevelRating';
import ResetDataButton from '../ResetDataButton/ResetDataButton';
import { levels } from '../../controller/HanoiController';

const SettingsModal = ({ scores, onSettingsClose, onLevelSelect, onDataClear }) => {
    return (
        <Modal initiallyVisible onModalClose={onSettingsClose}>
            {({ close }) => {
                return (
                    <>
                        <h2 className="mb-4 text-xl font-bold">Select an Amount of Disks</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {levels.map((level, i) => {
                                return (
                                    <button
                                        key={i}
                                        className="relative before:pt-[100%] before:w-full before:block"
                                    >
                                        <div
                                            className="bg-[#023a63] text-white rounded absolute mx-auto h-full w-full top-0 left-0"
                                            key={i}
                                            onClick={() => {
                                                onLevelSelect(level);
                                                close();
                                            }}
                                        >
                                            <div className="absolute w-full px-4 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                                                <span className="block mb-1 text-xl">{level}</span>
                                                <LevelRating
                                                    rating={scores[level].score || 0}
                                                    className="w-12 pt-2"
                                                />
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-4">
                            <ResetDataButton
                                resetData={() => {
                                    onDataClear();
                                    close();
                                }}
                            />
                        </div>
                    </>
                );
            }}
        </Modal>
    );
};

export default SettingsModal;
