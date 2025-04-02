import {Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {ObjectDto, ObjectType} from '../types/object';
import {formatDate} from '../utils/formatDate';
import {ApartmentContract} from './ApartmentContract';
import {ServiceContract} from './ServiceContract';
import {TechniqueContract} from './TechniqueContract';

const b = block('create-object');

export const renderContract: React.FC<{form: ObjectDto}> = ({form}) => {
    if (!form.isTemplate) {
        return (
            <section className={b('contract-data')}>
                {form.dateOfSigned && (
                    <h1
                        style={{
                            fontSize: '20px',
                            fontWeight: 600,
                            textAlign: 'center',
                            color: '#30AA6E',
                        }}
                    >
                        Договор-оферта
                    </h1>
                )}
                {!form.isTemplate && form?.startDate && form?.endDate && (
                    <>
                        <Text
                            style={{fontSize: '13px', fontWeight: 400, color: 'rgba(0,0,0,0.7)'}}
                            variant="header-2"
                            className={b('title')}
                        >
                            Даты пользования помещением:{' '}
                            {`${formatDate(form.startDate)} — ${formatDate(form.endDate)}`}
                        </Text>
                        <br />
                    </>
                )}

                {!form.isTemplate && form?.rentPrice && form?.startDate && form?.endDate && (
                    <>
                        <Text
                            style={{fontSize: '13px', fontWeight: 400, color: 'rgba(0,0,0,0.7)'}}
                            variant="header-2"
                            className={b('title')}
                        >
                            Стоимость пользования помещением:{' '}
                            {+form.rentPrice *
                                (Math.floor(
                                    (new Date(form.endDate).setHours(0, 0, 0, 0) -
                                        new Date(form.startDate).setHours(0, 0, 0, 0)) /
                                        (1000 * 60 * 60 * 24),
                                ) +
                                    1)}{' '}
                            рублей.
                        </Text>
                        <br />
                    </>
                )}

                <Text
                    style={{fontSize: '20px', fontWeight: 600}}
                    variant="header-2"
                    className={b('title')}
                >
                    {form?.customContractName ?? ''}
                </Text>

                <section className={b('contract-data')}>
                    {form?.customContract
                        ?.split('\n')
                        .map((line, idx) => <p key={idx}>{line.trim()}</p>)}
                </section>

                <br />
                <Text
                    style={{fontSize: '20px', fontWeight: 600}}
                    variant="header-2"
                    className={b('title')}
                >
                    {form?.applicationName ?? ''}
                </Text>

                <section className={b('contract-data')}>
                    {form?.application
                        ?.split('\n')
                        .map((line, idx) => <p key={idx}>{line.trim()}</p>)}
                </section>
            </section>
        );
    }

    if (form.objectType === ObjectType.APARTMENT) {
        return <ApartmentContract contract={form} />;
    } else if (form.objectType === ObjectType.TECHNIQUE) {
        return <TechniqueContract contract={form} />;
    } else if (form.objectType === ObjectType.SERVICE) {
        return <ServiceContract contract={form} />;
    }

    return (
        <section style={{padding: 16}}>
            Не удалось сгенерировать договор: неподдерживаемая комбинация типа объекта и владельца.
        </section>
    );
};
