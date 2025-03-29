import React from 'react';
import {ObjectDto, ObjectType} from '../types/object';
import {ApartmentContract} from './ApartmentContract';
import {ServiceContract} from './ServiceContract';
import {TechniqueContract} from './TechniqueContract';

export const renderContract: React.FC<{form: ObjectDto}> = ({form}) => {
    console.log(form.objectType === ObjectType.SERVICE);
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
