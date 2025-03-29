import {TextArea, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {RentConditions} from '../../../components/RentConditions';
import {StepProps} from '../../../types/createPage';
import {PaymentConditions} from '../../../components/PaymentConditions';

const b = block('create-object');

export const StepTechniqueFields: React.FC<StepProps> = ({form, handleChange}) => (
    <>
        <TextInput
            size="xl"
            placeholder="Тип техники"
            className={b('input')}
            value={form.technicalType ?? ''}
            onChange={(e) => handleChange('technicalType', e.target.value)}
        />
        <TextArea
            size="xl"
            placeholder="Название, описание техники, серийный номер"
            className={b('input')}
            value={form.technicalDescription ?? ''}
            onChange={(e) => handleChange('technicalDescription', e.target.value)}
        />

        <RentConditions form={form} handleChange={handleChange} />
        <PaymentConditions form={form} handleChange={handleChange} />
    </>
);
