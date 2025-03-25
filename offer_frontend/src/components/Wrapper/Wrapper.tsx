import {Theme, ThemeProvider} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';

import './Wrapper.scss';

const b = block('wrapper');

const LIGHT = 'light';
const DEFAULT_THEME = LIGHT;

export const DEFAULT_BODY_CLASSNAME = `g-root g-root_theme_${DEFAULT_THEME}`;

export type AppProps = {
    children: React.ReactNode;
};

export const Wrapper: React.FC<AppProps> = ({children}) => {
    const [theme] = React.useState<Theme>(DEFAULT_THEME);

    return (
        <ThemeProvider theme={theme}>
            <div className={b()}>
                <div className={b('content')}>{children}</div>
            </div>
        </ThemeProvider>
    );
};
