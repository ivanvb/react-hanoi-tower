import React from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { MdTouchApp } from 'react-icons/md';
import { RiDragMoveFill } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';

const ICON_SIZE = 20;
const InGameMenu = ({
    idealMoves,
    moves,
    isDragEnabled,
    onDragToggle,
    onReset,
    onSettingsClick,
}) => {
    return (
        <div className="flex items-center justify-between h-12 px-4 py-8 mb-6 tracking-wide text-center border-2 rounded shadow-lg bg-primary-700 border-accent-500">
            <div>
                Ideal Moves
                <br />
                {idealMoves}
            </div>
            <div>
                Moves
                <br />
                {moves}
            </div>
            <div className="space-x-4 lg:space-x-5">
                <button onClick={onDragToggle}>
                    {isDragEnabled ? (
                        <MdTouchApp size={ICON_SIZE} />
                    ) : (
                        <RiDragMoveFill size={ICON_SIZE} />
                    )}
                </button>
                <button onClick={onReset}>
                    <GrPowerReset className="reset-icon" size={ICON_SIZE} />
                </button>
                <button onClick={onSettingsClick}>
                    <IoMdSettings size={ICON_SIZE} />
                </button>
            </div>
        </div>
    );
};

export default InGameMenu;
