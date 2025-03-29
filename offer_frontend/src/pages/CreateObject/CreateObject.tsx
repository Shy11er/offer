import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate, useParams} from 'react-router-dom';
import {ObjectDto, ObjectType, OwnerType} from '../../types/object';
import './CreateObject.scss';
import {Step3Form} from './steps/Step3Form';
import { getById } from '../../api/object';

const b = block('create-object');

export const CreateObject: React.FC = () => {
    const { id } = useParams();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState<Partial<ObjectDto>>({});
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            getObject(id);
            setStep(3);
        }
    }, [id]);

    const getObject = async (objectId: string) => {
        try {
            const data = await getById(objectId);
            setForm(data);
        } catch (err) {
            toast.error('Не удалось получить данные для редактирования');
            navigate('/objects');
        }
    }

    const handleTypeSelect = (value: ObjectType) => {
        setForm((prev) => ({...prev, objectType: value}));
    };

    const handleOwnerTypeSelect = (value: OwnerType) => {
        setForm((prev) => ({...prev, ownerType: value}));
    };

    const handleChange = (field: keyof ObjectDto, value: any) => {
        setForm((prev) => ({...prev, [field]: value}));
    };

    const handleSubmit = async () => {
        try {
            navigate(`/objects/preview`, {state: form});
        } catch (err) {
            toast.error('Не удалось создать объект');
        }
    };

    return (
        <div className={b()}>
            {step === 1 && (
                <div className={b('step')}>
                    <Text variant="header-2" className={b('title')}>
                        Создание договора
                    </Text>
                    <Text variant="body-2" className={b('subtitle')}>
                        Выберите формат
                    </Text>

                    <div className={b('options')}>
                        <Button
                            view={form.objectType === 'APARTMENT' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: form.objectType === 'APARTMENT' ? 'white' : undefined}}
                            onClick={() => handleTypeSelect(ObjectType.APARTMENT)}
                        >
                            Недвижимость
                        </Button>
                        <Button
                            view={form.objectType === 'TECHNIQUE' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: form.objectType === 'TECHNIQUE' ? 'white' : undefined}}
                            onClick={() => handleTypeSelect(ObjectType.TECHNIQUE)}
                        >
                            Техника
                        </Button>
                        <Button
                            view={form.objectType === 'SERVICE' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{
                                color: form.objectType === 'SERVICE' ? 'white' : undefined,
                            }}
                            onClick={() => handleTypeSelect(ObjectType.SERVICE)}
                        >
                            Услуги
                        </Button>
                    </div>

                    <Button
                        style={{color: 'white'}}
                        type="submit"
                        view="action"
                        size="xl"
                        width="max"
                        disabled={!form.objectType}
                        onClick={() => setStep(2)}
                    >
                        Далее
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className={b('step')}>
                    <Text variant="header-2" className={b('title')}>
                        Выберите тип
                    </Text>
                    <Text variant="body-2" className={b('subtitle')}>
                        Какой ваш правовой статус?
                    </Text>

                    <div className={b('options')}>
                        <Button
                            view={form.ownerType === 'LEGAL' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: form.ownerType === 'LEGAL' ? 'white' : undefined}}
                            onClick={() => handleOwnerTypeSelect(OwnerType.LEGAL)}
                        >
                            Юр.лицо/ИП
                        </Button>
                        <Button
                            view={form.ownerType === 'PHYSICAL' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: form.ownerType === 'PHYSICAL' ? 'white' : undefined}}
                            onClick={() => handleOwnerTypeSelect(OwnerType.PHYSICAL)}
                        >
                            Физическое лицо
                        </Button>
                    </div>

                    <Button
                        style={{color: 'white'}}
                        type="submit"
                        view="action"
                        size="xl"
                        width="max"
                        disabled={!form.ownerType}
                        onClick={() => setStep(3)}
                    >
                        Далее
                    </Button>
                </div>
            )}

            {step === 3 && (
                <Step3Form
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
};
