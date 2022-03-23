import { useMemo, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useEffectAfterMount } from './useEffectAfterMount';
import { isVictoryState, getData, levels, calculateRating } from '../controller/HanoiController';

const DEFAULT_LEVEL = 2;
const defaultState = getData(DEFAULT_LEVEL);

const EMPTY_SCORE = levels.reduce((acc, currentLevel) => {
    return { ...acc, [currentLevel]: { score: 0 } };
}, {});

export const useHanoiGame = () => {
    const [currentLevel, setCurrentLevel] = useLocalStorage('currentLevel', DEFAULT_LEVEL);
    const [state, setState] = useLocalStorage('state', defaultState);
    const [moves, setMoves] = useLocalStorage('moves', 0);
    const [hasWon, setHasWon] = useLocalStorage('hasWon', false);
    const [scores, setScores] = useLocalStorage('scores', EMPTY_SCORE);

    function reset() {
        setMoves(0);
        setState({ ...getData(currentLevel) });
    }

    function clearAllData() {
        setScores(EMPTY_SCORE);
        setCurrentLevel(DEFAULT_LEVEL);
        setState({ ...getData(DEFAULT_LEVEL) });
        setMoves(0);
        setHasWon(false);
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

    useEffectAfterMount(() => {
        setMoves(0);
        setState(getData(currentLevel));
    }, [currentLevel]);

    useEffect(() => {
        if (hasWon) {
            const currentLevelPrevScore = scores[currentLevel].score;
            const currentScore = calculateRating(moves, idealMoves);
            if (currentScore > currentLevelPrevScore) {
                setScores((prev) => {
                    return {
                        ...prev,
                        [currentLevel]: { ...prev[currentLevel], score: currentScore },
                    };
                });
            }
        }
    }, [hasWon]);

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
        clearAllData,
        scores,
    };
};
