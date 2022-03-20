import React from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { MdTouchApp } from 'react-icons/md';
import { RiDragMoveFill } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';

const InGameMenu = ({
    idealMoves,
    moves,
    isDragEnabled,
    onDragToggle,
    onReset,
    onSettingsClick,
}) => {
    return (
        <div className="flex items-center justify-between h-12 px-4 py-8 mb-6 font-mono font-bold tracking-wide text-center border-2 rounded shadow-lg bg-primary-700 border-primary-900">
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
            <div className="space-x-4">
                <button onClick={onDragToggle}>
                    {isDragEnabled ? <MdTouchApp /> : <RiDragMoveFill />}
                </button>
                <button onClick={onReset}>
                    <GrPowerReset className="reset-icon" />
                </button>
                <button onClick={onSettingsClick}>
                    <IoMdSettings size={16} />
                </button>
            </div>
        </div>
    );
};

export default InGameMenu;
