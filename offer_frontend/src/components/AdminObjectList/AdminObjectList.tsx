import {ObjectDto} from '@/types/object';
import {DateField} from '@gravity-ui/date-components';
import {dateTimeParse} from '@gravity-ui/date-utils';
import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {update} from '../../api/object';
import './AdminObjectList.scss';

const b = block('admin_object');

interface Props {
    objects: ObjectDto[];
    setObjects: React.Dispatch<React.SetStateAction<ObjectDto[]>>;
}

export const AdminObjectList: React.FC<Props> = ({objects, setObjects}) => {
    const navigate = useNavigate();

    const handleDateChange = (id: string, field: 'startDate' | 'endDate', value: string | null) => {
        setObjects((prev) =>
            prev.map((o) => (o.id === id ? {...o, [field]: value ?? undefined} : o)),
        );
    };

    if (objects.length === 0) {
        return (
            <div className={b('empty')}>
                <Text variant="header-2" className={b('title')}>
                    Объекты не найдены
                </Text>
            </div>
        );
    }

    const onGenerate = async (objectId: string, object: ObjectDto) => {
        try {
            if (!object.startDate || !object.endDate) {
                toast.error('Укажите дату начала и завершения');
                return;
            }

            const updatedObject = {
                ...object,
                dateOfSigned: new Date().toISOString(),
            };

            await update(objectId, updatedObject);

            setObjects((prev) => prev.map((o) => (o.id === objectId ? updatedObject : o)));

            navigate(`/objects/preview/${objectId}`);
        } catch (error) {
            console.error('Произошла ошибка при обновлении', error);
            toast.error('Не удалось сохранить объект');
        }
    };

    const onEdit = (objectId: string) => {
        navigate(`/objects/${objectId}/edit`);
    };

    const onCopyLink = async (objectId: string) => {
        const link = `${window.location.origin}/contracts/${objectId}`;
        try {
            await navigator.clipboard.writeText(link);
            toast.success('Ссылка скопирована!');
        } catch (err) {
            console.error('Ошибка копирования ссылки', err);
            toast.error('Не удалось скопировать ссылку');
        }
    };

    return (
        <div className={b()}>
            <Text variant="header-2" className={b('title')} style={{marginBottom: 24}}>
                Мои объекты
            </Text>

            {objects.map((object) => (
                <div key={object.id} className={b('admin-card')}>
                    <div className={b('info')}>
                        <svg
                            width="50"
                            height="50"
                            viewBox="0 0 50 50"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="25"
                                cy="25"
                                r="23.5"
                                fill="white"
                                stroke="#30AA6E"
                                strokeWidth="3"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M18.0769 17.3077H21.1538C21.3579 17.3077 21.5535 17.3887 21.6978 17.533C21.842 17.6773 21.9231 17.8729 21.9231 18.0769V21.1538C21.9231 21.3579 21.842 21.5535 21.6978 21.6978C21.5535 21.842 21.3579 21.9231 21.1538 21.9231H18.0769C17.8729 21.9231 17.6773 21.842 17.533 21.6978C17.3887 21.5535 17.3077 21.3579 17.3077 21.1538V18.0769C17.3077 17.8729 17.3887 17.6773 17.533 17.533C17.6773 17.3887 17.8729 17.3077 18.0769 17.3077ZM15 18.0769C15 17.2609 15.3242 16.4782 15.9012 15.9012C16.4782 15.3242 17.2609 15 18.0769 15H21.1538C21.9699 15 22.7525 15.3242 23.3296 15.9012C23.9066 16.4782 24.2308 17.2609 24.2308 18.0769V21.1538C24.2308 21.9699 23.9066 22.7525 23.3296 23.3296C22.7525 23.9066 21.9699 24.2308 21.1538 24.2308H18.0769C17.2609 24.2308 16.4782 23.9066 15.9012 23.3296C15.3242 22.7525 15 21.9699 15 21.1538V18.0769ZM28.8462 17.3077H31.9231C32.1271 17.3077 32.3227 17.3887 32.467 17.533C32.6113 17.6773 32.6923 17.8729 32.6923 18.0769V21.1538C32.6923 21.3579 32.6113 21.5535 32.467 21.6978C32.3227 21.842 32.1271 21.9231 31.9231 21.9231H28.8462C28.6421 21.9231 28.4465 21.842 28.3022 21.6978C28.158 21.5535 28.0769 21.3579 28.0769 21.1538V18.0769C28.0769 17.8729 28.158 17.6773 28.3022 17.533C28.4465 17.3887 28.6421 17.3077 28.8462 17.3077ZM25.7692 18.0769C25.7692 17.2609 26.0934 16.4782 26.6704 15.9012C27.2475 15.3242 28.0301 15 28.8462 15H31.9231C32.7391 15 33.5218 15.3242 34.0988 15.9012C34.6758 16.4782 35 17.2609 35 18.0769V21.1538C35 21.9699 34.6758 22.7525 34.0988 23.3296C33.5218 23.9066 32.7391 24.2308 31.9231 24.2308H28.8462C28.0301 24.2308 27.2475 23.9066 26.6704 23.3296C26.0934 22.7525 25.7692 21.9699 25.7692 21.1538V18.0769ZM21.1538 28.0769H18.0769C17.8729 28.0769 17.6773 28.158 17.533 28.3022C17.3887 28.4465 17.3077 28.6421 17.3077 28.8462V31.9231C17.3077 32.1271 17.3887 32.3227 17.533 32.467C17.6773 32.6113 17.8729 32.6923 18.0769 32.6923H21.1538C21.3579 32.6923 21.5535 32.6113 21.6978 32.467C21.842 32.3227 21.9231 32.1271 21.9231 31.9231V28.8462C21.9231 28.6421 21.842 28.4465 21.6978 28.3022C21.5535 28.158 21.3579 28.0769 21.1538 28.0769ZM18.0769 25.7692C17.2609 25.7692 16.4782 26.0934 15.9012 26.6704C15.3242 27.2475 15 28.0301 15 28.8462V31.9231C15 32.7391 15.3242 33.5218 15.9012 34.0988C16.4782 34.6758 17.2609 35 18.0769 35H21.1538C21.9699 35 22.7525 34.6758 23.3296 34.0988C23.9066 33.5218 24.2308 32.7391 24.2308 31.9231V28.8462C24.2308 28.0301 23.9066 27.2475 23.3296 26.6704C22.7525 26.0934 21.9699 25.7692 21.1538 25.7692H18.0769ZM28.8462 28.0769H31.9231C32.1271 28.0769 32.3227 28.158 32.467 28.3022C32.6113 28.4465 32.6923 28.6421 32.6923 28.8462V31.9231C32.6923 32.1271 32.6113 32.3227 32.467 32.467C32.3227 32.6113 32.1271 32.6923 31.9231 32.6923H28.8462C28.6421 32.6923 28.4465 32.6113 28.3022 32.467C28.158 32.3227 28.0769 32.1271 28.0769 31.9231V28.8462C28.0769 28.6421 28.158 28.4465 28.3022 28.3022C28.4465 28.158 28.6421 28.0769 28.8462 28.0769ZM25.7692 28.8462C25.7692 28.0301 26.0934 27.2475 26.6704 26.6704C27.2475 26.0934 28.0301 25.7692 28.8462 25.7692H31.9231C32.7391 25.7692 33.5218 26.0934 34.0988 26.6704C34.6758 27.2475 35 28.0301 35 28.8462V31.9231C35 32.7391 34.6758 33.5218 34.0988 34.0988C33.5218 34.6758 32.7391 35 31.9231 35H28.8462C28.0301 35 27.2475 34.6758 26.6704 34.0988C26.0934 33.5218 25.7692 32.7391 25.7692 31.9231V28.8462Z"
                                fill="#30AA6E"
                            />
                        </svg>

                        <div className={b('info_text')}>
                            <Text
                                style={{fontSize: '15px', fontWeight: 400}}
                                variant="subheader-2"
                                className={b('address')}
                            >
                                {object.address ?? 'Без адреса'}
                            </Text>
                            <Text
                                style={{fontSize: '15px', fontWeight: 400}}
                                variant="body-2"
                                color="secondary"
                            >
                                {object.ownerName ?? 'Неизвестный владелец'}
                            </Text>
                        </div>
                    </div>

                    <DateField
                        className={b('input')}
                        size="xl"
                        placeholder="Дата и время начала аренды"
                        defaultValue={object.startDate ? dateTimeParse(object.startDate) : null}
                        value={object.startDate ? dateTimeParse(object.startDate) : null}
                        onUpdate={(val: any) => handleDateChange(object.id, 'startDate', val)}
                        hasClear
                    />

                    <DateField
                        className={b('input')}
                        size="xl"
                        placeholder="Дата и время завершения аренды"
                        value={object.endDate ? dateTimeParse(object.endDate) : null}
                        defaultValue={object.endDate ? dateTimeParse(object.endDate) : null}
                        onUpdate={(val: any) => handleDateChange(object.id, 'endDate', val)}
                        hasClear
                    />

                    <div className={b('actions')}>
                        <Button
                            view="action"
                            size="xl"
                            width="max"
                            style={{color: 'white'}}
                            onClick={() => onEdit(object.id)}
                        >
                            Редактировать
                        </Button>
                        {object.isGenerated ? (
                            <Button
                                view="outlined-success"
                                size="xl"
                                width="max"
                                onClick={() => onCopyLink(object.id)}
                            >
                                Скопировать ссылку
                            </Button>
                        ) : (
                            <Button
                                view="outlined-success"
                                size="xl"
                                width="max"
                                onClick={() => onGenerate(object.id, object)}
                            >
                                Сгенерировать
                            </Button>
                        )}
                    </div>
                </div>
            ))}
            <Button
                style={{color: 'white', margin: '20px'}}
                size="xl"
                view="action"
                width="max"
                className={b('create')}
                onClick={() => navigate('/objects/new')}
            >
                Создать новый объект
            </Button>
        </div>
    );
};
