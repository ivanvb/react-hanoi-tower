import { forwardRef } from 'react';

const Disk = forwardRef(({ className, color, diskId, style, innerRef, ...rest }, ref) => {
    function setRef(refVal) {
        if (ref) {
            ref.current = refVal;
        }
        innerRef && innerRef(refVal);
    }

    return (
        <div ref={setRef} {...rest} style={style} className={`${className} disk`}>
            <div
                className="relative h-[12px] tall:h-[14px] lg:h-[16.5px] rounded-xl disk-content"
                style={{
                    backgroundColor: color,
                    '--disk-id': diskId,
                }}
            >
                <span className="absolute block text-[0.625rem] tall:text-xs -translate-x-1/2 -translate-y-1/2 select-none top-1/2 left-1/2">
                    {diskId}
                </span>
            </div>
        </div>
    );
});

export default Disk;
