import React from 'react';
import { GrPowerReset } from 'react-icons/gr';
import { MdTouchApp } from 'react-icons/md';
import { RiDragMoveFill } from 'react-icons/ri';
import { IoMdSettings } from 'react-icons/io';

function arePropsEqual(prevProps, props) {
    return (
        prevProps.idealMoves === props.idealMoves &&
        prevProps.moves === props.moves &&
        prevProps.isDragEnabled === props.isDragEnabled
    );
}

const ICON_SIZE = 20;
const InGameMenu = React.memo(
    ({ idealMoves, moves, isDragEnabled, onDragToggle, onReset, onSettingsClick }) => {
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
                    <button
                        onClick={onDragToggle}
                        aria-label={isDragEnabled ? 'Enable touch to move' : 'Enable drag to move'}
                    >
                        {isDragEnabled ? (
                            <MdTouchApp size={ICON_SIZE} />
                        ) : (
                            <RiDragMoveFill size={ICON_SIZE} />
                        )}
                    </button>
                    <button onClick={onReset} aria-label="Reset game">
                        <GrPowerReset className="reset-icon" size={ICON_SIZE} />
                    </button>
                    <button onClick={onSettingsClick} aria-label="Open settings">
                        <IoMdSettings size={ICON_SIZE} />
                    </button>
                </div>
            </div>
        );
    },
    arePropsEqual
);

export default InGameMenu;
