import React, { useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import * as tweenFunctions from 'tween-functions';
import {
    canMove,
    performMovement,
    getTopDisk,
    getColId,
    calculateRating,
} from './controller/HanoiController';
import DraggableDisk from './components/Disk/DraggableDisk';
import { useRefMap } from './hooks/useRefMap';
import { useHanoiGame } from './hooks/useHanoiGame';
import { useLocalStorage } from './hooks/useLocalStorage';
import InGameMenu from './components/InGameMenu/InGameMenu';
import { getTopDiskCoords } from './utils/HanoiUtils';
const WinModal = React.lazy(() => import('./components/Modal/WinModal'));
const SettingsModal = React.lazy(() => import('./components/Modal/SettingsModal'));

const initialTouchState = {
    start: null,
    end: null,
};

function App() {
    const [dragSuccess, setDragSuccess] = React.useState(true);
    const [isDragEnabled, setDragEnabled] = useLocalStorage('dragEnabled', true);
    const [touchMove, setTouchMove] = React.useState(initialTouchState);
    const [showSettings, setShowSettings] = React.useState(false);
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

    const onDragBeforeStart = useCallback((result) => {
        diskBeforeDrag.current = disksRefs[result.draggableId].current.getBoundingClientRect();
    });

    const onDragEnd = useCallback((result) => {
        console.log('test');
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

    function useTouchControls(api) {
        function moveStepByStep(drag, values) {
            requestAnimationFrame(() => {
                const newPosition = values.shift();
                drag.move(newPosition);

                if (values.length) {
                    moveStepByStep(drag, values);
                } else {
                    drag.drop();
                }
            });
        }

        function start() {
            const targetDisk = getTopDisk(state, touchMove.start);

            const preDrag = api.tryGetLock(targetDisk);

            if (!preDrag) {
                return;
            }

            const topDisk = getTopDisk(state, touchMove.start);
            const diskBeforeMove = disksRefs[topDisk].current.getBoundingClientRect();

            const start = { x: 0, y: 0 };
            const cc = getTopDiskCoords(
                columnsRefs[touchMove.start].current,
                disksRefs[targetDisk].current,
                diskBeforeMove
            );
            const comp = getTopDiskCoords(
                columnsRefs[touchMove.end].current,
                disksRefs[targetDisk].current
            );

            const end = { x: comp.x - cc.x, y: comp.y - cc.y - diskBeforeMove.height };

            const drag = preDrag.fluidLift(start);

            const numberOfPoints = 15;
            const points = [];
            for (let i = 0; i < numberOfPoints; i++) {
                points.push({
                    x: tweenFunctions.easeOutCirc(i, start.x, end.x, numberOfPoints),
                    y: tweenFunctions.easeOutCirc(i, start.y, end.y, numberOfPoints),
                });
            }

            moveStepByStep(drag, points);
        }

        useEffect(() => {
            if (touchMove.end !== null && isDragEnabled === false) {
                start();
                setTouchMove({ start: null, end: null });
            }
        }, [touchMove.end]);
    }

    function setColumnRef(refVal, innerRef, columnRef) {
        columnRef.current = refVal;
        innerRef && innerRef(refVal);
    }

    function handleColumnClick(columnId, index) {
        if (!isDragEnabled) {
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
        <main className="container py-8">
            {hasWon && (
                <React.Suspense fallback={<div></div>}>
                    <WinModal
                        resetGame={reset}
                        goToNextLevel={goToNextLevel}
                        rating={calculateRating(moves, idealMoves)}
                    />
                </React.Suspense>
            )}
            {showSettings && (
                <React.Suspense fallback={<div></div>}>
                    <SettingsModal
                        onSettingsClose={() => setShowSettings(false)}
                        onLevelSelect={setCurrentLevel}
                        onDataClear={clearAllData}
                    />
                </React.Suspense>
            )}
            <InGameMenu
                idealMoves={idealMoves}
                moves={moves}
                isDragEnabled={isDragEnabled}
                onDragToggle={() => setDragEnabled((prev) => !prev)}
                onReset={reset}
                onSettingsClick={() => setShowSettings(true)}
            />
            <DragDropContext
                onDragStart={() => setDragSuccess(true)}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
                onBeforeDragStart={onDragBeforeStart}
                sensors={[useTouchControls]}
            >
                <div className="flex justify-between bg-[#F1DAAC] p-4 rounded disks-container">
                    {state.containers.map((ct, index) => {
                        return (
                            <Droppable
                                key={ct.id}
                                droppableId={ct.id}
                                ignoreContainerClipping={true}
                            >
                                {(provided, snapshot) => {
                                    const columnRef = columnsRefs[ct.id];
                                    return (
                                        <div
                                            className={`${
                                                touchMove.start === ct.id
                                                    ? 'bg-gray-500 border-gray-800'
                                                    : 'border-transparent'
                                            } cursor-pointer box border`}
                                            ref={(refVal) =>
                                                setColumnRef(refVal, provided.innerRef, columnRef)
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
                                                                        diskRef={disksRefs[block]}
                                                                        dragSuccess={dragSuccess}
                                                                        columnRef={columnRef}
                                                                        columnsRefs={columnsRefs}
                                                                        dbd={diskBeforeDrag}
                                                                        disableDrag={!isDragEnabled}
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
    );
}

export default App;
