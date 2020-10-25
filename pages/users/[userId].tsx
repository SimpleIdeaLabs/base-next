import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React, { useEffect } from 'react';
import DashboardLayout from '../../src/layouts/dashboard.layout';
import AuthService from '../../src/modules/auth/auth.service';
import RoleService from '../../src/modules/role/role.service';
import { UserForm } from '../../src/modules/auth/components/userform';
import swal from 'sweetalert2';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { IUpdateAuthParams } from '../../src/modules/auth/auth.service.dto';
import CommonService from '../../src/common/common.service';
import MyBackdrop from '../../src/components/backdrop/mybackdrop';

const UserDetail = (props) => {
  const { session, roles } = props;
  const [errors, setErrors] = useState({} as any);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userId = router.query.userId;

  const getAuth = async () => {
    setLoading(true);
    try {
      const { data: _userData, status } = await AuthService.read(+userId);
      if (!status) throw new Error('User not found');
      setUserData(_userData);
    } catch (error) {
      console.log(error);
      swal.fire('Error', 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => await getAuth())();
  }, []);

  const onSubmit = async (payload: IUpdateAuthParams) => {
    try {
      setLoading(true);
      const id = router.query.userId;
      const { status, validationErrors } = await AuthService.update({ ...payload, id: +id });
      if (!status && Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors([]);
      swal.fire({
        title: 'Success',
        text: 'User successfully updated',
        showCancelButton: false,
        confirmButtonText: 'Ok',
      }).then(async (result) => {
        if (result.isConfirmed) {
          router.push('/users');
        };
      })
    } catch (error) {
      swal.fire('Error', 'Something went wrong', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout session={session} title={'User Detail'}>
      <Head>
        <title>User Detail</title>
      </Head>
      <MyBackdrop open={loading} />
      <UserForm
        mode={+session.id === +userId ? 'EDIT' : 'VIEW' }
        initialFormValue={userData}
        onSubmit={onSubmit}
        errors={errors}
        roles={roles} 
        loading={loading} 
        btnText='Update User' />
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

export default UserDetail;