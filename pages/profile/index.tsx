import { Typography } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import DashboardLayout from '../../src/layouts/dashboard.layout';
import AuthService from '../../src/modules/auth/auth.service';

const Profile = (props) => {
  const { session } = props;
  return (
    <DashboardLayout session={session} title={'Profile'}>
      <Head>
        <title>Profile</title>
      </Head>
      <Typography variant='h4'>
        Profile Page
      </Typography>
    </DashboardLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { data: { session }, status } = await AuthService.getCurrentSession(ctx);
  if (!session || !status) {
    ctx.res.writeHead(307, {
      Location: '/login'
    });
    ctx.res.end();
    return {};
  }
  return {
    props: {
      session
    }
  }
};

export default Profile;