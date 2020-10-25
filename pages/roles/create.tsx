import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import CommonService from '../../src/common/common.service';
import DashboardLayout from '../../src/layouts/dashboard.layout';
import AuthService from '../../src/modules/auth/auth.service';

const Users = (props) => {
  const { session } = props;
  const title = 'Create User';
  return (
    <DashboardLayout session={session} title={title}>
      <Head>
        <title>{title}</title>
      </Head>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  try {
    const { data: { session }, status } = await AuthService.getCurrentSession(ctx);
    if (!session || !status) return CommonService.redirectToLogin(ctx);
    return {
      props: {
        session
      }
    }
  } catch (error) {
    return CommonService.redirectToLogin(ctx);
  }
};

export default Users;