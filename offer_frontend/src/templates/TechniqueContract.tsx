import block from 'bem-cn-lite';
import {convert as convertNumberToWordsRu} from 'number-to-words-ru';
import React from 'react';
import {ContractSectionProps} from '../types/object';

const b = block('create-object');

export const TechniqueContract: React.FC<ContractSectionProps> = ({contract}) => {
    return (
        <section className={b('contract-data')}>
            <h1>ДОГОВОР-ОФЕРТА</h1>
            <p>на аренду имущества</p>
            <p>
                г.{' '}
                {contract?.registrationAddress?.split(',')[0] ??
                    '[Город, указанный в юр. адресе или автоматически]'}
                , дата акцепта:{' '}
                {contract?.dateOfSigned?.substring(0, 10) ??
                    '[Дата акцепта, проставляется при принятии]'}
            </p>

            <h3>1. Общие положения</h3>
            {contract?.ownerType === 'LEGAL' ? (
                <p>
                    1.2. {contract?.organizationName ?? '[Наименование организации]'}, ОГРН{' '}
                    {contract?.ogrn ?? '[ОГРН]'}, ИНН {contract?.inn ?? '[ИНН]'}, КПП{' '}
                    {contract?.kpp ?? '[КПП]'}, юридический адрес:{' '}
                    {contract?.registrationAddress ?? '[юридический адрес]'}, в лице{' '}
                    {contract?.ownerName ?? '[ФИО представителя]'}, должность{' '}
                    {contract?.positionOfRepresentative ?? '[должность представителя]'},
                    действующего на основании {contract?.document ?? '[документ-основание]'} (далее
                    — Арендодатель), предлагает заключить договор аренды имущества на условиях ниже.
                </p>
            ) : (
                <p>
                    1.2. Я, {contract?.ownerName ?? '[ФИО]'}, паспорт{' '}
                    {contract?.passportSeries ?? ''}{' '}
                    {contract?.passportNumber ?? '[паспортные данные]'}, зарегистрированный по
                    адресу: {contract?.registrationAddress ?? '[адрес регистрации]'} (далее —
                    Арендодатель), предлагаю заключить договор аренды имущества на условиях ниже.
                </p>
            )}
            <p>
                1.3. Акцепт оферты осуществляется Арендатором путём заполнения данных, подтверждения
                согласия и оплаты в порядке раздела 4.
            </p>
            <p>1.4. Акцепт означает полное принятие условий без исключений.</p>

            <h3>2. Предмет договора</h3>
            <p>
                2.1. Арендодатель предоставляет Арендатору во временное владение и пользование
                имущество: {contract?.technicalType ?? '[тип техники]'}, описание:{' '}
                {contract?.technicalDescription ?? '[описание техники]'} (далее — Имущество), для
                использования в личных целях.
            </p>
            <p>
                2.2. Имущество передаётся в состоянии, указанном в описании, на момент заключения
                договора.
            </p>

            <h3>3. Срок аренды</h3>
            <p>
                3.1. Срок аренды: от {contract?.startDate ?? '[дата начала]'} до{' '}
                {contract?.endDate ?? '[дата окончания]'}.
            </p>
            <p>
                3.2. Арендатор обязан вернуть Имущество в последний день срока аренды, если иное не
                согласовано.
            </p>

            <h3>4. Плата за аренду и порядок расчётов</h3>
            <p>
                4.1. Стоимость аренды: {contract?.rentPrice ?? '[цена за сутки]'} рублей (
                {contract?.rentPrice
                    ? convertNumberToWordsRu(contract.rentPrice).toLowerCase()
                    : '[цена за сутки прописью]'}
                ).
            </p>
            <p>
                {contract?.depositBackup === 'CASH' && '4.2. Арендатор оплачивает через наличку'}
                {contract?.depositBackup === 'CARD' &&
                    `4.2. Арендатор оплачивает через карту на реквизиты ${
                        contract?.paymentDetails ?? '[банковские реквизиты арендодателя]'
                    }.`}
            </p>
            <p>4.3. Оплата вносится до передачи Имущества, если иное не согласовано.</p>
            <p>
                4.4. Залог: {contract?.depositAmount ?? '[залог]'} рублей. Возврат:{' '}
                {contract?.depositBackup ?? '[условия возврата залога]'}.
            </p>

            <h3>5. Права и обязанности сторон</h3>
            <p>5.1. Арендодатель обязуется:</p>
            <p>5.1.1. Передать Имущество в состоянии, указанном в п. 2.1.</p>
            <p>5.1.2. Вернуть залог по п. 4.4 при соблюдении условий.</p>
            <p>5.2. Арендатор обязуется:</p>
            <p>5.2.1. Использовать Имущество по назначению, соблюдая правила использования</p>
            <p>5.2.2. Оплатить аренду и залог по разделу 4.</p>
            <p>5.2.3. Вернуть Имущество в состоянии, не хуже исходного, с учётом износа.</p>

            <h3>6. Ответственность сторон</h3>
            <p>6.1. Арендатор возмещает ущерб Имуществу сверх залога в полном объёме.</p>
            <p>
                6.2. Арендодатель не отвечает за утрату имущества Арендатора, кроме умышленного
                вреда.
            </p>

            <h3>7. Порядок расторжения</h3>
            <p>7.1. Расторжение по соглашению или по закону РФ.</p>
            <p>
                7.2. Арендатор может отказаться за 24 часа до начала аренды с возвратом оплаты минус
                расходы Арендодателя.
            </p>
            <p>
                7.3. Арендодатель расторгает договор при нарушении п. 5.2, уведомив по телефону{' '}
                {contract?.ownerPhone ?? '[телефон арендодателя]'}{' '}
                {contract?.email ? `или email ${contract.email}` : ''}
            </p>

            <h3>8. Прочие условия</h3>
            <p>8.1. Договор действует с акцепта до исполнения обязательств.</p>
            <p>8.2. Споры — в суде по месту нахождения Арендодателя.</p>
            <p>8.3. Арендодатель подтверждает право сдавать Имущество.</p>
            <p>8.4. Стороны согласны на обработку данных по № 152-ФЗ.</p>

            <h3>9. Реквизиты сторон</h3>
            <p>Арендодатель:</p>
            {contract?.ownerType === 'LEGAL' ? (
                <>
                    <p>{contract?.organizationName ?? '[Наименование организации]'}</p>
                    <p>ОГРН: {contract?.ogrn ?? '[ОГРН]'}</p>
                    <p>ИНН: {contract?.inn ?? '[ИНН]'}</p>
                    <p>КПП: {contract?.kpp ?? '[КПП]'}</p>
                    <p>Юридический адрес: {contract?.legalAddress ?? '[юридический адрес]'}</p>
                    <p>
                        Представитель: {contract?.ownerName ?? '[ФИО представителя]'},{' '}
                        {contract?.positionOfRepresentative ?? '[должность представителя]'},{' '}
                        {contract?.document ?? '[документ-основание]'}
                    </p>
                </>
            ) : (
                <>
                    <p>{contract?.ownerName ?? '[ФИО арендодателя]'}</p>
                    <p>
                        Паспорт: {contract?.passportSeries ?? ''}{' '}
                        {contract?.passportNumber ?? '[паспорт арендодателя]'}
                    </p>
                    <p>
                        Адрес: {contract?.registrationAddress ?? '[адрес регистрации арендодателя]'}
                    </p>
                </>
            )}
            <p>Телефон: {contract?.ownerPhone ?? '[телефон арендодателя]'}</p>
            <p>Email: {contract?.email ?? '[email арендодателя]'}</p>
            <p>Реквизиты: {contract?.paymentDetails ?? '[банковские реквизиты арендодателя]'}</p>

            {/* <h4>Арендатор:</h4>
            <p>{contract?.tenantName ?? '[ФИО нанимателя]'}</p>
            <p>Паспорт: {contract?.tenantPassport ?? '[паспорт нанимателя]'}</p>
            <p>Адрес: {contract?.tenantAddress ?? '[адрес регистрации нанимателя]'}</p>
            <p>Телефон: {contract?.tenantPhone ?? '[телефон нанимателя]'}</p>
            <p>Email: {contract?.tenantEmail ?? '[email нанимателя]'}</p> */}
        </section>
    );
};
