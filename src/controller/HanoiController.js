const initialData = {
    blocks: {
        b1: {
            color: '#9B287B',
        },
        b2: {
            color: '#5C174E',
        },
        b3: {
            color: '#402039',
        },
        b4: {
            color: '#170F11',
        },
    },
    containers: [
        {
            id: 'c1',
            blocks: ['b1', 'b2', 'b3', 'b4'],
        },
        {
            id: 'c2',
            blocks: [],
        },
        {
            id: 'c3',
            blocks: [],
        },
    ],
};

export function getData() {
    return { ...initialData };
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
