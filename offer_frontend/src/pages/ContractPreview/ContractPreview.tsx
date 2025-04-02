import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {create, getById, update} from '../../api/object';
import {renderContract} from '../../templates/renderContract';
import {ObjectDto} from '../../types/object';
import './ContractPreview.scss';

const b = block('contract-preview');

export const ContractPreview: React.FC = () => {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [form, setForm] = useState<ObjectDto | null>((location.state as ObjectDto) ?? null);
    const [loading, setLoading] = useState(!!id);

    useEffect(() => {
        if (!form && id) {
            loadObject(id);
        }
    }, [id]);

    const loadObject = async (id: string) => {
        try {
            const data = await getById(id);
            setForm(data);
        } catch (err) {
            console.error(err);
            toast.error('Ошибка при получении объекта');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!form) return;

        if (!!id) {
            try {
                const updatedObject = {
                    ...form,
                    isGenerated: true,
                };

                await update(id, updatedObject);
                toast.success('Договор создан');
                navigate('/');
            } catch (error) {
                console.error('Произошла ошибка при создании', error);
                toast.error('Не удалось создать договор');
            }
            return;
        }

        try {
            await create(form);
            toast.success('Договор создан');
            navigate('/');
        } catch (error) {
            console.error('Произошла ошибка при создании', error);
            toast.error('Не удалось создать договор');
        }
    };

    const onBack = async () => {
        if (!!id && form) {
            try {
                const updatedObject = {
                    ...form,
                    dateOfSigned: undefined,
                };

                await update(id, updatedObject);
            } catch (error) {
                console.error('Произошла ошибка при обновлении', error);
                toast.error('Не удалось сохранить объект');
            }
        }

        navigate(-1);
    };

    const contract = useMemo(() => {
        return form ? renderContract({form}) : null;
    }, [form]);

    if (!form && !id) {
        return <div className={b()}>Нет данных для предпросмотра</div>;
    }

    if (loading) {
        return <div className={b()}>Загрузка...</div>;
    }

    return (
        <div className={b()}>
            <Text
                style={{fontSize: '20px', fontWeight: 600}}
                variant="header-2"
                className={b('title')}
            >
                Ваш договор готов
            </Text>
            <Text
                style={{fontSize: '13px', fontWeight: 500, color: 'rgba(0,0,0,0.7)'}}
                variant="header-2"
                className={b('title')}
            >
                Ознакомьтесь и сохраните его
            </Text>

            <div className={b('content')}>{contract}</div>

            <div className={b('actions')}>
                <Button
                    view="action"
                    size="xl"
                    width="max"
                    style={{color: 'white'}}
                    onClick={handleConfirm}
                >
                    Подтвердить
                </Button>
                <Button view="outlined-success" size="xl" width="max" onClick={onBack}>
                    Назад
                </Button>
            </div>
        </div>
    );
};
