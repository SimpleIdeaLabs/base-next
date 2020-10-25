import { API_URL } from '../../config/api';
import fetch from 'isomorphic-unfetch';
import { ILoginParams } from './login.service.dto';
import AuthService from '../auth/auth.service';
import { IResponse } from '../../common/common.dtos';

export default class LoginService {

  static login = async (params: ILoginParams): Promise<IResponse> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(params)
      }).then(r => r.json());
      const { data, status } = response;
      if (!status) throw new Error('Login failed.');
      await AuthService.saveUserToken(data.token);
      return {
        data,
        status
      };
    } catch (error) {
      throw error;
    }
  }

}