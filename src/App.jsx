import React, { useCallback, useRef, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { getData, canMove, performMovement } from './controller/HanoiController';
import DraggableDisk from './components/Disk/DraggableDisk';
import { useRefMap } from './hooks/useRefMap';
import { useHanoiGame } from './hooks/useHanoiGame';

const data = getData();
const disksIds = data.containers.reduce((acc, curr) => [...acc, ...curr.blocks], []);

function App() {
    const [state, setState] = React.useState(data);
    const [dragSuccess, setDragSuccess] = React.useState(true);
    const [isDragEnabled, setDragEnabled] = React.useState(true);
    const { moves, increaseMoves, idealMoves } = useHanoiGame(disksIds.length);

    const columnsRefs = useRefMap(data.containers.map(({ id }) => id));
    const disksRefs = useRefMap(disksIds);

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

    function setRef(refVal, innerRef, columnRef) {
        columnRef.current = refVal;
        innerRef && innerRef(refVal);
    }

    const count = React.useRef(0);
    const [touchMove, setTouchMove] = React.useState({
        start: null,
        end: null,
    });
    function useMyCoolSensor(api) {
        function start() {
            const preDrag = api.tryGetLock('b1');
            if (!preDrag || count.current === 2) {
                return;
            }

            const drag = preDrag.snapLift();
            drag.moveRight();
            // drag.moveRight();

            disksRefs['b1'].current.addEventListener(
                'transitionend',
                function () {
                    drag.drop();
                    count.current = count.current + 1;
                },
                { once: true }
            );
            // drag.moveRight();

            // drag.drop();
        }

        useEffect(() => {
            // window.addEventListener('click', start);
            if (touchMove.end !== null) {
                console.log('hello world', touchMove);
                start();
            }
        }, [touchMove.end]);
    }

    const diskBeforeDrag = useRef(null);

    return (
        <main className="container py-8">
            <div className="h-12 flex justify-between items-center bg-[#012A4A] px-4 py-8 rounded shadow-lg mb-6 font-bold tracking-wide font-mono text-center">
                <p>
                    Ideal Moves
                    <br />
                    {idealMoves}
                </p>
                <p>
                    Moves
                    <br />
                    {moves}
                </p>
            </div>
            <DragDropContext
                onDragStart={() => setDragSuccess(true)}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
                sensors={isDragEnabled ? null : [useMyCoolSensor]}
                onBeforeDragStart={(result) => {
                    diskBeforeDrag.current =
                        disksRefs[result.draggableId].current.getBoundingClientRect();
                }}
            >
                <div className="flex justify-between">
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
                                            className="bg-gray-500 border border-gray-800 cursor-pointer box"
                                            ref={(refVal) =>
                                                setRef(refVal, provided.innerRef, columnRef)
                                            }
                                            {...provided.droppableProps}
                                            id={ct.id}
                                            onClick={() => {
                                                setTouchMove((prev) => {
                                                    // const prevCopy = { ...prev };
                                                    // if (
                                                    //     !prev.start &&
                                                    //     state.containers[index].blocks.length > 0
                                                    // ) {
                                                    //     console.log('failure');
                                                    //     prevCopy.start = ct.id;
                                                    // } else if (prev.start === ct.id) {
                                                    //     console.log(prev.start, ct.id);
                                                    //     prevCopy.start = null;
                                                    // } else if (prev.start) {
                                                    //     console.log('???');
                                                    //     prevCopy.end = ct.id;
                                                    // }
                                                    // console.log(prev);
                                                    console.log('clicked');
                                                    return {
                                                        start: Math.random(),
                                                        end: Math.random(),
                                                    };
                                                });
                                            }}
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
