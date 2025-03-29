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

export interface CreateUserDto {
    username: string;
    password: string;
}

export interface UpdateUserDto {
    username: string;
    password: string;
    subscriptionExpiresAt: string | null;
}
