import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const filledClass = 'text-yellow-500';
const unfilledClass = 'text-gray-300';

const LevelRating = ({ rating, className = '' }) => {
    return (
        <div className={`relative flex justify-between w-12 pt-2 mx-auto ${className}`}>
            <AiFillStar className={`${rating >= 1 ? filledClass : unfilledClass}`} />
            <AiFillStar
                className={`absolute top-0 -translate-x-1/2 left-1/2 ${
                    rating >= 2 ? filledClass : unfilledClass
                }`}
            />
            <AiFillStar className={`${rating >= 3 ? filledClass : unfilledClass}`} />
        </div>
    );
};

export default LevelRating;
