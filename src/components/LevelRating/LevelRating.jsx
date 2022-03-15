import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const filledClass = 'text-yellow-500';
const unfilledClass = 'text-gray-300';

const LevelRating = ({ rating, starSize = 16, className = '' }) => {
    return (
        <div className={`relative flex justify-between mx-auto ${className}`}>
            <AiFillStar
                className={`${rating >= 1 ? filledClass : unfilledClass}`}
                size={starSize}
            />
            <AiFillStar
                size={starSize}
                className={`absolute top-0 -translate-x-1/2 left-1/2 ${
                    rating >= 2 ? filledClass : unfilledClass
                }`}
            />
            <AiFillStar
                size={starSize}
                className={`${rating >= 3 ? filledClass : unfilledClass}`}
            />
        </div>
    );
};

export default LevelRating;
