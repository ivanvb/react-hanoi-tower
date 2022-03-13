import React from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { MdTouchApp } from 'react-icons/md';
import { RiDragMoveFill } from 'react-icons/ri';

const InGameMenu = ({ idealMoves, moves, isDragEnabled, onDragToggle, onReset }) => {
    return (
        <div className="h-12 flex justify-between items-center bg-[#012A4A] px-4 py-8 rounded shadow-lg mb-6 font-bold tracking-wide font-mono text-center">
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
            </div>
        </div>
    );
};

export default InGameMenu;
