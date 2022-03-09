import { forwardRef } from 'react';

const Disk = forwardRef(({ className, color, diskId, style, innerRef, ...rest }, ref) => {
    const calculatedWidth = diskId * 20;

    function setRef(refVal) {
        if (ref) {
            ref.current = refVal;
        }
        innerRef && innerRef(refVal);
    }

    return (
        <div ref={setRef} {...rest} style={style} className={`${className} disk`}>
            <div
                className="relative h-[17px] lg:h-[20px] rounded-xl"
                style={{
                    backgroundColor: color,
                    width: calculatedWidth,
                }}
            >
                <span className="absolute block text-xs -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2">
                    {diskId}
                </span>
            </div>
        </div>
    );
});

export default Disk;
