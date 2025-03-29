import { ContractDto } from "./contract";

export enum ObjectType {
    APARTMENT = 'APARTMENT',
    TECHNIQUE = 'TECHNIQUE',
    SERVICE = 'SERVICE',
}

export enum OwnerType {
    PHYSICAL = 'PHYSICAL',
    LEGAL = 'LEGAL',
}

export enum RentType {
    HOUR = 'HOUR',
    DAY = 'DAY',
}

export enum DepositBackup {
    CASH = 'CASH',
    CARD = 'CARD',
}

export interface PenaltyDto {
    id?: string;
    reason: string;
    amount: number;
}

export interface ObjectDto {
    id: string;
    objectType?: ObjectType;
    ownerType?: OwnerType;
    ownerName?: string;
    ownerPhone?: string;
    passportSeries?: string;
    passportNumber?: string;
    organizationName?: string;
    ogrn?: string;
    inn?: string;
    kpp?: string;
    legalAddress?: string;
    positionOfRepresentative?: string;
    document?: string;
    email?: string;
    registrationAddress?: string;
    address?: string;
    square?: number | string;
    cadastralNumber?: string;
    technicalType?: string;
    technicalDescription?: string;
    serviceType?: string;
    serviceDescription?: string;
    serviceResult?: string;
    rentType?: RentType;
    rentPrice?: number;
    rentAmount?: string;
    startDate?: string; // ISO 8601 string
    endDate?: string; // ISO 8601 string
    isDeposit?: boolean;
    depositAmount?: number;
    depositBackup?: DepositBackup;
    withAnimals?: boolean;
    canSmoke?: boolean;
    penalties?: PenaltyDto[];
    dateOfSigned?: string;
    paymentDetails?: string;
    isGenerated?: boolean;

    contract?: ContractDto;
}

export interface ContractSectionProps {
    contract: ObjectDto;
}
