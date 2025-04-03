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

export const uploadDocument = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await instance.post<string>('/contracts/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    console.log(response.data);

    return response.data;
};

export const getPhoto = async (contractId: string) => {
    const response = await instance.get(`/contracts/${contractId}/document-photo`, {
        responseType: 'blob',
    });

    const blob = new Blob([response.data], {type: 'image/jpeg'});
    const url = URL.createObjectURL(blob);

    window.open(url, '_blank');
};
