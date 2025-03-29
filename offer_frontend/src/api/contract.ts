import instance from '../core/axios';
import {ContractDto} from '../types/contract';

export const createContract = async (data: ContractDto): Promise<ContractDto> => {
    const response = await instance.post('/contracts', data);
    return response.data;
};

export const getAllByObjectOwner = async (): Promise<ContractDto[]> => {
    const response = await instance.get('/contracts/all');
    return response.data;
};
