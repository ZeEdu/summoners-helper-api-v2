export interface ICreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface ILoginUserDto {
  email: string;
  password: string;
}