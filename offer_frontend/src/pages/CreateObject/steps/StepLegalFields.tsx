import {StepProps} from '@/types/createPage';
import {TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';

const b = block('create-object');

export const StepLegalFields: React.FC<StepProps> = ({form, handleChange}) => (
    <>
        <TextInput
            placeholder="Название организации"
            className={b('input')}
            size="xl"
            value={form.organizationName ?? ''}
            onChange={(e) => handleChange('organizationName', e.target.value)}
        />
        <TextInput
            placeholder="ОГРН"
            className={b('input')}
            size="xl"
            value={form.ogrn ?? ''}
            onChange={(e) => handleChange('ogrn', e.target.value)}
        />
        <TextInput
            placeholder="ИНН"
            className={b('input')}
            size="xl"
            value={form.inn ?? ''}
            onChange={(e) => handleChange('inn', e.target.value)}
        />
        <TextInput
            placeholder="КПП"
            className={b('input')}
            size="xl"
            value={form.kpp ?? ''}
            onChange={(e) => handleChange('kpp', e.target.value)}
        />
        <TextInput
            placeholder="Юридический адрес"
            className={b('input')}
            size="xl"
            value={form.legalAddress ?? ''}
            onChange={(e) => handleChange('legalAddress', e.target.value)}
        />
        <TextInput
            placeholder="ФИО представителя"
            className={b('input')}
            size="xl"
            value={form.ownerName ?? ''}
            onChange={(e) => handleChange('ownerName', e.target.value)}
        />
        <TextInput
            placeholder="Должность представителя"
            className={b('input')}
            size="xl"
            value={form.positionOfRepresentative ?? ''}
            onChange={(e) => handleChange('positionOfRepresentative', e.target.value)}
        />
        <TextInput
            placeholder="Документ-основание"
            className={b('input')}
            size="xl"
            value={form.document ?? ''}
            onChange={(e) => handleChange('document', e.target.value)}
        />
        <TextInput
            placeholder="Телефон"
            className={b('input')}
            size="xl"
            value={form.ownerPhone ?? ''}
            onChange={(e) => handleChange('ownerPhone', e.target.value)}
        />
        <TextInput
            placeholder="Эл. почта"
            className={b('input')}
            size="xl"
            value={form.email ?? ''}
            onChange={(e) => handleChange('email', e.target.value)}
        />
    </>
);
