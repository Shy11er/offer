import {StepProps} from '@/types/createPage';
import {TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';

const b = block('create-object');

export const StepPhysicalFields: React.FC<StepProps> = ({form, handleChange}) => (
    <>
        <TextInput
            placeholder="ФИО"
            className={b('input')}
            size="xl"
            value={form.ownerName ?? ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
        />
        <TextInput
            placeholder="Серия паспорта"
            className={b('input')}
            size="xl"
            value={form.passportSeries ?? ''}
            onChange={(e) => handleChange('passportSeries', e.target.value)}
        />
        <TextInput
            placeholder="Номер паспорта"
            size="xl"
            className={b('input')}
            value={form.passportNumber ?? ''}
            onChange={(e) => handleChange('passportNumber', e.target.value)}
        />
        <TextInput
            placeholder="Адрес регистрации"
            size="xl"
            className={b('input')}
            value={form.registrationAddress ?? ''}
            onChange={(e) => handleChange('registrationAddress', e.target.value)}
        />
        <TextInput
            placeholder="Телефон"
            size="xl"
            className={b('input')}
            value={form.ownerPhone ?? ''}
            onChange={(e) => handleChange('ownerPhone', e.target.value)}
        />
    </>
);
