import React from 'react';
import { getRandomInt } from '../../utils';

const MIN_SPEED = 20;
const MAX_SPEED = 60;

const circles = [...Array(getRandomInt(12, 25))].map(() => {
    const speedX = getRandomInt(MIN_SPEED, MAX_SPEED);
    const speedY = getRandomInt(MIN_SPEED, MAX_SPEED);

    return {
        size: getRandomInt(90, 115),
        speed: {
            x: speedX,
            y: speedY,
        },
        delay: {
            x: getRandomInt(speedX * -2, 0),
            y: getRandomInt(speedY * -2, 0),
        },
    };
});

const BackgroundCircle = ({ speed, delay, size }) => {
    return (
        <div
            className="circle-container x"
            style={{
                '--speed-x': `${speed.x}s`,
                '--delay-x': `${delay.x}s`,
                '--size': `${size}px`,
            }}
        >
            <div
                className="circle y"
                style={{
                    '--speed-y': `${speed.y}s`,
                    '--delay-y': `${delay.y}s`,
                }}
            ></div>
        </div>
    );
};

const AnimatedBackground = React.memo(() => {
    return (
        <div className="fixed top-0 w-full h-full -z-10">
            {circles.map((circle, i) => {
                return <BackgroundCircle {...circle} key={i} />;
            })}
        </div>
    );
});

export default AnimatedBackground;
