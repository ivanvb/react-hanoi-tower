import React from 'react';

const ResetDataButton = ({ resetData }) => {
    const [clicked, setClicked] = React.useState(false);
    return (
        <>
            {clicked ? (
                <div>
                    <span>All your progress will be lost, do you want to proceed?</span>

                    <div className="flex mt-2 space-x-4">
                        <button className="text-red-600" onClick={resetData}>
                            yes
                        </button>
                        <button onClick={() => setClicked(false)}>no</button>
                    </div>
                </div>
            ) : (
                <button
                    className="block mx-auto mt-6 text-red-600"
                    onClick={() => setClicked(true)}
                >
                    Reset Data
                </button>
            )}
        </>
    );
};

export default ResetDataButton;
