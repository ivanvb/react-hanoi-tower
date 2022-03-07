import { useState } from 'react';

export const useHanoiGame = () => {
    const [moves, setMoves] = useState(0);

    function increaseMoves() {
        setMoves((prev) => prev + 1);
    }
    return {
        moves,
        increaseMoves,
    };
};
