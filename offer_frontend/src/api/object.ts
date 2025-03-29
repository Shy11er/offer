import {ObjectDto} from '@/types/object';
import instance from '../core/axios';

export const getAll = async (): Promise<ObjectDto[]> => {
    const response = await instance.get<ObjectDto[]>('/objects');
    return response.data;
};

export const getById = async (objectId: string): Promise<ObjectDto> => {
    console.log(objectId);
    const response = await instance.get<ObjectDto>(`/objects/${objectId}`);
    return response.data;
};

export const create = async (payload: ObjectDto): Promise<ObjectDto> => {
    const response = await instance.post<ObjectDto>('/objects', payload);
    return response.data;
};

export const update = async (id: string, payload: ObjectDto): Promise<ObjectDto> => {
    const response = await instance.patch<ObjectDto>(`/objects/${id}`, payload);
    return response.data;
};

export const remove = async (id: string): Promise<void> => {
    await instance.delete(`/objects/${id}`);
};
