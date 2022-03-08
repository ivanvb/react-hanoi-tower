import React from 'react';
import { getBlockId } from '../../controller/HanoiController';
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

        // Here we clone the current disk, which is being dragged, and remove the styles applied
        // by the library to allow it to be placed into its original position. We make two clones of it
        // because we need to insert one into each container to calculate the translate distance so the
        // animation displays properly
        const dummy = diskRef.current.cloneNode();
        dummy.removeAttribute('style');
        const d2 = dummy.cloneNode();

        targetContainer.prepend(dummy);
        const { x, y } = dummy.getBoundingClientRect();

        columnRef.current.prepend(d2);
        const { x: cx, y: cy } = d2.getBoundingClientRect();
        let translate = `translate(${x - cx}px, ${y - cy}px)`;
        dummy.remove();
        d2.remove();

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
