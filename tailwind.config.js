module.exports = {
    content: ['src/**/**.jsx'],
    theme: {
        extend: {
            colors: {
                primary: {
                    300: '#B2D6F7',
                    400: '#86A9D1',
                    500: '#5D7CA2',
                    700: '#3D567C',
                    900: '#27334B',
                },
                secondary: {
                    500: '#9D9DCE',
                },
                wall: {
                    500: '#eeefff',
                },
                accent: {
                    500: '#F7D3B2',
                    700: '#D0AD86',
                },
            },
            container: {
                center: true,
                padding: {
                    DEFAULT: '1rem',
                    md: '2rem',
                },
            },
        },
    },
};
