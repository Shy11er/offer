import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {getAll} from '../../api/object';
import {AdminObjectList} from '../../components/AdminObjectList';
import {ObjectDto} from '../../types/object';
import './Object.scss';

const b = block('object');

export const Object: React.FC = () => {
    const [objects, setObjects] = useState<ObjectDto[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAll();
                setObjects(data);
            } catch (e) {
                console.error('Ошибка при получении объектов', e);
                toast.error('Ошибка при получении объектов');
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) {
        return <div className={b()}>Загрузка...</div>;
    }

    if (objects.length === 0) {
        return (
            <div className={b('empty')}>
                <Text variant="header-2" className={b('title')}>
                    У вас нет договоров
                </Text>
                <Text variant="body-2" className={b('subtitle')} color="secondary">
                    Создайте его прямо сейчас
                </Text>
                <Button
                    style={{color: 'white'}}
                    size="xl"
                    view="action"
                    className={b('create')}
                    onClick={() => navigate('/objects/new')}
                >
                    Создать
                </Button>
            </div>
        );
    }

    return (
        <div className={b()}>
            <AdminObjectList objects={objects} setObjects={setObjects} />
        </div>
    );
};
