import {StepProps} from '@/types/createPage';
import {TextArea, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';

const b = block('create-object');

export const StepServiceFields: React.FC<StepProps> = ({form, handleChange}) => (
    <>
        <TextInput
            placeholder="Тип услуги (например, уборка)"
            className={b('input')}
            size="xl"
            value={form.serviceType ?? ''}
            onChange={(e) => handleChange('serviceType', e.target.value)}
        />
        <TextArea
            placeholder="Описание услуги (что будет сделано)"
            className={b('input')}
            size="xl"
            value={form.serviceDescription ?? ''}
            onChange={(e) => handleChange('serviceDescription', e.target.value)}
        />
        <TextInput
            placeholder="Результат услуги (что получит клиент)"
            className={b('input')}
            size="xl"
            value={form.serviceResult ?? ''}
            onChange={(e) => handleChange('serviceResult', e.target.value)}
        />
    </>
);
