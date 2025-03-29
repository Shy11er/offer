import {ObjectDto} from './object';

export interface ContractDto {
    id?: string;

    objectDto: ObjectDto;

    fullName: string;
    passportSeries: string;
    passportNumber: string;
    address: string;
    phone: string;

    signedAt?: string;

    ip?: string;
    userAgent?: string;
}
