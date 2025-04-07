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


export const createPay = async (user_id: number, user_email: string, back_url: string) => {
    const response = await instance.get(`/pay/init?user_id=${user_id}&user_email=${user_email}&back_url=${back_url}`);
    return response.data
};

export const checkPay = async (user_id: number) => {
    const response = await instance.get(`/pay/check?user_id=${user_id}`);
    return response.data
};

// export const cancelSubscription = async (user_id: number) => {
//     const response = await instance.get(`/pay/cancel?user_id=${user_id}`);
//     return response.data
// };