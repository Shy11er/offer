import {Button, Checkbox, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React, {useState} from 'react';
import {PaymentConditions} from '../../../components/PaymentConditions';
import {StepProps} from '../../../types/createPage';
import {ObjectDto, ObjectType, OwnerType, PenaltyDto} from '../../../types/object';
import {StepApartmentFields} from './StepApartmentFields';
import {StepLegalFields} from './StepLegalFields';
import {StepPhysicalFields} from './StepPhysicalFields';
import {StepServiceFields} from './StepServiceFields';
import {StepTechniqueFields} from './StepTechniqueFields';

const b = block('create-object');

interface Step3FormProps extends StepProps {
    onSubmit: () => void;
    setForm: React.Dispatch<React.SetStateAction<Partial<ObjectDto>>>;
}

export const Step3Form: React.FC<Step3FormProps> = ({form, setForm, handleChange, onSubmit}) => {
    const [agreedPolicy, setAgreedPolicy] = useState(false);
    const [agreedOffer, setAgreedOffer] = useState(false);
    
    const renderOwnerFields = () => {
        if (form.ownerType === OwnerType.PHYSICAL) {
            return <StepPhysicalFields form={form} handleChange={handleChange} />;
        }

        if (form.ownerType === OwnerType.LEGAL) {
            return <StepLegalFields form={form} handleChange={handleChange} />;
        }

        return null;
    };

    const renderObjectFields = () => {
        if (form.objectType === ObjectType.APARTMENT) {
            return <StepApartmentFields form={form} handleChange={handleChange} />;
        }

        if (form.objectType === ObjectType.TECHNIQUE) {
            return <StepTechniqueFields form={form} handleChange={handleChange} />;
        }

        if (form.objectType === ObjectType.SERVICE) {
            return <StepServiceFields form={form} handleChange={handleChange} />;
        }

        return null;
    };

    const handlePenaltyChange = (
        index: number,
        field: keyof PenaltyDto,
        value: string | number,
    ) => {
        setForm((prev) => {
            const penalties = [...(prev.penalties ?? [])];
            const updated = {...(penalties[index] ?? {}), [field]: value};
            penalties[index] = updated;
            return {...prev, penalties};
        });
    };

    const handleAddPenalty = () => {
        setForm((prev) => ({
            ...prev,
            penalties: [...(prev.penalties ?? []), {reason: '', amount: 0}],
        }));
    };
    console.log(form);
    return (
        <div className={b('step')}>
            <Text
                style={{fontSize: '20px', fontWeight: 600}}
                variant="header-2"
                className={b('title')}
            >
                Создание договора
            </Text>
            <Text
                style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px', fontWeight: 600}}
                variant="subheader-2"
                className={b('subtitle')}
            >
                Заполните юридическую информацию о арендодателе
            </Text>

            {renderOwnerFields()}

            <Text
                style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px'}}
                variant="subheader-2"
                className={b('subtitle')}
            >
                Данные об объекте аренды
            </Text>

            {renderObjectFields()}

            {form.objectType === ObjectType.SERVICE && (
                <PaymentConditions form={form} handleChange={handleChange} />
            )}

            <div className={b('penalty')}>
                <Text
                    style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px', marginBottom: '10px'}}
                    variant="subheader-2"
                    className={b('subtitle')}
                >
                    Штрафы
                </Text>

                {(form.penalties ?? []).map((penalty, index) => (
                    <div key={index} className={b('penalty-row')}>
                        <TextInput
                            placeholder="За что штраф"
                            className={b('penalty-input')}
                            size="xl"
                            value={penalty.reason || ''}
                            onChange={(e) => handlePenaltyChange(index, 'reason', e.target.value)}
                        />
                        <TextInput
                            placeholder="Размер штрафа"
                            className={b('penalty-input')}
                            size="xl"
                            type="text"
                            value={penalty.amount?.toString() ?? ''}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d+$/.test(value)) {
                                    handlePenaltyChange(index, 'amount', +e.target.value);
                                }
                            }}
                        />
                    </div>
                ))}

                <Button
                    view="action"
                    size="xl"
                    onClick={handleAddPenalty}
                    style={{color: 'white', marginTop: '12px', width: '100%'}}
                >
                    Добавить штраф
                </Button>
            </div>

            <div className={b('checkboxes')}>
                <Checkbox
                    size="l"
                    checked={agreedPolicy}
                    onChange={() => setAgreedPolicy(!agreedPolicy)}
                    className={b('checkbox')}
                    style={{marginBottom: '10px', fontSize: '15px'}}
                >
                    Я согласен(а) на политику по обработке персональных данных
                </Checkbox>

                <Checkbox
                    size="l"
                    checked={agreedOffer}
                    onChange={() => setAgreedOffer(!agreedOffer)}
                    className={`${b('checkbox')}`}
                    style={{fontSize: '15px'}}
                >
                    Я согласен(а) на принятие оферты сервиса
                </Checkbox>
            </div>

            <Button
                view="action"
                size="xl"
                style={{color: 'white', marginTop: 12}}
                onClick={onSubmit}
                disabled={!agreedPolicy || !agreedOffer}
            >
                Далее
            </Button>
        </div>
    );
};
