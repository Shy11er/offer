import {Button, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {StepProps} from '../../types/createPage';
import {RentType} from '../../types/object';
import './RentConditions.scss';

const b = block('create-object');

export const RentConditions: React.FC<StepProps> = ({form, handleChange}) => {
    const rentType = form.rentType ?? 'DAY';

    const handleRentTypeChange = (type: RentType) => {
        handleChange('rentType', type);
    };

    const getPricePlaceholder = () => (rentType === 'DAY' ? 'Стоимость суток' : 'Стоимость часа');

    const getAmountPlaceholder = () =>
        rentType === 'DAY' ? 'Количество суток' : 'Количество часов';

    return (
        <div className={b('condition_section')}>
            <Text style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px'}} variant="subheader-2">
                Условия аренды
            </Text>

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

            <TextInput
                placeholder={getAmountPlaceholder()}
                className={b('input')}
                size="xl"
                value={form.rentAmount ?? ''}
                onChange={(e) => handleChange('rentAmount', e.target.value)}
            />
        </div>
    );
};
