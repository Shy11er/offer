import {Button, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useState} from 'react';
import './Auth.scss';
import {login} from '../../api/auth';
import {useNavigate} from 'react-router-dom';
import toast from 'react-hot-toast';

const b = block('auth');

export const Auth: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(username, password);
            toast.success('Вы успешно вошли в систему');
            navigate('/');
        } catch (error) {
            toast.error('Ошибка авторизации');
            console.error('Ошибка входа', error);
        }
    };

    return (
        <div className={b()}>
            <form className={b('form')} onSubmit={handleSubmit}>
                <Text className={b('title')} variant="header-2">
                    Авторизация
                </Text>
                <Text className={b('subtitle')} variant="body-2" color="secondary">
                    Войдите в админ-панель
                </Text>

                <TextInput
                    size="xl"
                    placeholder="Логин"
                    className={b('input')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextInput
                    size="xl"
                    placeholder="Пароль"
                    type="password"
                    className={b('input')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <Button style={{color: 'white'}} type="submit" view="action" size="xl" width="max">
                    Войти
                </Button>
            </form>
        </div>
    );
};
