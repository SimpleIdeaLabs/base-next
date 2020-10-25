import { API_URL } from '../../config/api';
import fetch from 'isomorphic-unfetch';
import AuthService from '../auth/auth.service';
import { IPaginatedResponse, IResponse } from '../../common/common.dtos';
import { IGetRoleList } from './role.service.dto';
import { GetServerSidePropsContext } from 'next';

export default class RoleService {

  static list = async (ctx: GetServerSidePropsContext = null): Promise<IResponse> => {
    try {
      const token =  await AuthService.getUserToken(ctx);
      const response = await fetch(`${API_URL}/roles`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }).then(r => r.json());
      const { data, status } = response;
      return { 
        data,
        status
      }
    } catch (error) {
      throw error;
    }
  }

  static paginatedList = async (params: IGetRoleList): Promise<IPaginatedResponse> => {
    try {
      const { page, rowsPerPage, ctx } = params;
      const token =  await AuthService.getUserToken(ctx);
      const { data, status, pagination } = await fetch(`${API_URL}/roles?page=${page}&limit=${rowsPerPage}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }).then(r => r.json());
      return { 
        data,
        status,
        pagination
      }
    } catch (error) {
      throw error;
    }
  }

}