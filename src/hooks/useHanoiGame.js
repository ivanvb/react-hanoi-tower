import { useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { isVictoryState, getData } from '../controller/HanoiController';

const DEFAULT_LEVEL = 10;
const defaultState = getData(DEFAULT_LEVEL);

export const useHanoiGame = () => {
    const [currentLevel, setCurrentLevel] = useLocalStorage('currentLevel', DEFAULT_LEVEL);
    const [state, setState] = useLocalStorage('state', defaultState);
    const [moves, setMoves] = useLocalStorage('moves', 0);
    const [hasWon, setHasWon] = useLocalStorage('hasWon', false);

    function reset() {
        setMoves(0);
        setState({ ...getData(currentLevel) });
    }

    function increaseMoves() {
        setMoves((prev) => prev + 1);
    }

    function goToNextLevel() {
        setCurrentLevel((prev) => prev + 1);
    }

    function goToPrevLevel() {
        setCurrentLevel((prev) => prev - 1);
    }

    const idealMoves = useMemo(() => {
        return 2 ** currentLevel - 1;
    }, [state]);

    useEffect(() => {
        setHasWon(isVictoryState(state, state.containers.length - 1));
    }, [moves]);

    useEffect(() => {
        setMoves(0);
        setState(getData(currentLevel));
    }, [currentLevel]);

    return {
        moves,
        increaseMoves,
        idealMoves,
        hasWon,
        reset,
        state,
        setState,
        currentLevel,
        goToNextLevel,
        goToPrevLevel,
        setCurrentLevel,
    };
};
