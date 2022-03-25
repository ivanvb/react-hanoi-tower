module.exports = {
    content: ['src/**/**.jsx'],
    theme: {
        extend: {
            colors: {
                primary: {
                    300: '#0054A3',
                    500: '#004078',
                    700: '#001d3d',
                    900: '#001329',
                },
                secondary: {
                    300: '#B2B7FF',
                    500: '#5C64E5',
                },
                accent: {
                    500: '#B8D2F5',
                },
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1.5rem',
                    md: '2rem',
                },
            },
            screens: {
                medium: { raw: '(min-height: 625px)' },
                tall: { raw: '(min-height: 700px)' },
            },
        },
    },
};
