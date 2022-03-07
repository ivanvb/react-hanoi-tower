import { useState, useMemo } from 'react';

export const useHanoiGame = (disks = 1) => {
    const [moves, setMoves] = useState(0);

    function increaseMoves() {
        setMoves((prev) => prev + 1);
    }

    const idealMoves = useMemo(() => {
        return 2 ** disks - 1;
    });

    return {
        moves,
        increaseMoves,
        idealMoves,
    };
};
