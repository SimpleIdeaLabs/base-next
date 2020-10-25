import * as browserCookies from 'cookie-cutter';
import serverCookies from 'cookies';
import { GetServerSidePropsContext } from 'next';
import { API_URL } from '../../config/api';
import fetch from 'isomorphic-unfetch';
import { IPaginatedResponse, IResponse } from '../../common/common.dtos';
import CommonService from '../../common/common.service';
import { ICreateAuthParams, IGetAuthList, IUpdateAuthParams } from './auth.service.dto';
import { TOKEN_TAG } from './auth.constants';

export default class AuthService {
  static saveUserToken = async (token: string) => {
    await browserCookies.set(TOKEN_TAG, token);
  };

  static logout = async () => {
    await browserCookies.set(TOKEN_TAG, null);
  };

  static getUserToken = async(ctx: GetServerSidePropsContext = null) => {
    const isBrowser = CommonService.isBrowser();
  
    // Get Token from Client
    if (isBrowser && !ctx) {
      const token = await browserCookies.get(TOKEN_TAG);
      return token;
    }

    // Get Token from Request
    const { req, res } = ctx;
    const serverCookie = new serverCookies(req, res);
    const token = await serverCookie.get(TOKEN_TAG);
    return token;
  };

  static getCurrentSession = async (ctx: GetServerSidePropsContext): Promise<IResponse> => {
    try {
      const token = await AuthService.getUserToken(ctx);
      const response = await fetch(`${API_URL}/auth/get-current-session`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(r => r.json());
      if (!response?.user) {
        return {
          data: {
            session: null
          },
          status: false
        }
      }
      return {
        data: {
          session: response.user
        },
        status: true
      };
    } catch (error) {
      throw error;
    }
  };

  static list = async (params: IGetAuthList): Promise<IPaginatedResponse> => {
    try {
      const { page, rowsPerPage } = params;
      const token = await AuthService.getUserToken();
      const { data, status, pagination } = await fetch(`${API_URL}/auth?page=${page}&limit=${rowsPerPage}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(r => r.json());
      return {
        data,
        status,
        pagination,
      }
    } catch (error) {
      throw error;
    }
  };

  static create = async (payload: ICreateAuthParams): Promise<IResponse> => {
    try {
      const token = await AuthService.getUserToken();
      const { status, data, validationErrors} = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      }).then(r => r.json());
      return {
        data,
        status,
        validationErrors: CommonService.extractErrors(validationErrors)
      }
    } catch (error) {
      throw error;
    }
  };

  static read = async (id: number): Promise<IResponse> => {
    try {
      const token = await AuthService.getUserToken();
      const { status, data } = await fetch(`${API_URL}/auth/${id}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then(r => r.json());
      return {
        data,
        status,
      }
    } catch (error) {
      throw error;
    }
  };

  static update = async (params: IUpdateAuthParams): Promise<IResponse> => {
    try {
      const { id } = params;
      const token = await AuthService.getUserToken();
      const { status, data, validationErrors } = await fetch(`${API_URL}/auth/${id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(params)
      }).then(r => r.json());
      return {
        data,
        status,
        validationErrors: CommonService.extractErrors(validationErrors)
      }
    } catch (error) {
      throw error;
    }
  }


}