import React, { useCallback, useRef } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { getData, canMove, performMovement } from './controller/HanoiController';
import DraggableDisk from './components/Disk/DraggableDisk';
import { useRefMap } from './hooks/useRefMap';

const data = getData();
const disksIds = data.containers.reduce((acc, curr) => [...acc, ...curr.blocks], []);

function App() {
    const [state, setState] = React.useState(data);
    const [dragSuccess, setDragSuccess] = React.useState(true);

    const columnsRefs = useRefMap(data.containers.map(({ id }) => id));
    const disksRefs = useRefMap(disksIds);

    const onDragEnd = useCallback((result) => {
        const { destination, draggableId, source } = result;

        const canPerformMovement = canMove(state, destination?.droppableId, draggableId);
        if (canPerformMovement && destination?.droppableId) {
            setState((prev) => ({
                ...performMovement(prev, draggableId, source.droppableId, destination.droppableId),
            }));
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

    return (
        <main className="container py-8">
            <DragDropContext
                onDragStart={() => setDragSuccess(true)}
                onDragUpdate={onDragUpdate}
                onDragEnd={onDragEnd}
            >
                <div className="flex justify-between">
                    {state.containers.map((ct) => {
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
                                            className="box"
                                            ref={(refVal) =>
                                                setRef(refVal, provided.innerRef, columnRef)
                                            }
                                            {...provided.droppableProps}
                                            id={ct.id}
                                        >
                                            {provided.placeholder}
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
