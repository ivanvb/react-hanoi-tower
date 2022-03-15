import React, { useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { canMove, performMovement, getTopDisk, getColId } from './controller/HanoiController';
import DraggableDisk from './components/Disk/DraggableDisk';
import { useRefMap } from './hooks/useRefMap';
import { useHanoiGame } from './hooks/useHanoiGame';
import { useLocalStorage } from './hooks/useLocalStorage';
import InGameMenu from './components/InGameMenu/InGameMenu';
const WinModal = React.lazy(() => import('./components/Modal/WinModal'));
const SettingsModal = React.lazy(() => import('./components/Modal/SettingsModal'));

const initialTouchState = {
    start: null,
    end: null,
};

function App() {
    const [dragSuccess, setDragSuccess] = React.useState(true);
    const [isDragEnabled, setDragEnabled] = useLocalStorage('dragEnabled', false);
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
        function start() {
            const targetDisk = getTopDisk(state, touchMove.start);

            const preDrag = api.tryGetLock(targetDisk);

            if (!preDrag) {
                return;
            }

            const drag = preDrag.snapLift();
            const currentColIndex = getColId(touchMove.start);
            const targetColIndex = getColId(touchMove.end);

            for (let i = 0; i < Math.abs(currentColIndex - targetColIndex); i++) {
                currentColIndex > targetColIndex ? drag.moveLeft() : drag.moveRight();
            }

            disksRefs[targetDisk].current.addEventListener(
                'transitionend',
                function () {
                    drag.drop();
                },
                { once: true }
            );
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
                    <WinModal resetGame={reset} goToNextLevel={goToNextLevel} />
                </React.Suspense>
            )}
            {showSettings && (
                <React.Suspense fallback={<div></div>}>
                    <SettingsModal
                        onSettingsClose={() => setShowSettings(false)}
                        onLevelSelect={setCurrentLevel}
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
