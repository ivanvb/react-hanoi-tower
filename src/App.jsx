import React, { useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import toast, { Toaster } from 'react-hot-toast';
import * as tweenFunctions from 'tween-functions';
import {
    canMove,
    performMovement,
    getTopDisk,
    calculateRating,
} from './controller/HanoiController';
import Logo from './components/Logo/Logo';
import DraggableDisk from './components/Disk/DraggableDisk';
import { useRefMap } from './hooks/useRefMap';
import { useHanoiGame } from './hooks/useHanoiGame';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useServiceWorker } from './hooks/useServiceWorker';
import InGameMenu from './components/InGameMenu/InGameMenu';
import { getTopDiskCoords } from './utils/HanoiUtils';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
const WinModal = React.lazy(() => import('./components/Modal/WinModal'));
const SettingsModal = React.lazy(() => import('./components/Modal/SettingsModal'));

const initialTouchState = {
    start: null,
    end: null,
};

function App() {
    useServiceWorker();
    const [dragSuccess, setDragSuccess] = React.useState(true);
    const [isDragEnabled, setDragEnabled] = useLocalStorage('dragEnabled', false);
    const [touchMove, setTouchMove] = React.useState(initialTouchState);
    const [showSettings, setShowSettings] = React.useState(false);
    const [isTouchMoving, setIsTouchMoving] = React.useState(false);
    const {
        moves,
        increaseMoves,
        idealMoves,
        hasWon,
        reset,
        state,
        setState,
        goToNextLevel,
        setCurrentLevel,
        clearAllData,
        scores,
        currentLevel,
    } = useHanoiGame();

    const disksIds = Object.keys(state.blocks);

    const columnsRefs = useRefMap(state.containers.map(({ id }) => id));
    const disksRefs = useRefMap(disksIds);
    const diskBeforeDrag = useRef(null);

    useEffect(() => {
        if (isDragEnabled) {
            setTouchMove(initialTouchState);
        }
    }, [isDragEnabled]);

    useEffect(() => {
        setTouchMove(initialTouchState);
    }, [currentLevel]);

    const onDragBeforeStart = useCallback((result) => {
        diskBeforeDrag.current = disksRefs[result.draggableId].current.getBoundingClientRect();
    });

    const onDragEnd = useCallback((result) => {
        const { destination, draggableId, source } = result;

        const canPerformMovement = canMove(state, destination?.droppableId, draggableId);
        if (canPerformMovement && destination?.droppableId) {
            setState((prev) => ({
                ...performMovement(prev, draggableId, source.droppableId, destination.droppableId),
            }));
            increaseMoves();
        } else {
            setDragSuccess(false);
        }
    });

    const onDragUpdate = useCallback((result) => {
        const { destination, draggableId } = result;
        const canPerformMovement = canMove(state, destination?.droppableId, draggableId);

        setDragSuccess(canPerformMovement);
    });

    function onReset() {
        setTouchMove(initialTouchState);
        toast('Game restarted');
        reset();
    }

    function useTouchControls(api) {
        function moveStepByStep(drag, values) {
            requestAnimationFrame(() => {
                const newPosition = values.shift();
                drag.move(newPosition);

                if (values.length) {
                    moveStepByStep(drag, values);
                } else {
                    drag.drop();
                    setIsTouchMoving(false);
                }
            });
        }

        function performDiskMovement() {
            setIsTouchMoving(true);
            const targetDisk = getTopDisk(state, touchMove.start);
            const preDrag = api.tryGetLock(targetDisk);

            if (!preDrag) {
                setIsTouchMoving(false);
                return;
            }

            const diskBeforeMove = disksRefs[targetDisk].current.getBoundingClientRect();

            const startPoint = getTopDiskCoords(
                columnsRefs[touchMove.start].current,
                disksRefs[targetDisk].current,
                diskBeforeMove
            );

            const endPoint = getTopDiskCoords(
                columnsRefs[touchMove.end].current,
                disksRefs[targetDisk].current
            );

            const targetPointRelativePosition = {
                x: endPoint.x - startPoint.x,
                y: endPoint.y - startPoint.y - diskBeforeMove.height,
            };

            const currentRelativeDiskPosition = { x: 0, y: 0 };
            const drag = preDrag.fluidLift(currentRelativeDiskPosition);

            const numberOfPoints = 15;
            const points = [];
            for (let i = 0; i < numberOfPoints; i++) {
                points.push({
                    x: tweenFunctions.easeOutCirc(
                        i,
                        currentRelativeDiskPosition.x,
                        targetPointRelativePosition.x,
                        numberOfPoints
                    ),
                    y: tweenFunctions.easeOutCirc(
                        i,
                        currentRelativeDiskPosition.y,
                        targetPointRelativePosition.y,
                        numberOfPoints
                    ),
                });
            }

            moveStepByStep(drag, points);
        }

        useEffect(() => {
            if (touchMove.end !== null && isDragEnabled === false) {
                performDiskMovement();
                setTouchMove({ start: null, end: null });
            }
        }, [touchMove.end]);
    }

    function setColumnRef(refVal, innerRef, columnRef) {
        columnRef.current = refVal;
        innerRef && innerRef(refVal);
    }

    function handleColumnClick(columnId, index) {
        if (!isDragEnabled && !isTouchMoving) {
            setTouchMove((prev) => {
                const prevCopy = { ...prev };

                const columnHasBlocks = state.containers[index].blocks.length > 0;
                if (!prev.start && columnHasBlocks) {
                    prevCopy.start = columnId;
                } else if (prev.start === columnId) {
                    prevCopy.start = null;
                } else if (prev.start) {
                    prevCopy.end = columnId;
                }
                return {
                    ...prev,
                    ...prevCopy,
                };
            });
        }
    }

    return (
        <>
            <AnimatedBackground />
            <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                        background: '#222222F5',
                        color: '#fff',
                    },
                    duration: 3500,
                }}
                containerStyle={{
                    bottom: 60,
                }}
            />
            <main className="container py-8 md:mb-[225px]">
                {hasWon && (
                    <React.Suspense fallback={<div></div>}>
                        <WinModal
                            resetGame={onReset}
                            goToNextLevel={goToNextLevel}
                            rating={calculateRating(moves, idealMoves)}
                        />
                    </React.Suspense>
                )}
                {showSettings && (
                    <React.Suspense fallback={<div></div>}>
                        <SettingsModal
                            scores={scores}
                            currentLevel={currentLevel}
                            onSettingsClose={() => setShowSettings(false)}
                            onLevelSelect={setCurrentLevel}
                            onDataClear={clearAllData}
                        />
                    </React.Suspense>
                )}
                <Logo className="w-full mx-auto mb-6 text-accent-500 md:w-7/12" />
                <InGameMenu
                    idealMoves={idealMoves}
                    moves={moves}
                    isDragEnabled={isDragEnabled}
                    onDragToggle={() => {
                        toast(isDragEnabled ? 'Enabled touch to move' : 'Enabled drag to move');
                        setDragEnabled((prev) => !prev);
                    }}
                    onReset={onReset}
                    onSettingsClick={() => setShowSettings(true)}
                />
                <DragDropContext
                    onDragStart={() => setDragSuccess(true)}
                    onDragUpdate={onDragUpdate}
                    onDragEnd={onDragEnd}
                    onBeforeDragStart={onDragBeforeStart}
                    sensors={[useTouchControls]}
                >
                    <div
                        className="flex justify-between p-4 rounded sm:p-4 bg-accent-500 disks-container"
                        data-is-narrow-level={currentLevel >= 6}
                    >
                        {state.containers.map((ct, index) => {
                            return (
                                <Droppable
                                    key={ct.id}
                                    droppableId={ct.id}
                                    ignoreContainerClipping={true}
                                >
                                    {(provided) => {
                                        const columnRef = columnsRefs[ct.id];
                                        return (
                                            <div
                                                className={`${
                                                    touchMove.start === ct.id
                                                        ? 'bg-secondary-300 border-secondary-500'
                                                        : 'border-transparent'
                                                } ${
                                                    isDragEnabled ? '' : 'cursor-pointer'
                                                } box border`}
                                                ref={(refVal) =>
                                                    setColumnRef(
                                                        refVal,
                                                        provided.innerRef,
                                                        columnRef
                                                    )
                                                }
                                                {...provided.droppableProps}
                                                onClick={() => handleColumnClick(ct.id, index)}
                                            >
                                                {ct.blocks.map((block, i) => {
                                                    if (i === 0) {
                                                        return (
                                                            <Draggable
                                                                key={block}
                                                                draggableId={block}
                                                                index={i}
                                                            >
                                                                {(provided, snapshot) => {
                                                                    return (
                                                                        <DraggableDisk
                                                                            provided={provided}
                                                                            snapshot={snapshot}
                                                                            state={state}
                                                                            block={block}
                                                                            diskRef={
                                                                                disksRefs[block]
                                                                            }
                                                                            dragSuccess={
                                                                                dragSuccess
                                                                            }
                                                                            columnRef={columnRef}
                                                                            columnsRefs={
                                                                                columnsRefs
                                                                            }
                                                                            dbd={diskBeforeDrag}
                                                                            disableDrag={
                                                                                !isDragEnabled
                                                                            }
                                                                        />
                                                                    );
                                                                }}
                                                            </Draggable>
                                                        );
                                                    } else {
                                                        return (
                                                            <DraggableDisk
                                                                key={block}
                                                                state={state}
                                                                block={block}
                                                            />
                                                        );
                                                    }
                                                })}
                                            </div>
                                        );
                                    }}
                                </Droppable>
                            );
                        })}
                    </div>
                </DragDropContext>
            </main>
        </>
    );
}

export default App;
