import {CircleCheck} from '@gravity-ui/icons';
import block from 'bem-cn-lite';
import React from 'react';
import './SuccessPage.scss';

const b = block('success_page');

const SuccessPage: React.FC = () => {
    return (
        <div className={b()}>
            <CircleCheck className={b('icon')} />
            <h2>Договор-оферта подписан</h2>
            <p>Сохранили вашу подпись в логах</p>
        </div>
    );
};

export default SuccessPage;
