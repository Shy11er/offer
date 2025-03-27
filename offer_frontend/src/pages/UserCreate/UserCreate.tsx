import {Button, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {create} from '../../api/user';
import './UserCreate.scss';

const b = block('user-create');

export const UserCreate: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{username?: string; password?: string}>({});
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: typeof errors = {};
        if (username.length < 3) newErrors.username = 'Минимум 3 символа';
        if (password.length < 5) newErrors.password = 'Минимум 5 символов';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreate = async () => {
        if (!validate()) return;

        try {
            await create({username: username, password: password});
            toast.success('Пользователь создан');
            navigate(-1);
        } catch (e) {
            toast.error('Ошибка при создании пользователя');
            console.error('Ошибка при создании пользователя', e);
        }
    };

    return (
        <div className={b()}>
            <div className={b('actions')}>
                <Button
                    style={{color: 'white'}}
                    width="max"
                    view="action"
                    size="xl"
                    onClick={() => navigate(-1)}
                >
                    Назад
                </Button>
                <Button
                    style={{color: 'white'}}
                    width="max"
                    view="action"
                    size="xl"
                    onClick={handleCreate}
                >
                    Создать
                </Button>
            </div>

            <TextInput
                className={b('input')}
                placeholder="Логин"
                size="xl"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                validationState={errors.username ? 'invalid' : undefined}
                errorMessage={errors.username}
            />
            <TextInput
                className={b('input')}
                placeholder="Пароль"
                size="xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validationState={errors.password ? 'invalid' : undefined}
                errorMessage={errors.password}
            />
        </div>
    );
};
