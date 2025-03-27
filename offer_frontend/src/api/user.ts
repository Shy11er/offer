import instance from '../core/axios';

export interface UserDto {
    id: string;
    username: string;
    password: string;
    subscriptionExpiresAt: string;
    roles: RoleName[];
}

export enum RoleName {
    ADMIN = 'ROLE_ADMIN',
    PAID_USER = 'ROLE_PAID_USER',
}

export interface CreateUserPayload {
    username: string;
    password: string;
}

export interface UpdateUserPayload {
    username: string;
    password: string;
    subscriptionExpiresAt: string | null;
}

export const getAll = async (): Promise<UserDto[]> => {
    const response = await instance.get<UserDto[]>('/users');
    return response.data;
};

export const create = async (payload: CreateUserPayload): Promise<UserDto> => {
    const response = await instance.post<UserDto>('/users', payload);
    return response.data;
};

export const update = async (id: string, payload: UpdateUserPayload): Promise<UserDto> => {
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
