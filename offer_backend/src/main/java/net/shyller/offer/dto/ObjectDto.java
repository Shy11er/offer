package net.shyller.offer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import net.shyller.offer.common.DepositBackup;
import net.shyller.offer.common.ObjectType;
import net.shyller.offer.common.OwnerType;
import net.shyller.offer.common.RentType;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

/**
 * DTO для объекта аренды
 */
@Getter
@Setter
@Schema(description = "Сущность объекта аренды")
public class ObjectDto {
    @Schema(description = "ID объекта")
    private UUID id;

    @Schema(description = "Тип объекта")
    private ObjectType objectType;

    @Schema(description = "Тип владельца")
    private OwnerType ownerType;

    @Schema(description = "Имя владельца")
    private String ownerName;

    @Schema(description = "Телефон владельца")
    private String ownerPhone;

    @Schema(description = "Серия паспорта")
    private String passportSeries;

    @Schema(description = "Номер паспорта")
    private String passportNumber;

    @Schema(description = "Кем выдан паспорт")
    private String givenBy;

    @Schema(description = "Название организации")
    private String organizationName;

    @Schema(description = "ОГРН")
    private String ogrn;

    @Schema(description = "ИНН")
    private String inn;

    @Schema(description = "КПП")
    private String kpp;

    @Schema(description = "Юридический адрес")
    private String legalAddress;

    @Schema(description = "Должность представителя")
    private String positionOfRepresentative;

    @Schema(description = "Документ-основание")
    private String document;

    @Schema(description = "Email")
    private String email;

    @Schema(description = "Адрес регистрации")
    private String registrationAddress;

    @Schema(description = "Адрес объекта аренды")
    private String address;

    @Schema(description = "Площадь объекта")
    private Integer square;

    @Schema(description = "Кадастровый номер")
    private String cadastralNumber;

    @Schema(description = "Состояние квартиры")
    private String apartmentCondition;

    @Schema(description = "Детали оплаты")
    private String paymentDetails;

    @Schema(description="Список вещей в квартире")
    private String listOfAppartmentProperties;

    @Schema(description="Штраф за ранний въезд/поздний выезд")
    private String penaltyForIncorrectExit;

    @Schema(description = "Условия возврата залога")
    private String conditionsForReturnPledge;

    @Schema(description = "Условия при котором залога не возвращается")
    private String whenPledgeNotReturn;

    @Schema(description = "Количество ключей")
    private String keyAmount;

    @Schema(description = "Количество людей для аренды")
    private String peopleAmount;

    @Schema(description = "Тип техники")
    private String technicalType;

    @Schema(description = "Описание техники")
    private String technicalDescription;

    @Schema(description = "Тип услуги")
    private String serviceType;

    @Schema(description = "Описание услуги")
    private String serviceDescription;

    @Schema(description = "Результат услуги")
    private String serviceResult;

    @Schema(description = "Тип аренды")
    private RentType rentType;

    @Schema(description = "Стоимость аренды")
    private Double rentPrice;

    @Schema(description = "Количество дней или часов аренды")
    private String rentAmount;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    @Schema(description = "Дата начала аренды")
    private OffsetDateTime startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    @Schema(description = "Дата окончания аренды")
    private OffsetDateTime endDate;

    @Schema(description = "Есть ли залог")
    private boolean isDeposit;

    @Schema(description = "Сумма залога")
    private Double depositAmount;

    @Schema(description = "Форма залога")
    private DepositBackup depositBackup;

    @Schema(description = "Можно с животными")
    private boolean withAnimals;

    @Schema(description = "Можно курить")
    private boolean canSmoke;

    @Schema(description = "Штрафы")
    private List<PenaltyDto> penalties;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX", timezone = "UTC")
    @Schema(description = "Дата подписания объекта")
    private OffsetDateTime dateOfSigned;

    @JsonProperty("isGenerated")
    @Schema(description = "Сгенерирован ли объект")
    private boolean isGenerated;

    @Schema(description = "Договор")
    private ContractDto contract;

    @Schema(description = "Кастомный договор")
    private String customContract;

    @Schema(description = "Название кастомного договора")
    private String customContractName;

    @Schema(description = "Является ли шаблоном")
    private boolean isTemplate;

    @Schema(description = "Приложение")
    private String application;

    @Schema(description = "Название приложения")
    private String applicationName;

    public boolean getIsTemplate() {
        return this.isTemplate;
    }
}
