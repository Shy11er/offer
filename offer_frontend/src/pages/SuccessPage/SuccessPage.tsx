import {CircleCheck} from '@gravity-ui/icons';
// import {Button} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
// import {useNavigate} from 'react-router-dom';
import './SuccessPage.scss';

const b = block('success_page');

const SuccessPage: React.FC = () => {
    // const navigate = useNavigate();

    // const handleBack = () => {
    //     navigate('/');
    // };

    return (
        <div className={b()}>
            <CircleCheck className={b('icon')} />
            <h2>Договор-оферта подписан</h2>
            <p>Сохранили вашу подпись в логах</p>
            {/* <Button onClick={handleBack} style={{marginTop: '20px'}}>
                Вернуться на главную
            </Button> */}
        </div>
    );
};

export default SuccessPage;
