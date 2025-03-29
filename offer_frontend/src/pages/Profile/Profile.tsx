import {Button, Checkbox, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {cancelSubscription, getMe} from '../../api/user';
import {UserList} from '../../components/UserList';
import './Profile.scss';

const b = block('profile');

export const Profile: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [agreements, setAgreements] = useState([false, false, false, false]);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const user = await getMe();
                setUser(user);
            } catch (error) {
                toast.error('Ошибка при загрузке профиля');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className={b()}>Загрузка...</div>;
    const isAdmin = user?.roles && user?.roles?.includes('ROLE_ADMIN');

    if (isAdmin) {
        return (
            <div className={b('admin_profile')}>
                <UserList />
            </div>
        );
    }
    const hasPaidRole = user?.roles && user?.roles?.includes('ROLE_PAID_USER');
    const expiresAt = user?.subscriptionExpiresAt ? new Date(user.subscriptionExpiresAt) : null;
    const isSubscriptionActive = hasPaidRole && expiresAt && expiresAt > new Date();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/auth');
    };

    const handleCheck = (index: number) => {
        const newAgreements = [...agreements];
        newAgreements[index] = !newAgreements[index];
        setAgreements(newAgreements);
    };

    const handleBuy = () => {
        toast.error('Покупка пока что недоступна');
    };

    return (
        <div className={b()}>
            <div className={b('top')}>
                <Text
                    style={{fontSize: '20px', fontWeight: 600}}
                    variant="header-2"
                    className={b('title')}
                >
                    Ваша подписка
                </Text>

                {isSubscriptionActive ? (
                    <Text
                        style={{fontSize: '13px', backgroundColor: '#e5fcef'}}
                        className={b('status')}
                    >
                        Активна до{' '}
                        {user.subscriptionExpiresAt
                            .replace('T', ' ')
                            .substring(0, user.subscriptionExpiresAt.length - 8)}
                    </Text>
                ) : (
                    <Text
                        style={{fontSize: '13px', backgroundColor: '#fce5e5'}}
                        className={b('status')}
                        color="danger"
                    >
                        Неактивна
                    </Text>
                )}

                <Text style={{fontSize: '13px'}} className={b('description')}>
                    Doc Room – сервис для быстрого создания и подписания оферты в сфере посуточного
                    бронирования
                </Text>

                {!isSubscriptionActive && (
                    <div className={b('checkboxes')}>
                        <Checkbox checked={agreements[0]} onChange={() => handleCheck(0)}>
                            Я согласен(а) условиями{' '}
                            <a style={{color: '#30AA6E', textDecoration: 'none'}} href="/policy">
                                Политики по обработке персональных данных
                            </a>
                        </Checkbox>
                        <Checkbox checked={agreements[1]} onChange={() => handleCheck(1)}>
                            Я согласен(а) с условиями{' '}
                            <a style={{color: '#30AA6E', textDecoration: 'none'}} href="#">
                                оферты
                            </a>
                        </Checkbox>
                        <Checkbox checked={agreements[2]} onChange={() => handleCheck(2)}>
                            Я согласен(а) на ежемесячные списания с банковской карты в размере{' '}
                            <span style={{color: '#30AA6E'}}>950 рублей</span>
                        </Checkbox>
                        <Checkbox checked={agreements[3]} onChange={() => handleCheck(3)}>
                            Я согласен(а) с сохранением{' '}
                            <a style={{color: '#30AA6E', textDecoration: 'none'}} href="#">
                                учетных данных для будущих транзакций
                            </a>
                        </Checkbox>
                    </div>
                )}

                {isSubscriptionActive ? (
                    <Button
                        view="outlined-danger"
                        size="xl"
                        width="max"
                        className={b('submit')}
                        onClick={() => setShowCancelModal(true)}
                    >
                        Отменить подписку
                    </Button>
                ) : (
                    <Button
                        style={{color: 'white'}}
                        view="action"
                        size="xl"
                        width="max"
                        className={b('submit')}
                        onClick={handleBuy}
                        disabled={!agreements.every((agreement) => agreement)}
                    >
                        Оформить за 950 руб/мес
                    </Button>
                )}

                {!isSubscriptionActive && (
                    <Text
                        style={{fontSize: '10px'}}
                        className={b('cancel-info')}
                        variant="body-2"
                        color="secondary"
                    >
                        Отменить подписку можно в любой момент
                    </Text>
                )}
            </div>

            <div className={b('bottom')}>
                <Text style={{fontSize: '10px'}} className={b('footer')} variant="body-2">
                    ИП Семенов Илья Сергеевич, ИНН 026706792471
                </Text>

                <Button
                    onClick={handleLogout}
                    view="outlined-danger"
                    selected
                    size="xl"
                    className={b('logout')}
                >
                    Выйти из аккаунта
                </Button>
            </div>

            {showCancelModal && (
                <div className={b('modal')}>
                    <div className={b('modal-content')}>
                        <Text variant="header-2" style={{fontSize: '17px', marginBottom: 8}}>
                            Вы действительно хотите отменить подписку
                        </Text>
                        <Text
                            variant="body-2"
                            color="secondary"
                            style={{fontSize: '15px', marginBottom: 16}}
                        >
                            Оферты и текущая база подписей станет недоступна — в случае спора вы не
                            сможете доказать факт заключения договора
                        </Text>
                        <div style={{width: '100%', display: 'flex', gap: 12}}>
                            <Button
                                view="outlined-danger"
                                selected
                                size="xl"
                                width="max"
                                className={b('logout')}
                                onClick={async () => {
                                    try {
                                        await cancelSubscription(user.id);
                                        toast.success('Подписка отменена');
                                        setShowCancelModal(false);
                                        const updated = await getMe();
                                        setUser(updated);
                                    } catch (e) {
                                        toast.error('Не удалось отменить подписку');
                                    }
                                }}
                            >
                                Да
                            </Button>
                            <Button
                                view="normal"
                                size="xl"
                                width="max"
                                style={{width: '100%'}}
                                onClick={() => setShowCancelModal(false)}
                            >
                                Нет
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
