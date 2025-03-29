// src/components/BottomNavbar.tsx
import React from 'react';
import {NavLink} from 'react-router-dom';
import {House, FileText, Person} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import './BottomNavbar.scss';

const b = block('bottom-navbar');

export const BottomNavbar: React.FC = () => {
    return (
        <nav className={b()}>
            <NavLink to="/" className={({isActive}) => b('item', {active: isActive})}>
                <House />
                <span>Объекты</span>
            </NavLink>
            <NavLink to="/reports" className={({isActive}) => b('item', {active: isActive})}>
                <FileText />
                <span>Отчеты</span>
            </NavLink>
            <NavLink to="/profile" className={({isActive}) => b('item', {active: isActive})}>
                <Person />
                <span>Профиль</span>
            </NavLink>
        </nav>
    );
};
