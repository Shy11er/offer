package net.shyller.offer.db.domain;

import jakarta.persistence.*;
import lombok.*;
import net.shyller.offer.common.ContractType;
import net.shyller.offer.common.DepositBackup;
import net.shyller.offer.common.OwnerType;
import net.shyller.offer.common.RentType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Базовый класс для представления договора.
 * Этот класс содержит общую информацию, которая может быть использована для различных типов договоров.
 */
@Getter
@Setter
@Entity
@Table(name = "contract")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    /**
     * Уникальный идентификатор договора.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    /**
     * Тип договора.
     */
    @Enumerated(EnumType.STRING)
    @Column(name="contract_type")
    private ContractType contractType;

    /**
     * Тип владельца договора.
     */
    @Enumerated(EnumType.STRING)
    @Column(name="owner_type")
    private OwnerType ownerType;

    /**
     * Имя владельца(или представителя) договора.
     */
    @Column(name = "owner_name")
    private String ownerName;

    /**
     * Номер телефона владельца договора.
     */
    @Column(name = "owner_phone")
    private String ownerPhone;

    // Данные физ лица
    /**
     * Паспорт владельца договора.
     */
    @Column(name = "passport_series")
    private String passportSeries;

    /**
     * Паспорт владельца договора.
     */
    @Column(name = "passport_number")
    private String passportNumber;

    // Данные юр лица
    /**
     * Название организации договора.
     */
    @Column(name = "organization_name")
    private String organizationName;

    /**
     * ОГРН организации договора.
     */
    @Column(name = "ogrn")
    private String ogrn;

    /**
     * ИНН организации договора.
     */
    @Column(name = "inn")
    private String inn;

    /**
     * КПП организации договора.
     */
    @Column(name = "kpp")
    private String kpp;

    /**
     * Юридический адрес организации договора.
     */
    @Column(name = "legal_address")
    private String legalAddress;

    /**
     * Должность представителя организации договора.
     */
    @Column(name = "position_of_representative")
    private String positionOfRepresentative;

    /**
     * Документ-основание.
     */
    @Column(name = "document")
    private String document;

    /**
     * Электронная почта владельца договора.
     */
    @Column(name = "email")
    private String email;

    /**
     * Адрес регистрации владельца договора.
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

    // УСЛОВИЯ АРЕНДЫ
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
     * Флаг, указывающий, будет ли залог в рамках договора.
     */
    @Column(name = "is_deposit")
    private boolean isDeposit;

    /**
     * Сумма залога, если она предусмотрена договором.
     */
    @Column(name = "deposit_amount")
    private Double depositAmount;

    /**
     * Тип залога, если он предусмотрен для договора.
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

    /**
     * Штрафы
     */
    @OneToMany(mappedBy = "contract", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Penalty> penalties;

    /**
     * Дата подписания договора.
     */
    @Column(name = "date_of_signed")
    private LocalDateTime dateOfSigned;
}
