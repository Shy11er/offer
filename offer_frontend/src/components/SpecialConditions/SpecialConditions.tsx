import React from 'react';
import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import {StepProps} from '../../types/createPage';
import './SpecialConditions.scss';

const b = block('create-object');

export const SpecialConditions: React.FC<StepProps> = ({form, handleChange}) => {
    const withAnimals = form.withAnimals ?? false;
    const canSmoke = form.canSmoke ?? false;

    const handleToggle = (field: 'withAnimals' | 'canSmoke', value: boolean) => {
        handleChange(field, value);
    };

    return (
        <div className={b('special_conditions')}>
            <Text
                style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px'}}
                variant="subheader-2"
                className={b('subtitle')}
            >
                Специальные условия
            </Text>

            <div className={b('condition_section_options')}>
                <Button
                    view={withAnimals ? 'action' : 'outlined-success'}
                    width="max"
                    size="xl"
                    style={{color: withAnimals ? 'white' : undefined}}
                    onClick={() => handleToggle('withAnimals', true)}
                >
                    С животными
                </Button>
                <Button
                    view={!withAnimals ? 'action' : 'outlined-success'}
                    width="max"
                    size="xl"
                    style={{color: !withAnimals ? 'white' : undefined}}
                    onClick={() => handleToggle('withAnimals', false)}
                >
                    Без животных
                </Button>
            </div>

            <div className={b('condition_section_options')}>
                <Button
                    view={canSmoke ? 'action' : 'outlined-success'}
                    width="max"
                    size="xl"
                    style={{color: canSmoke ? 'white' : undefined}}
                    onClick={() => handleToggle('canSmoke', true)}
                >
                    Можно курить
                </Button>
                <Button
                    view={!canSmoke ? 'action' : 'outlined-success'}
                    width="max"
                    size="xl"
                    style={{color: !canSmoke ? 'white' : undefined}}
                    onClick={() => handleToggle('canSmoke', false)}
                >
                    Нельзя курить
                </Button>
            </div>
        </div>
    );
};
