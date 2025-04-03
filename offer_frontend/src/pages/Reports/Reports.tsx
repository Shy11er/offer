import {Button, Text} from '@gravity-ui/uikit';
import block from 'bem-cn-lite';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import {useNavigate} from 'react-router-dom';
import {getAllByObjectOwner, getPhoto} from '../../api/contract';
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

    const viewDocumentPhoto = async (contractId: string) => {
        try {
            await getPhoto(contractId);
        } catch (error) {
            toast.error('Не удалось загрузить фото');
            console.error(error);
        }
    };

    return (
        <div className={b()}>
            <h1 className={b('heading')}>
                {contracts?.length === 0 ? 'У вас пока нет договоров' : 'Подписанные договора'}
            </h1>
            {contracts?.length !== 0 && (
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
                        {contracts.map((contract) => (
                            <React.Fragment key={contract.id}>
                                <tr className={b('row')}>
                                    <td className={b('cell')}>
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
                                                    )}{' '}
                                                    в {dayjs(contract.signedAt).format('HH:mm')}
                                                </Text>
                                            ) : (
                                                <Text variant="caption-1" color="warning">
                                                    Не подписано <br />
                                                </Text>
                                            )}
                                        </div>
                                    </td>
                                    <td className={b('cell')}></td>
                                </tr>
                                <tr>
                                    <td colSpan={4} className={b('cell')}>
                                        <div className={b('actions')}>
                                            <Button
                                                view="action"
                                                size="xl"
                                                style={{color: 'white'}}
                                                onClick={() =>
                                                    navigate(`/contracts/${contract.objectDto?.id}`)
                                                }
                                            >
                                                Договор
                                            </Button>
                                            <Button
                                                view="action"
                                                size="xl"
                                                style={{color: 'white'}}
                                                onClick={() => viewDocumentPhoto(contract.id ?? '')}
                                                disabled={contract.documentPhotoUrl === null}
                                            >
                                                {contract.documentPhotoUrl
                                                    ? 'Фото документа'
                                                    : 'Нет фото'}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
