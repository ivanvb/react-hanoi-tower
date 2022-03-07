import { useRef, createRef } from 'react';

export const useRefMap = (keys) => {
    const mapOfRefs = useRef(
        keys.reduce((acc, curr) => {
            return { ...acc, [curr]: createRef() };
        }, {})
    );

    return mapOfRefs.current;
};
