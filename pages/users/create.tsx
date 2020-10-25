import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import DashboardLayout from '../../src/layouts/dashboard.layout';
import AuthService from '../../src/modules/auth/auth.service';
import RoleService from '../../src/modules/role/role.service';
import { UserForm } from '../../src/modules/auth/components/userform';
import swal from 'sweetalert2';
import { useState } from 'react';
import { ICreateAuthParams } from '../../src/modules/auth/auth.service.dto';
import Router from 'next/router';
import CommonService from '../../src/common/common.service';

const Users = (props) => {
  const { session, roles } = props;
  const [errors, setErrors] = useState({} as any);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (payload: ICreateAuthParams) => {
    try {
      setLoading(true);
      const { status, validationErrors } = await AuthService.create(payload);
      if (!status && Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors([]);
      swal.fire('Success', 'User successfully created', 'success')
        .then(result => {
          Router.push('/users');
        });
    } catch (error) {
      swal.fire('Error', 'Something went wrong', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout session={session} title={'Create User'}>
      <Head>
        <title>Create User</title>
      </Head>
      <UserForm
        mode='CREATE'
        onSubmit={onSubmit}
        errors={errors}
        roles={roles} 
        loading={loading}
        btnText='Create User' />
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    const { data: { session }, status } = await AuthService.getCurrentSession(ctx);
    if (!session || !status) return CommonService.redirectToLogin(ctx);
    const { data: roles } = await RoleService.list(ctx);
    return {
      props: {
        roles,
        session
      }
    }
  } catch (error) {
    return CommonService.redirectToLogin(ctx);
  }
};

export default Users;