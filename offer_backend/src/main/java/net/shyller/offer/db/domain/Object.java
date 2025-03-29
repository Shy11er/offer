package net.shyller.offer.db.domain;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import lombok.*;
import net.shyller.offer.common.DepositBackup;
import net.shyller.offer.common.ObjectType;
import net.shyller.offer.common.OwnerType;
import net.shyller.offer.common.RentType;

/**
 * Базовый класс для представления объекта.
 * Этот класс содержит общую информацию, которая может быть использована для различных типов договоров.
 */
@Getter
@Setter
@Entity
@Table(name = "object")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Object {
    /**
     * Уникальный идентификатор объекта.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Тип объекта.
     */
    @Enumerated(EnumType.STRING)
    @Column(name="object_type")
    private ObjectType objectType;

    /**
     * Тип владельца объекта.
     */
    @Enumerated(EnumType.STRING)
    @Column(name="owner_type")
    private OwnerType ownerType;

    /**
     * Имя владельца(или представителя) объекта.
     */
    @Column(name = "owner_name")
    private String ownerName;

    /**
     * Номер телефона владельца объекта.
     */
    @Column(name = "owner_phone")
    private String ownerPhone;

    // Данные физ лица
    /**
     * Паспорт владельца объекта.
     */
    @Column(name = "passport_series")
    private String passportSeries;

    /**
     * Паспорт владельца объекта.
     */
    @Column(name = "passport_number")
    private String passportNumber;

    // Данные юр лица
    /**
     * Название организации объекта.
     */
    @Column(name = "organization_name")
    private String organizationName;

    /**
     * ОГРН организации объекта.
     */
    @Column(name = "ogrn")
    private String ogrn;

    /**
     * ИНН организации объекта.
     */
    @Column(name = "inn")
    private String inn;

    /**
     * КПП организации объекта.
     */
    @Column(name = "kpp")
    private String kpp;

    /**
     * Юридический адрес организации объекта.
     */
    @Column(name = "legal_address")
    private String legalAddress;

    /**
     * Должность представителя организации объекта.
     */
    @Column(name = "position_of_representative")
    private String positionOfRepresentative;

    /**
     * Документ-основание.
     */
    @Column(name = "document")
    private String document;

    /**
     * Электронная почта владельца объекта.
     */
    @Column(name = "email")
    private String email;

    /**
     * Адрес регистрации владельца объекта.
     */
    @Column(name = "registration_address")
    private String registrationAddress;

    // ДАННЫЕ ОБ ОБЪЕКТЕ АРЕНДЫ(для недвижимости)
    /**
     * Адрес объекта аренды.
     */
    @Column(name = "address")
    private String address;

    /**
     * Площадь объекта аренды.
     */
    @Column(name = "square")
    private Integer square;

    /**
     * Кадастровый номер объекта аренды.
     */
    @Column(name = "cadastral_number")
    private String cadastralNumber;

    // ДАННЫЕ ОБ ОБЪЕКТЕ АРЕНДЫ(для техники)
    /*
     * Тип техники.
     */
    @Column(name = "technical_type")
    private String technicalType;

    /*
     * Техническое описание.
     */
    @Column(name = "technical_description")
    private String technicalDescription;

    // ДАННЫЕ ОБ ОБЪЕКТЕ АРЕНДЫ(для услуг)
    /*
     * Тип услуги.
     */
    @Column(name = "service_type")
    private String serviceType;

    /*
     * Техническое описание.
     */
    @Column(name = "service_description")
    private String serviceDescription;

    /*
     * Результат услуги (что получит клиент).
     */
    @Column(name = "service_result")
    private String serviceResult;

    // УСЛОВИЯ АРЕНДЫ(для техники и недвижимости)
    /**
     * Тип аренды.
     */
    @Enumerated(EnumType.STRING)
    @Column(name="rent_type")
    private RentType rentType;

    /**
     * Стоимость аренды в час или в сутки.
     */
    @Column(name = "rent_price")
    private Double rentPrice;

    /**
     * Кол-во дней или часов для аренды.
     */
    @Column(name = "rent_amount")
    private String rentAmount;

    /**
     * Дата начала аренды.
     */
    @Column(name = "start_date")
    private OffsetDateTime startDate;

    /**
     * Дата окончания аренды.
     */
    @Column(name = "end_date")
    private OffsetDateTime endDate;

    // ФОРМАТ ОПЛАТЫ
    /**
     * Флаг, указывающий, будет ли залог в рамках объекта.
     */
    @Column(name = "is_deposit")
    private boolean isDeposit;

    /**
     * Сумма залога, если она предусмотрена договором.
     */
    @Column(name = "deposit_amount")
    private Double depositAmount;

    /**
     * Тип залога, если он предусмотрен для объекта.
     * Возможные значения: {@link DepositBackup}.
     */
    @Enumerated(EnumType.STRING)
    @Column(name="deposit_backup")
    private DepositBackup depositBackup;

    // СПЕЦИАЛЬНЫЕ УСЛОВИЯ
    /**
     * C животными или без.
     */
    @Column(name = "with_animals")
    private boolean withAnimals;

    /**
     * Можно ли курить.
     */
    @Column(name = "can_smoke")
    private boolean canSmoke;

    @Column(name = "payment_details")
    private String paymentDetails;

    /**
     * Штрафы
     */
    @OneToMany(mappedBy = "object", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Penalty> penalties;

    /**
     * Дата подписания объекта.
     */
    @Column(name = "date_of_signed")
    private OffsetDateTime dateOfSigned;

    /**
     * Создан ли объект.
     */
    @Column(name = "is_generated")
    private boolean isGenerated;

    /**
     * Владелец объекта.
     */
    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "id")
    private User owner;

    /**
     * Подписант объекта.
     */
    @OneToOne
    @JoinColumn(name = "signer_id", referencedColumnName = "id")
    private User signer;
}
