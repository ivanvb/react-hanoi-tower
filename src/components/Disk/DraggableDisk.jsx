import React from 'react';
import { getBlockId } from '../../controller/HanoiController';
import { getTopDiskCoords } from '../../utils/HanoiUtils';
import Disk from './Disk';

const DraggableDisk = ({
    state,
    provided,
    snapshot,
    block,
    dragSuccess,
    diskRef,
    columnRef,
    columnsRefs,
    dbd,
    disableDrag,
}) => {
    const currentId = getBlockId(block);
    const currentBlock = React.useMemo(() => {
        return state.containers.find((cont) => cont.blocks.includes(block))?.id;
    }, [state]);

    function getStyle(style, snapshot) {
        if (!style || !snapshot) return {};

        if (
            (snapshot.mode !== 'SNAP' && !snapshot.isDropAnimating) ||
            !snapshot.draggingOver ||
            snapshot.draggingOver === currentBlock
        ) {
            return style;
        }
        const targetContainer = columnsRefs[snapshot.draggingOver].current;

        // current column
        const { x, y } = getTopDiskCoords(columnRef.current, diskRef.current, dbd.current);

        // target column
        const { x: cx, y: cy } = getTopDiskCoords(targetContainer, diskRef.current);

        let translate = `translate(${cx - x}px, ${
            cy - y - diskRef.current.getBoundingClientRect().height
        }px)`;

        if (!dragSuccess) {
            translate = `translate(0px, 0px)`;
        }
        return {
            ...style,
            transform: `${translate}`,
        };
    }

    return (
        <Disk
            className={`${snapshot?.isDragging ? 'is-dragging' : ''} ${
                disableDrag ? 'pointer-events-none' : ''
            }`}
            color={state.blocks[block].color}
            diskId={currentId}
            innerRef={provided?.innerRef}
            ref={diskRef}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            style={{ ...getStyle(provided?.draggableProps.style, snapshot) }}
        />
    );
};

export default DraggableDisk;
