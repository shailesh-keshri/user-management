export interface UserModel {
    uid?:string,
    displayName?:string,
    email?:string,
    password?:string,
    roles?:string,
    emailVerified?: boolean,
    disabled?: boolean,
}
