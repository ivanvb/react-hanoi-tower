import { useRef, createRef, useEffect } from 'react';

export const useRefMap = (keys) => {
    const mapOfRefs = useRef(
        keys.reduce((acc, curr) => {
            return { ...acc, [curr]: createRef() };
        }, {})
    );

    useEffect(() => {
        const computed = keys.reduce((acc, curr) => {
            return { ...acc, [curr]: createRef() };
        }, {});

        Object.entries(computed).forEach(([key, val]) => {
            if (!mapOfRefs.current[key]) {
                mapOfRefs.current[key] = val;
            }
        });
    }, [keys.length]);

    return mapOfRefs.current;
};
