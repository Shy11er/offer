import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {getAllByObjectOwner} from '../../api/contract';
import {ContractDto} from '../../types/contract';
import './Reports.scss';

const b = block('reports');

export const Reports: React.FC = () => {
    const [contracts, setContracts] = useState<ContractDto[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const data = await getAllByObjectOwner();
                setContracts(data);
            } catch (e) {
                console.error('Ошибка при загрузке контрактов', e);
            }
        })();
    }, []);

    return (
        <div className={b()}>
            <h1 className={b('heading')}>Подписанные договора</h1>
            <table className={b('table')}>
                <thead>
                    <tr>
                        <th className={b('th')}>Данные</th>
                        <th className={b('th')}>Адрес</th>
                        <th className={b('th')}>Статус</th>
                        <th className={b('th')} />
                    </tr>
                </thead>
                <tbody>
                    {contracts.map((contract, key) => (
                        <>
                            <tr key={key} className={b('row')}>
                                <td
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        fontSize: '13px',
                                    }}
                                    className={b('cell')}
                                >
                                    <Text variant="body-1">{contract.fullName}</Text>
                                    <Text variant="caption-1">
                                        {contract.passportSeries}, {contract.passportNumber}
                                    </Text>
                                </td>
                                <td className={b('cell')}>
                                    <Text variant="body-1">{contract.address || '-'}</Text>
                                </td>
                                <td className={b('cell')}>
                                    <div className={b('status')}>
                                        {contract.signedAt ? (
                                            <Text variant="caption-1" color="positive">
                                                Подписано <br />
                                                {dayjs(contract.signedAt).format(
                                                    'DD.MM.YYYY',
                                                )} в {dayjs(contract.signedAt).format('HH:mm')}
                                            </Text>
                                        ) : (
                                            <Text variant="caption-1" color="warning">
                                                Не подписано <br />
                                            </Text>
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <Button
                                view="action"
                                size="xl"
                                style={{color: 'white'}}
                                onClick={() => navigate(`/contracts/${contract.objectDto?.id}`)}
                            >
                                Посмотреть договор
                            </Button>
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
