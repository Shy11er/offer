import {CreateUserDto, UpdateUserDto, UserDto} from '@/types/user';
import instance from '../core/axios';

export const getAll = async (): Promise<UserDto[]> => {
    const response = await instance.get<UserDto[]>('/users');
    return response.data;
};

export const create = async (payload: CreateUserDto): Promise<UserDto> => {
    const response = await instance.post<UserDto>('/users', payload);
    return response.data;
};

export const update = async (id: string, payload: UpdateUserDto): Promise<UserDto> => {
    const response = await instance.patch<UserDto>(`/users/${id}`, payload);
    return response.data;
};

export const cancelSubscription = async (id: string): Promise<UserDto> => {
    const response = await instance.patch<UserDto>(`/users/${id}/cancel-subscription`);
    return response.data;
};

export const remove = async (id: string): Promise<void> => {
    await instance.delete(`/users/${id}`);
};

export const getMe = async (): Promise<UserDto> => {
    const response = await instance.get<UserDto>('/users/me');
    return response.data;
};


export const createPay = async (userId: number, userEmail: string, backUrl: string) => {
    const response = await instance.post(`/pay/init?userId=${userId}&userEmail=${userEmail}&backUrl=${backUrl}`);
    return response.data
};

export const checkPay = async (userId: number) => {
    const response = await instance.get(`/pay/check?userId=${userId}`);
    return response.data
};

export const cancelSubscriptionT = async (userId: number) => {
    const response = await instance.get(`/pay/cancel?userId=${userId}`);
    return response.data
};