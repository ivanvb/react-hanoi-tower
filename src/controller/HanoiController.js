export const levels = [2, 3, 4, 5, 6, 7, 8, 9, 10];

export function getData(blocks, columns = 3) {
    const data = { blocks: {}, containers: [] };

    const blocksIds = [];
    for (let i = 1; i <= blocks; i++) {
        const blockId = 'b' + i;
        data.blocks[blockId] = {};
        blocksIds.push(blockId);
    }

    for (let i = 1; i <= columns; i++) {
        const columnId = 'c' + i;
        data.containers.push({
            id: columnId,
            blocks: [],
        });
    }

    data.containers[0].blocks = blocksIds;

    return data;
}

export function getBlockId(block) {
    return Number?.parseInt(block?.replace('b', '')) || null;
}

export function getColId(col) {
    return Number?.parseInt(col?.replace('c', '')) || null;
}

export function canMove(state, destinationId, draggableId) {
    const destinationTop = state.containers.find((el) => el.id === destinationId)?.blocks?.[0];

    const draggableParsedId = getBlockId(draggableId);
    const destinationParsedId = getBlockId(destinationTop) || Number.POSITIVE_INFINITY;

    return draggableParsedId < destinationParsedId;
}

export function performMovement(state, draggableId, sourceId, destinationId) {
    const { containers } = state;
    containers.forEach((el) => {
        const { id, blocks } = el;
        if (id === destinationId) {
            blocks.unshift(draggableId);
        }

        if (id === sourceId) {
            blocks.shift();
        }
    });

    return {
        ...state,
        containers,
    };
}

export function getTopDisk(state, containerId) {
    return state.containers.find(({ id }) => id === containerId)?.blocks?.[0] || null;
}

export function isVictoryState(state, victoryIndex) {
    return state.containers.reduce((acc, curr, i) => {
        if (!acc) return acc;

        const isContainerEmpty = curr.blocks.length === 0;

        return i === victoryIndex ? !isContainerEmpty : isContainerEmpty;
    }, true);
}

export function calculateRating(moves, idealMoves) {
    if (moves === idealMoves) {
        return 3;
    } else if (moves <= idealMoves * 1.25) {
        return 2;
    } else {
        return 1;
    }
}
