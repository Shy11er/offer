import {Lock, Server, ShieldKeyhole} from '@gravity-ui/icons';
import {Button, Checkbox, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useEffect, useState} from 'react';
import InputMask from 'react-input-mask';
import {useNavigate, useParams} from 'react-router-dom';
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
    const [contract] = useState<any>(null);
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        console.log(formData.phone.length);
        const newErrors: any = {};

        if (!formData.fullName || formData.fullName.split(' ').length < 2) {
            newErrors.fullName = 'ФИО должно содержать как минимум два слова!';
        }
        if (!formData.passportNumber) newErrors.passportNumber = 'Номер паспорта обязателен!';
        if (!formData.passportSeries) newErrors.passportSeries = 'Серия паспорта обязательна!';
        if (!formData.address) newErrors.address = 'Адрес обязателен!';
        if (!formData.phone || formData.phone.length != 18) newErrors.phone = 'Телефон обязателен!';

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            navigate('/contracts/success');
        }
    };

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                // const response = await fetch(`/api/contract/${id}`);
                // const data = await response.json();
                // setContract(data);
            } catch (error) {
                console.error('Ошибка при загрузке контракта:', error);
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div className={b()}>Загрузка...</div>;
    // if (!contract) return <div className={b()}>Договор не найден</div>;

    return (
        <div className={b()}>
            <section className={b('contract-data')}>
                <h2>Договор-оферта краткосрочной аренды</h2>
                <p>
                    на посуточный наём жилого помещения г. <strong>{contract?.city ?? '-'}</strong>,
                    дата акцепта оферты: <strong>{contract?.dateAccepted ?? '-'}</strong>
                </p>

                <h3>1. Общие положения</h3>
                <p>
                    1.1. Настоящий документ является публичной офертой в соответствии со статьёй 435
                    и частью 2 статьи 437 Гражданского кодекса Российской Федерации (далее — ГК РФ).
                </p>
                <p>
                    1.2. Я, <strong>{contract?.landlord?.fullName ?? '-'}</strong>, паспорт{' '}
                    {contract?.landlord?.passport ?? '-'}, зарегистрированный по адресу:{' '}
                    {contract?.landlord?.address ?? '-'} (далее — Наймодатель), предлагаю любому
                    физическому или юридическому лицу (далее — Наниматель) заключить договор найма
                    жилого помещения на условиях, изложенных ниже.
                </p>
                <p>
                    1.3. Акцепт настоящей оферты осуществляется Нанимателем путём заполнения данных,
                    подтверждения согласия с условиями оферты и оплаты в порядке, предусмотренном
                    разделом 4 настоящего договора.
                </p>
                <p>
                    1.4. Акцепт оферты означает полное и безоговорочное принятие Нанимателем всех
                    условий настоящего договора без каких-либо изъятий или дополнений.
                </p>

                <h3>2. Предмет договора</h3>
                <p>
                    2.1. Наймодатель предоставляет Нанимателю во временное владение и пользование
                    жилое помещение — квартиру, расположенную по адресу: [адрес квартиры], общей
                    площадью [площадь квартиры] кв.м, кадастровый номер [кадастровый номер] (при
                    наличии), находящуюся в состоянии: [состояние квартиры] (далее — Помещение), для
                    проживания на условиях посуточного найма.
                </p>
                <p>
                    2.2. Помещение передаётся в том состоянии, в котором оно находится на момент
                    заключения договора, с учётом описания, указанного в пункте 2.1.
                </p>

                <h3>3. Срок найма</h3>
                <p>
                    3.1. Срок найма Помещения составляет от [минимальный срок аренды] до
                    [максимальный срок аренды].
                </p>
                <p>3.2. Время заезда: [время заезда]. Время выезда: [время выезда].</p>
                <p>
                    3.3. Наниматель обязан освободить Помещение не позднее времени выезда, если иное
                    не согласовано сторонами.
                </p>

                <h3>4. Плата за наём и порядок расчётов</h3>
                <p>4.1. Стоимость найма составляет [цена за сутки] рублей ([прописью]) за сутки.</p>
                <p>
                    4.2. Плата вносится в порядке: [оплата], используя следующие реквизиты:{' '}
                    {contract?.landlord?.paymentInfo ?? '-'}
                </p>
                <p>4.3. Оплата должна быть произведена до заезда, если не согласовано иное.</p>
                <p>
                    4.4. Залог: [залог] рублей. Возвращается при отсутствии ущерба: [условия
                    возврата].
                </p>
                <p>4.5. Коммунальные услуги: [коммунальные услуги]</p>
                <p>4.6. Дополнительные услуги: [дополнительные услуги]</p>

                <h3>5. Права и обязанности сторон</h3>
                <p>
                    5.1. Наймодатель обязуется предоставить Помещение в пригодном состоянии,
                    соблюсти сроки и вернуть залог при выполнении условий.
                </p>
                <p>
                    5.2. Наниматель обязуется использовать Помещение для проживания, соблюдать
                    правила, вовремя внести оплату, освободить в срок и вернуть имущество в
                    сохранности.
                </p>

                <h3>6. Ответственность сторон</h3>
                <p>
                    6.1. За просрочку освобождения — штраф: [штраф за просрочку]. 6.2. За ущерб —
                    компенсация. 6.3. Наймодатель не отвечает за имущество Нанимателя, кроме случаев
                    умысла.
                </p>

                <h3>7. Расторжение договора</h3>
                <p>
                    7.1. Договор может быть расторгнут по соглашению или в случаях, установленных
                    законом.
                </p>
                <p>7.2. Отказ Нанимателя — за 24 ч до заезда. Возврат оплаты за вычетом затрат.</p>
                <p>
                    7.3. Наймодатель может расторгнуть договор при нарушении условий, уведомив по
                    телефону {contract?.landlord?.phone ?? '-'} или email{' '}
                    {contract?.landlord?.email ?? '-'}.
                </p>

                <h3>8. Прочие условия</h3>
                <p>8.1. Договор вступает в силу с момента акцепта.</p>
                <p>8.2. Споры решаются по месту нахождения квартиры.</p>
                <p>8.3. Наймодатель гарантирует право сдачи квартиры.</p>
                <p>
                    8.4. Обработка персональных данных в рамках 152-ФЗ: ФИО, паспорт, адрес,
                    телефон, email.
                </p>

                <h3>9. Реквизиты Наймодателя</h3>
                <p>Наймодатель: {contract?.landlord?.fullName ?? '-'}</p>
                <p>Паспорт: {contract?.landlord?.passport ?? '-'}</p>
                <p>Адрес регистрации: {contract?.landlord?.address ?? '-'}</p>
                <p>Телефон: {contract?.landlord?.phone ?? '-'}</p>
                <p>Email: {contract?.landlord?.email ?? '-'}</p>
                <p>Реквизиты для оплаты: {contract?.landlord?.paymentInfo ?? '-'}</p>

                <div className={b('security')}>
                    <div className={b('security-item')}>
                        <ShieldKeyhole className={b('icon')} />
                        <p>Безопасно храним ваши персональные данные согласно ФЗ-152</p>
                    </div>
                    <div className={b('security-item')}>
                        <Server className={b('icon')} />
                        <p>Используем сервера, которые находятся в Российской Федерации</p>
                    </div>
                    <div className={b('security-item')}>
                        <Lock className={b('icon')} />
                        <p>
                            Оферта имеет полную юридическую силу и тождественна бумажному договору
                            согласно 432 ГК РФ
                        </p>
                    </div>
                </div>
            </section>

            <section className={b('form')}>
                <h4>Заполните ваши данные для подписания договора</h4>
                <form onSubmit={handleSubmit}>
                    <TextInput
                        size="xl"
                        placeholder="ФИО"
                        className={b('input')}
                        value={formData.fullName}
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
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, passportNumber: e.target.value}))
                        }
                    >
                        {(inputProps) => (
                            <TextInput
                                {...inputProps}
                                size="xl"
                                placeholder="Номер паспорта"
                                className={b('input')}
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
                        onChange={(e) =>
                            setFormData((prev) => ({...prev, address: e.target.value}))
                        }
                        validationState={isSubmitted && !formData.address ? 'invalid' : undefined}
                        errorMessage={isSubmitted && errors.address}
                    />
                    <InputMask
                        mask="+7 (999) 999-99-99"
                        maskPlaceholder=" "
                        alwaysShowMask={false}
                        onChange={(e) => setFormData((prev) => ({...prev, phone: e.target.value}))}
                    >
                        {(inputProps) => (
                            <TextInput
                                {...inputProps}
                                size="xl"
                                placeholder="Телефон"
                                className={b('input')}
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
                            checked={agreedPolicy}
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
                            checked={agreedOffer}
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
                        disabled={!agreedPolicy || !agreedOffer}
                    >
                        Подписать договор
                    </Button>

                    <Text className={b('log-info')} variant="body-2" color="secondary">
                        Зафиксируем вашу подпись в логах
                    </Text>
                </form>
            </section>
        </div>
    );
};
