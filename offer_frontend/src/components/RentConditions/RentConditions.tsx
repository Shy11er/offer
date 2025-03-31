import {Button, Text, TextArea, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {StepProps} from '../../types/createPage';
import {ObjectType, RentType} from '../../types/object';
import './RentConditions.scss';

const b = block('create-object');

export const RentConditions: React.FC<StepProps> = ({form, handleChange}) => {
    const rentType = form.rentType ?? 'DAY';

    const handleRentTypeChange = (type: RentType) => {
        handleChange('rentType', type);
    };

    const getPricePlaceholder = () => (rentType === 'DAY' ? 'Стоимость суток' : 'Стоимость часа');

    return (
        <div className={b('condition_section')}>
            <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px'}} variant="subheader-2">
                Условия аренды
            </Text>

            {form.objectType === ObjectType.APARTMENT && (
                <>
                    <TextArea
                        placeholder="Состояние квартиры — Например, «с мебелью, исправна»"
                        className={b('input')}
                        size="xl"
                        value={form.apartmentCondition ?? ''}
                        style={{minHeight: '50px'}}
                        onChange={(e) => handleChange('apartmentCondition', e.target.value)}
                    />

                    <TextArea
                        placeholder="Перечень имущества — Список (например, «диван, телевизор, плита»)"
                        className={b('input')}
                        size="xl"
                        value={form.listOfAppartmentProperties ?? ''}
                        onChange={(e) => handleChange('listOfAppartmentProperties', e.target.value)}
                    />

                    <TextArea
                        placeholder="Ранний заезд/поздний выезд — Стоимость (например, «500 руб./час»)"
                        className={b('input')}
                        size="xl"
                        value={form.penaltyForIncorrectExit ?? ''}
                        onChange={(e) => handleChange('penaltyForIncorrectExit', e.target.value)}
                    />

                    <TextInput
                        placeholder="Количество проживающих (Например, 3)"
                        className={b('input')}
                        size="xl"
                        type="number"
                        value={form.peopleAmount?.toString() ?? ''}
                        onChange={(e) => handleChange('peopleAmount', +e.target.value)}
                    />

                    <TextInput
                        placeholder="Количество ключей (Например, 2)"
                        className={b('input')}
                        size="xl"
                        type="number"
                        value={form.keyAmount?.toString() ?? ''}
                        onChange={(e) => handleChange('keyAmount', +e.target.value)}
                    />
                </>
            )}
            <div className={b('condition_section_options')}>
                <Button
                    view={rentType === 'DAY' ? 'action' : 'outlined-success'}
                    width="max"
                    size="xl"
                    style={{color: rentType === 'DAY' ? 'white' : undefined}}
                    onClick={() => handleRentTypeChange(RentType.DAY)}
                >
                    На сутки
                </Button>
                <Button
                    view={rentType === 'HOUR' ? 'action' : 'outlined-success'}
                    width="max"
                    size="xl"
                    style={{color: rentType === 'HOUR' ? 'white' : undefined}}
                    onClick={() => handleRentTypeChange(RentType.HOUR)}
                >
                    На час
                </Button>
            </div>

            <TextInput
                placeholder={getPricePlaceholder()}
                className={b('input')}
                size="xl"
                type="number"
                value={form.rentPrice?.toString() ?? ''}
                onChange={(e) => handleChange('rentPrice', +e.target.value)}
            />
        </div>
    );
};
