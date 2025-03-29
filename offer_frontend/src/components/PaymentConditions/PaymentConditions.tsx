import {Button, Text, TextInput} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import React from 'react';
import {StepProps} from '../../types/createPage';
import {DepositBackup, ObjectType} from '../../types/object';
import './PaymentConditions.scss';

const b = block('create-object');

export const PaymentConditions: React.FC<StepProps> = ({form, handleChange}) => {
    const isService = form.objectType === ObjectType.SERVICE;
    const isDeposit = form.isDeposit ?? false;

    const handleDepositBackupChange = (value: DepositBackup) => {
        handleChange('depositBackup', value);
    };

    const handleIsDeposit = (flag: boolean) => {
        handleChange('isDeposit', flag);
    };

    return (
        <div className={b('condition_section')}>
            <Text
                style={{color: 'rgba(0,0,0,0.7)', fontSize: '13px'}}
                variant="subheader-2"
                className={b('subtitle')}
            >
                Формат оплаты
            </Text>

            {isService ? (
                <>
                    <TextInput
                        placeholder="Цена за услугу"
                        className={b('input')}
                        size="xl"
                        type="number"
                        value={form.rentPrice?.toString() ?? ''}
                        onChange={(e) => handleChange('rentPrice', +e.target.value)}
                    />

                    <div className={b('condition_section_options')}>
                        <Button
                            view={form.depositBackup === 'CARD' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: form.depositBackup === 'CARD' ? 'white' : undefined}}
                            onClick={() => handleDepositBackupChange(DepositBackup.CARD)}
                        >
                            На карту
                        </Button>
                        <Button
                            view={form.depositBackup === 'CASH' ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: form.depositBackup === 'CASH' ? 'white' : undefined}}
                            onClick={() => handleDepositBackupChange(DepositBackup.CASH)}
                        >
                            Наличными
                        </Button>
                    </div>

                    <TextInput
                        placeholder="Реквизиты для оплаты"
                        className={b('input')}
                        size="xl"
                        value={form.paymentDetails ?? ''}
                        onChange={(e) => handleChange('paymentDetails', e.target.value)}
                    />
                </>
            ) : (
                <>
                    <div className={b('condition_section_options')}>
                        <Button
                            view={!isDeposit ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: !isDeposit ? 'white' : undefined}}
                            onClick={() => handleIsDeposit(false)}
                        >
                            Залога нет
                        </Button>
                        <Button
                            view={isDeposit ? 'action' : 'outlined-success'}
                            width="max"
                            size="xl"
                            style={{color: isDeposit ? 'white' : undefined}}
                            onClick={() => handleIsDeposit(true)}
                        >
                            Есть залог
                        </Button>
                    </div>
                    <>
                        <TextInput
                            placeholder="Сумма залога"
                            className={b('input')}
                            size="xl"
                            type="number"
                            value={form.depositAmount?.toString() ?? ''}
                            onChange={(e) => handleChange('depositAmount', +e.target.value)}
                        />

                        <div className={b('payment')}>
                            <Button
                                view={form.depositBackup === 'CARD' ? 'action' : 'outlined-success'}
                                width="max"
                                size="xl"
                                style={{color: form.depositBackup === 'CARD' ? 'white' : undefined}}
                                onClick={() => handleDepositBackupChange(DepositBackup.CARD)}
                            >
                                Залог вернется на карту
                            </Button>
                            <Button
                                view={form.depositBackup === 'CASH' ? 'action' : 'outlined-success'}
                                width="max"
                                size="xl"
                                style={{color: form.depositBackup === 'CASH' ? 'white' : undefined}}
                                onClick={() => handleDepositBackupChange(DepositBackup.CASH)}
                            >
                                Залог вернется наличными
                            </Button>

                            <TextInput
                                placeholder="Реквизиты для оплаты"
                                className={b('input')}
                                size="xl"
                                value={form.paymentDetails ?? ''}
                                onChange={(e) => handleChange('paymentDetails', e.target.value)}
                            />
                        </div>
                    </>
                </>
            )}
        </div>
    );
};
