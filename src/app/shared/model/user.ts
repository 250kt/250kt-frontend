export interface User {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    authorities?: string[];
    tokens?: string[];
    isEmailConfirmed?: boolean;
}