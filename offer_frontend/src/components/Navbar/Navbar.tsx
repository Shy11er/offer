import React from 'react';
import block from 'bem-cn-lite';

import './Navbar.scss';

const b = block('navbar');

export const Navbar: React.FC = () => {
    return <div className={b()}>
        <h1>Doc Room</h1>
    </div>;
};
