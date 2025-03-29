import {TrashBin} from '@gravity-ui/icons';
import {Button, Table, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {getAll, remove, update} from '../../api/user';
import './UserList.scss';
import { UserDto } from '../../types/user';

const b = block('user-list');

export const UserList: React.FC = () => {
    const [users, setUsers] = useState<UserDto[]>([]);
    const [extendDaysMap, setExtendDaysMap] = useState<Record<string, string>>({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const res: UserDto[] = await getAll();
        setUsers(res);
    };

    const handleDelete = async (userId: string) => {
        try {
            await remove(userId);
            toast.success('Пользователь удален');
        } catch (error) {
            console.error(error);
            toast.error('Не удалось удалить пользователя');
        }
        setUsers((prev) => prev.filter((u) => u.id !== userId));
    };

    const getDaysLeft = (dateString?: string) => {
        if (!dateString) return '—';
        const now = new Date();
        const expires = new Date(dateString);
        const diffMs = expires.getTime() - now.getTime();
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? `${diffDays} д.` : '—';
    };

    const handleExtend = async (user: any) => {
        const days = parseInt(extendDaysMap[user.id], 10);
        if (isNaN(days)) return;

        const newDate = user.subscriptionExpiresAt
            ? new Date(user.subscriptionExpiresAt)
            : new Date();

        newDate.setDate(newDate.getDate() + days);

        newDate.toISOString();

        try {
            await update(user.id, {
                ...user,
                subscriptionExpiresAt: newDate.toISOString(),
            });
        } catch (error) {
            console.error(error);
            toast.error('Не удалось обновить пользователя');
        }

        fetchUsers();
        setExtendDaysMap((prev) => ({...prev, [user.id]: ''}));
    };

    const redirectToCreateUser = () => {
        navigate('/profile/add');
    };

    return (
        <div className={b()}>
            <div className={b('header')}>
                <h2>Пользователи</h2>
                <Button
                    onClick={redirectToCreateUser}
                    style={{color: 'white'}}
                    width="max"
                    view="action"
                    size="xl"
                >
                    Добавить
                </Button>
            </div>

            {users.length > 0 && (
                <Table
                    columns={[
                        {id: 'username', name: 'Логин'},
                        {id: 'password', name: 'Пароль'},
                        {id: 'subscriptionExpiresAt', name: 'Осталось дней'},
                        {id: 'extend', name: 'Продлить'},
                        {id: 'actions', name: ''},
                    ]}
                    data={users.map((u) => ({
                        username: u.username,
                        password: u.password,
                        subscriptionExpiresAt: getDaysLeft(u.subscriptionExpiresAt),
                        extend: (
                            <div style={{display: 'flex', gap: 8}}>
                                <TextInput
                                    size="s"
                                    type="number"
                                    placeholder="дни"
                                    value={extendDaysMap[u.id] || ''}
                                    onChange={(e) =>
                                        setExtendDaysMap((prev) => ({
                                            ...prev,
                                            [u.id]: e.target.value,
                                        }))
                                    }
                                />
                                <Button size="s" onClick={() => handleExtend(u)}>
                                    +
                                </Button>
                            </div>
                        ),
                        actions: (
                            <Button size="s" view="flat-danger" onClick={() => handleDelete(u.id)}>
                                <TrashBin />
                            </Button>
                        ),
                    }))}
                />
            )}
        </div>
    );
};
