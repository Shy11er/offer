export const Templates = {
    PHYSICAL_APARTMENT: `
ДОГОВОР-ОФЕРТА
на посуточный наём жилого помещения

г. {{city}}, дата акцепта оферты: {{signedDate}}

1. Общие положения
1.1. Я, {{ownerName}}, паспорт {{passportSeries}} {{passportNumber}}, зарегистрированный по адресу: {{registrationAddress}}, (Наймодатель), предлагаю...

2. Предмет договора
2.1. Жилое помещение по адресу: {{address}}, площадью {{square}} кв.м...

3. Аренда
3.1. Стоимость: {{rentPrice}} ₽ ({{rentPriceWords}})...

...

9. Контакты Наймодателя:
Имя: {{ownerName}}
Телефон: {{ownerPhone}}
Email: {{email}}
`,
    // Другие шаблоны по типу:
    // LEGAL_SERVICE: `...`
};
