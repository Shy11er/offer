import block from 'bem-cn-lite';
import {convert as convertNumberToWordsRu} from 'number-to-words-ru';
import React from 'react';
import {ContractSectionProps, DepositBackup, RentType} from '../types/object';

const b = block('create-object');

export const ApartmentContract: React.FC<ContractSectionProps> = ({contract}) => {
    return (
        <section className={b('contract-data')}>
            <h1>ДОГОВОР-ОФЕРТА</h1>
            <p>на посуточный наём жилого помещения</p>
            <p>
                г. {contract?.address?.split(',')[0] ?? '[Город, указанный в адресе квартиры]'},
                дата акцепта оферты:{' '}
                {contract?.dateOfSigned?.substring(0, 10) ??
                    '[Дата акцепта, проставляется автоматически при принятии]'}
            </p>
            <h3>1. Общие положения</h3>
            <p>
                1.1. Настоящий документ является публичной офертой в соответствии со статьёй 435 и
                частью 2 статьи 437 Гражданского кодекса Российской Федерации (далее — ГК РФ).
            </p>
            {contract.ownerType === 'LEGAL' ? (
                <p>
                    1.2. {contract?.organizationName ?? '[Наименование организации]'}, ОГРН{' '}
                    {contract?.ogrn ?? '[ОГРН]'}, ИНН {contract?.inn ?? '[ИНН]'}, КПП{' '}
                    {contract?.kpp ?? '[КПП]'}, юридический адрес:{' '}
                    {contract?.legalAddress ?? '[юридический адрес]'}, в лице{' '}
                    {contract?.ownerName ?? '[ФИО представителя]'}, должность{' '}
                    {contract?.positionOfRepresentative ?? '[должность представителя]'},
                    действующего на основании {contract?.document ?? '[документ-основание]'} (далее
                    — Арендодатель), предлагает заключить договор аренды имущества на условиях ниже.
                </p>
            ) : (
                <p>
                    1.2. Я, {contract?.ownerName ?? '[ФИО]'}, паспорт{' '}
                    {contract?.passportSeries ?? ''}{' '}
                    {contract?.passportNumber ?? '[паспортные данные]'}
                    {contract?.givenBy && `, выдан ${contract?.givenBy}`}, зарегистрированный по
                    адресу: {contract?.registrationAddress ?? '[адрес регистрации]'} (далее —
                    Наймодатель), предлагаю любому физическому или юридическому лицу (далее —
                    Наниматель) заключить договор найма жилого помещения на условиях, изложенных
                    ниже.
                </p>
            )}
            <p>1.3. Акцепт — заполнение данных, согласие и оплата по разделу 4.</p>
            <p>1.4. Акцепт означает полное принятие условий.</p>
            <h3>2. Предмет договора</h3>
            <p>
                2.1. Наймодатель предоставляет Нанимателю во временное владение и пользование жилое
                помещение — квартиру, расположенную по адресу:{' '}
                {contract?.address ?? '[адрес квартиры]'}, общей площадью{' '}
                {contract?.square ?? '[площадь квартиры]'} кв.м, кадастровый номер{' '}
                {contract?.cadastralNumber ?? '[кадастровый номер]'}
                {contract?.apartmentCondition && `, в состоянии: ${contract?.apartmentCondition}`}
                {contract?.listOfAppartmentProperties &&
                    `, с имуществом: ${contract?.listOfAppartmentProperties}`}
                {contract?.peopleAmount &&
                    `, для проживания: ${contract?.peopleAmount} человек в период ${
                        contract.startDate && contract?.endDate
                            ? `${
                                  contract?.startDate
                                      ?.substring(0, contract?.startDate?.length - 8)
                                      .replace('T', ' ') ?? '[минимальный срок аренды]'
                              } до ${
                                  contract?.endDate
                                      ?.substring(0, contract?.endDate?.length - 8)
                                      .replace('T', ' ') ?? '[максимальный срок аренды]'
                              }`
                            : '(будет указано после указания даты въезда и выезда)'
                    }`}
            </p>
            {contract?.keyAmount && (
                <p>2.2. Квартира передаётся с {contract.keyAmount} комплектами ключей.</p>
            )}
            <h3>3. Срок найма</h3>
            <p>
                3.1. Срок найма Помещения составляет от{' '}
                {contract.startDate && contract?.endDate
                    ? `${
                          contract?.startDate
                              ?.substring(0, contract?.startDate?.length - 8)
                              .replace('T', ' ') ?? '[минимальный срок аренды]'
                      }
                    до ${
                        contract?.endDate
                            ?.substring(0, contract?.endDate?.length - 8)
                            .replace('T', ' ') ?? '[максимальный срок аренды]'
                    }`
                    : '(будет указано после указания даты въезда и выезда)'}
            </p>
            <p>
                3.2. Время заезда:{' '}
                {contract.startDate
                    ? `${
                          contract?.startDate
                              ?.substring(0, contract?.startDate?.length - 8)
                              .replace('T', ' ') ?? '[минимальный срок аренды]'
                      }`
                    : '(будет указано после указания даты въезда)'}
                {'. '}
                Время выезда{': '}
                {contract.endDate
                    ? `${
                          contract?.endDate
                              ?.substring(0, contract?.endDate?.length - 8)
                              .replace('T', ' ') ?? '[минимальный срок аренды]'
                      }`
                    : '(будет указано после указания даты выезда)'}
            </p>
            <p>
                3.3. Наниматель обязан освободить Помещение не позднее времени выезда, указанного в
                пункте 3.2, если иное не согласовано сторонами в письменной форме.
            </p>
            <h3>4. Плата за наём и порядок расчётов</h3>
            <p>
                4.1. Стоимость найма{' '}
                {contract?.rentPrice ? convertNumberToWordsRu(+contract?.rentPrice) : ''} в{' '}
                {contract?.rentType === RentType.DAY ? 'сутки' : 'час'}. Общая сумма:{' '}
                {contract?.rentPrice && contract?.startDate && contract?.endDate
                    ? `${convertNumberToWordsRu(
                          +contract.rentPrice *
                              (Math.floor(
                                  (new Date(contract.endDate).setHours(0, 0, 0, 0) -
                                      new Date(contract.startDate).setHours(0, 0, 0, 0)) /
                                      (1000 * 60 * 60 * 24),
                              ) +
                                  1),
                      )} рублей.`
                    : ' (будет указано после указания даты начала и окончания аренды)'}
                .
            </p>
            <p>
                4.2. Залог:{' '}
                {contract?.depositAmount
                    ? `${convertNumberToWordsRu(+contract?.depositAmount)} рублей`
                    : 'не указан '}{' '}
                , возврат: {contract?.conditionsForReturnPledge ?? 'не указон'}.
            </p>
            <p>
                4.3. Оплата:{' '}
                {contract?.depositBackup === DepositBackup.CARD ? 'на карту' : 'наличкой'} на{' '}
                {contract?.paymentDetails ?? ''}
            </p>
            <p>
                4.4. Дополнительные услуги (при наличии): Можно курить:{' '}
                {contract.canSmoke ? 'Да' : 'Нет'}, Можно с животными:{' '}
                {contract.withAnimals ? 'Да' : 'Нет'}.
            </p>
            <h3>5. Обязанности сторон</h3>
            <p>5.1. Арендодатель обязуется:</p>
            <p>5.1.1. Не изменять цену в течение срока найма.</p>
            {contract.apartmentCondition && (
                <p>
                    5.1.2. Передать квартиру в пригодном состоянии с{' '}
                    {contract.apartmentCondition ?? ''}.
                </p>
            )}
            <p>5.2. Арендатор обязуется:</p>
            <p>5.2.1. Сообщать о неисправностях Арендодателю.</p>
            <p>5.2.2. Допускать Арендодателя для осмотра/ремонта с уведомлением.</p>
            <p>
                5.2.3. Освободить квартиру к{' '}
                {contract?.endDate?.substring(0, contract?.endDate?.length - 8).replace('T', ' ')} в
                последний день.
            </p>
            <p>5.2.4. Возместить ущерб имуществу по фактическим расходам.</p>
            {contract?.peopleAmount && (
                <p>5.2.5. Использовать квартиру для проживания {contract?.peopleAmount} человек.</p>
            )}
            <h3>6. Права сторон</h3>
            <p>6.1. Арендодатель вправе:</p>
            <p>6.1.1. Требовать оплаты и освобождения квартиры по сроку.</p>
            <p>
                6.1.2. Предлагать дополнительные услуги: Можно курить:{' '}
                {contract.canSmoke ? 'Да' : 'Нет'}, Можно с животными:{' '}
                {contract.withAnimals ? 'Да' : 'Нет'}.
            </p>
            {contract?.apartmentCondition && (
                <p>
                    6.1.3. Требовать соблюдение правил проживания:{' '}
                    {contract?.apartmentCondition ?? ''}.
                </p>
            )}
            <p>6.2. Арендатор вправе:</p>
            <p>6.2.1. Осматривать квартиру и имущество с уведомлением Арендодателя.</p>
            <p>6.2.2. Требовать качества коммунальных услуг.</p>
            <h3>7. Ответственность сторон</h3>
            <p>7.1. Арендатор возмещает ущерб имуществу.</p>
            <p>
                7.2. Ответственность Арендодателя ограничена суммой{' '}
                {contract?.rentPrice && contract?.startDate && contract?.endDate
                    ? `${convertNumberToWordsRu(
                          +contract.rentPrice *
                              (Math.floor(
                                  (new Date(contract.endDate).setHours(0, 0, 0, 0) -
                                      new Date(contract.startDate).setHours(0, 0, 0, 0)) /
                                      (1000 * 60 * 60 * 24),
                              ) +
                                  1),
                      )} рублей.`
                    : ' (будет указано после указания даты начала и окончания аренды)'}{' '}
            </p>
            <h3>8. Условия оплаты и расторжения</h3>
            <p>
                8.1. Расторжение по соглашению или закону РФ. Арендатор уведомляет за 24 часа, иначе
                залог не возвращается.
            </p>
            {contract?.conditionsForReturnPledge && (
                <p>
                    8.2. Оплата — до первого дня аренды. При отказе за{' '}
                    {contract?.conditionsForReturnPledge ?? ''} залог не возвращается.
                </p>
            )}
            <h3>9. Заключительные условия</h3>
            <p>9.1. Договор действует с акцепта до исполнения.</p>
            <p>9.2. Споры — в суде по месту нахождения квартиры.</p>
            <p>9.3. Арендодатель подтверждает право сдавать квартиру</p>
            <h3>10. Реквизиты Наймодателя</h3>
            <p>Наймодатель: {contract?.ownerName ?? '[ФИО / название организации]'}</p>
            {contract?.ownerType === 'LEGAL' ? (
                <>
                    <p>ИНН: {contract?.inn ?? '[ИНН]'}</p>
                    <p>ОГРН: {contract?.ogrn ?? '[ОГРН]'}</p>
                    <p>Юридический адрес: {contract?.legalAddress ?? '[юр. адрес]'}</p>
                </>
            ) : (
                <>
                    <p>
                        Паспорт: {contract?.passportSeries ?? ''}{' '}
                        {contract?.passportNumber ?? '[паспортные данные]'}
                    </p>
                    {contract?.givenBy && <p>Кем выдан: {contract?.givenBy ?? ''}</p>}
                    <p>
                        Адрес регистрации: {contract?.registrationAddress ?? '[адрес регистрации]'}
                    </p>
                </>
            )}
            {contract?.ownerPhone && <p>Телефон: {contract?.ownerPhone ?? ''}</p>}
            {contract?.email && <p>Email: {contract?.email}</p>}
        </section>
    );
};
