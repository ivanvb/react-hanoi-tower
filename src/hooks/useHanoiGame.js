import { useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { isVictoryState, getData } from '../controller/HanoiController';

export const useHanoiGame = (state, disks = 1) => {
    const [moves, setMoves] = useLocalStorage('moves', 0);
    const [hasWon, setHasWon] = useLocalStorage('hasWon', false);

    function reset(setState) {
        setMoves(0);
        setState({ ...getData() });
    }

    function increaseMoves() {
        setMoves((prev) => prev + 1);
    }

    const idealMoves = useMemo(() => {
        return 2 ** disks - 1;
    });

    useEffect(() => {
        setHasWon(isVictoryState(state, state.containers.length - 1));
    }, [moves]);

    return {
        moves,
        increaseMoves,
        idealMoves,
        hasWon,
        reset,
    };
};
