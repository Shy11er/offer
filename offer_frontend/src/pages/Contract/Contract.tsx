import {Button, Checkbox, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useMemo, useState} from 'react';
import toast from 'react-hot-toast';
import InputMask from 'react-input-mask';
import {useNavigate, useParams} from 'react-router-dom';
import {createContract} from '../../api/contract';
import {getById} from '../../api/object';
import {renderContract} from '../../templates/renderContract';
import {ObjectDto} from '../../types/object';
import './Contract.scss';

const b = block('contract');

interface IFormData {
    fullName: string;
    passportNumber: string;
    passportSeries: string;
    address: string;
    phone: string;
}

export const Contract: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [object, setObject] = useState<ObjectDto | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [agreedPolicy, setAgreedPolicy] = useState(false);
    const [agreedOffer, setAgreedOffer] = useState(false);
    const [formData, setFormData] = useState<IFormData>({
        fullName: '',
        passportNumber: '',
        passportSeries: '',
        address: '',
        phone: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        const newErrors: any = {};

        if (!formData.fullName || formData.fullName.split(' ').length < 2) {
            newErrors.fullName = 'ФИО должно содержать как минимум два слова!';
        }
        if (!formData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен!';
        if (!formData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна!';
        if (!formData.address) newErrors.address = 'Адрес обязателен!';
        if (!formData.phone || formData.phone.length !== 18)
            newErrors.phone = 'Телефон обязателен!';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0 && object) {
            try {
                await createContract({
                    objectDto: object,
                    fullName: formData.fullName,
                    passportSeries: formData.passportSeries,
                    passportNumber: formData.passportNumber,
                    address: formData.address,
                    phone: formData.phone,
                    signedAt: new Date().toISOString(),
                });

                navigate('/contracts/success');
                toast.success('Договор успешно подпишен.');
            } catch (err) {
                console.error('Ошибка при создании контракта:', err);
                toast.error('Не удалось создать договор. Попробуйте позже.');
            }
        }
    };

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                const data = await getById(id);
                setObject(data);
            } catch (error) {
                console.error('Ошибка при загрузке контракта:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    useEffect(() => {
        if (object?.contract) {
            const contract = object.contract;
            setFormData({
                fullName: contract.fullName || '',
                passportSeries: contract.passportSeries || '',
                passportNumber: contract.passportNumber || '',
                address: contract.address || '',
                phone: contract.phone || '',
            });
        }
    }, [object]);

    const contract = useMemo(() => {
        if (!object) return null;
        return renderContract({form: object});
    }, [object]);
    const isAlreadySigned = useMemo(() => {
        return !!object?.contract;
    }, [object]);

    if (loading) return <div className={b()}>Загрузка...</div>;
    if (!object) return <div className={b()}>Договор не найден</div>;

    return (
        <div className={b()}>
            <div className={b('content')}>{contract}</div>
            <section className={b('form')}>
                <h4>Заполните ваши данные для подписания договора</h4>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        size="xl"
                        placeholder="ФИО"
                        className={b('input')}
                        value={formData.fullName}
                        disabled={isAlreadySigned}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, fullName: e.target.value}))
                        }
                        validationState={
                            isSubmitted &&
                            (!formData.fullName || formData.fullName.split(' ').length < 2)
                                ? 'invalid'
                                : undefined
                        }
                        errorMessage={isSubmitted && errors.fullName}
                    />
                    <InputMask
                        mask="9999"
                        maskPlaceholder=" "
                        alwaysShowMask={false}
                        disabled={isAlreadySigned}
                        value={formData.passportSeries}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, passportSeries: e.target.value}))
                        }
                    >
                        {(inputProps) => (
                            <TextInput
                                {...inputProps}
                                size="xl"
                                placeholder="Серия паспорта"
                                className={b('input')}
                                value={formData.passportSeries}
                                disabled={isAlreadySigned}
                                validationState={
                                    isSubmitted && !formData.passportSeries ? 'invalid' : 'normal'
                                }
                                errorMessage={isSubmitted && errors.passportSeries}
                            />
                        )}
                    </InputMask>
                    <InputMask
                        mask="999999"
                        maskPlaceholder=" "
                        alwaysShowMask={false}
                        disabled={isAlreadySigned}
                        value={formData.passportNumber}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, passportNumber: e.target.value}))
                        }
                    >
                        {(inputProps) => (
                            <TextInput
                                {...inputProps}
                                size="xl"
                                placeholder="Номер паспорта"
                                value={formData.passportNumber}
                                className={b('input')}
                                disabled={isAlreadySigned}
                                validationState={
                                    isSubmitted && !formData.passportNumber ? 'invalid' : 'normal'
                                }
                                errorMessage={isSubmitted && errors.passportNumber}
                            />
                        )}
                    </InputMask>
                    <TextInput
                        size="xl"
                        placeholder="Адрес регистрации"
                        className={b('input')}
                        disabled={isAlreadySigned}
                        value={formData.address}
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, address: e.target.value}))
                        }
                        validationState={isSubmitted && !formData.address ? 'invalid' : undefined}
                        errorMessage={isSubmitted && errors.address}
                    />
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        maskPlaceholder=" "
                        disabled={isAlreadySigned}
                        value={formData.phone}
                        alwaysShowMask={false}
                        onChange={(e) => setFormData((prev) => ({...prev, phone: e.target.value}))}
                    >
                        {(inputProps) => (
                            <TextInput
                                {...inputProps}
                                size="xl"
                                placeholder="Телефон"
                                className={b('input')}
                                disabled={isAlreadySigned}
                                value={formData.phone}
                                validationState={
                                    isSubmitted && (!formData.phone || formData.phone.length != 18)
                                        ? 'invalid'
                                        : 'normal'
                                }
                                errorMessage={isSubmitted && errors.phone}
                            />
                        )}
                    </InputMask>

                    <div className={b('checkboxes')}>
                        <Checkbox
                            size="l"
                            checked={isAlreadySigned ? true : agreedPolicy}
                            disabled={isAlreadySigned}
                            onChange={() => setAgreedPolicy(!agreedPolicy)}
                            className={b('checkbox')}
                        >
                            Я согласен(а) условиями{' '}
                            <a
                                href="#"
                                target="_blank"
                                style={{color: '#30AA6E', textDecoration: 'underline'}}
                            >
                                Политики по обработке персональных данных
                            </a>
                        </Checkbox>

                        <Checkbox
                            size="l"
                            checked={isAlreadySigned ? true : agreedOffer}
                            disabled={isAlreadySigned}
                            onChange={() => setAgreedOffer(!agreedOffer)}
                            className={`${b('checkbox')}`}
                        >
                            Я полностью согласен(а) с условиями оферты выше
                        </Checkbox>
                    </div>

                    <Button
                        style={{color: 'white'}}
                        type="submit"
                        view="action"
                        size="l"
                        className={b('submit')}
                        width="max"
                        disabled={isAlreadySigned ? true : !agreedPolicy || !agreedOffer}
                    >
                        {isAlreadySigned ? 'Договор уже подписан' : 'Подписать договор'}
                    </Button>

                    <Text className={b('log-info')} variant="body-2" color="secondary">
                        Зафиксируем вашу подпись в логах
                    </Text>
                </form>
            </section>
        </div>
    );
};
