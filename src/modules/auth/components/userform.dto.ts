import { ICreateAuthParams, IUpdateAuthParams } from "../auth.service.dto";

export interface IUserFormProps {
  mode: 'CREATE' | 'EDIT' | 'VIEW';
  onSubmit: (params: ICreateAuthParams | IUpdateAuthParams) => Promise<any>;
  errors: any;
  roles: any[];
  loading: boolean;
  initialFormValue?: any;
  btnText: string;
}