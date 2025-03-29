import {TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {PaymentConditions} from '../../../components/PaymentConditions';
import {RentConditions} from '../../../components/RentConditions';
import {SpecialConditions} from '../../../components/SpecialConditions';
import {StepProps} from '../../../types/createPage';

const b = block('create-object');

export const StepApartmentFields: React.FC<StepProps> = ({form, handleChange}) => (
    <>
        <TextInput
            placeholder="Адрес"
            className={b('input')}
            size="xl"
            value={form.address ?? ''}
            onChange={(e) => handleChange('address', e.target.value)}
        />
        <TextInput
            placeholder="Площадь"
            className={b('input')}
            size="xl"
            type="text"
            value={form.square?.toString() ?? ''}
            onChange={(e) => {
                const value = e.target.value;
                if (value === '') {
                    handleChange('square', undefined);
                } else if (/^\d+$/.test(value)) {
                    handleChange('square', +value);
                }
            }}
        />
        <TextInput
            placeholder="Кадастровый номер"
            size="xl"
            className={b('input')}
            value={form.cadastralNumber ?? ''}
            onChange={(e) => handleChange('cadastralNumber', e.target.value)}
        />

        <RentConditions form={form} handleChange={handleChange} />
        <PaymentConditions form={form} handleChange={handleChange} />
        <SpecialConditions form={form} handleChange={handleChange} />
    </>
);
