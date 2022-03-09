import React from 'react';
import { getBlockId } from '../../controller/HanoiController';
import { getPixelValue } from '../../utils/DOM';
import Disk from './Disk';

function getTopDiskCoords(container, currentDisk, topDiskDims) {
    const { width: currentWidth, height: currentHeight } = currentDisk.getBoundingClientRect();
    if (!topDiskDims) {
        topDiskDims = container.querySelector('.disk')?.getBoundingClientRect();
    }

    if (!topDiskDims) {
        const paddingBottom = getPixelValue(container, 'padding-bottom');
        const { x, y, height, width } = container.getBoundingClientRect();

        const yPos = Math.floor(y + height - paddingBottom - currentHeight / 2);
        const xPos = x + width / 2 - currentWidth / 2;

        return { x: xPos, y: yPos };
    } else {
        const { x: containerX, width: containerWidth } = container.getBoundingClientRect();
        const { y, height } = topDiskDims;

        return {
            y: Math.ceil(y + height / 2),
            x: containerX + containerWidth / 2 - currentWidth / 2,
        };
    }
}

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

        let translate = `translate(${cx - x}px, ${cy - y}px)`;

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
            className={`${snapshot?.isDragging ? 'is-dragging' : ''} `}
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
