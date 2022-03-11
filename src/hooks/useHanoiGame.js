import { useState, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';

export const useHanoiGame = (disks = 1) => {
    const [moves, setMoves] = useLocalStorage('moves', 0);

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
