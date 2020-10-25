import { CircularProgress } from '@material-ui/core';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import DashboardLayout from '../../src/layouts/dashboard.layout';
import AuthService from '../../src/modules/auth/auth.service';
import RoleService from '../../src/modules/role/role.service';
import DataGrid from '../../src/components/datagrid';
import swal from 'sweetalert2';
import { HeadCell } from '../../src/components/datagrid/datagrid.dto';
import { DEFAULT_ROWS_PER_PAGE } from '../../src/components/datagrid/datagrid.constant';
import CommonService from '../../src/common/common.service';
import MyBackdrop from '../../src/components/backdrop/mybackdrop';


const Roles = (props) => {
  const title = 'Roles';
  const { session } = props;
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  
  const getRoles = async () => {
    try {
      setLoading(true);
      const { data: rolesData, status, pagination: { total } } = await RoleService.paginatedList({
        page,
        rowsPerPage
      });
      if (!status) throw new Error('Failed getting roles');
      setRoles(rolesData);
      setTotal(total);
    } catch (error) {
      swal.fire('Error', 'Something went wrong', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() =>  {
    (async () => {
      await getRoles();
    })();  
  }, [page, rowsPerPage]);


  const headCells: HeadCell[] = [
    { id: 'name',  disablePadding: true, label: 'Name', align: 'left' },
    { 
      id: 'createdAt', disablePadding: true, label: 'Created At', align: 'left',
    },
  ];

  const onPageChange = (newPage: number) => {
    setPage(newPage);
  }

  const onRowPageChange = (newRowPerPage: number) => {
    setRowsPerPage(newRowPerPage);
  }

  return (
    <DashboardLayout session={session} title={title}>
      <Head>
        <title>{title}</title>
      </Head>
      <MyBackdrop open={loading}/>
      <DataGrid 
        data={roles}
        headCells={headCells}
        title={title}
        customToolBar={null}
        onRowPageChange={onRowPageChange}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        total={total}
        page={page}
        loading={loading}
      />
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

export default Roles;