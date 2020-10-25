export interface ICreateAuthParams {
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
}

export interface IUpdateAuthParams {
  id: number;
  email: string;
  role: string;
  password?: string;
  confirmPassword?: string;
}

export interface IGetAuthList {
  page: number;
  rowsPerPage: number;
}
