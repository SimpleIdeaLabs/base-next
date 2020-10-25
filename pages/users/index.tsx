import { GetServerSideProps } from 'next';
import Head from 'next/head';
import React from 'react';
import DashboardLayout from '../../src/layouts/dashboard.layout';
import { useEffect, useState } from "react";
import AuthService from '../../src/modules/auth/auth.service';
import Router from 'next/router';
import swal from 'sweetalert2';
import { HeadCell } from '../../src/components/datagrid/datagrid.dto';
import ViewIcon from '@material-ui/icons/Visibility';
import IconButton from '@material-ui/core/IconButton';
import DeleteButton from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import { makeStyles, Theme, createStyles, Tooltip, Button, ButtonGroup } from '@material-ui/core';
import DataGrid from '../../src/components/datagrid';
import { DEFAULT_ROWS_PER_PAGE, ROWS_PER_PAGE_OPTIONS } from '../../src/components/datagrid/datagrid.constant';
import CommonService from '../../src/common/common.service';
import MyBackdrop from '../../src/components/backdrop/mybackdrop';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    btnCreate: {
      width: '200px'
    }
  }),
);

const Users = (props) => {
  const { session } = props;
  const classes = useStyles();
  const [auths, setAuths] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const getAuths = async () => {
    try {
      setLoading(true);
      const { data: responseAuths, status, pagination: { total } } = await AuthService.list({
        page,
        rowsPerPage
      });
      if (!status) throw new Error();
      setAuths(responseAuths);
      setTotal(total);
    } catch (error) {
      swal.fire('Error', 'Something went wrong', 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => await getAuths())();
  }, [page, rowsPerPage]);

  const handleCreate = () => {
    Router.push('/users/create');
  };

  const onPageChange = (newPage: number) => {
    setPage(newPage);
  }

  const onRowPageChange = (newRowPerPage: number) => {
    setRowsPerPage(newRowPerPage);
  }

  const headCells: HeadCell[] = [
    { id: 'email',  disablePadding: true, label: 'Email', align: 'left' },
    { 
      id: 'createdAt', disablePadding: true, label: 'Created At', align: 'left',
    },
    { 
      id: 'action', 
      disablePadding: true,
      label: 'Action', 
      align: 'right',
      cellActionRender: (row) => {
        return (
          <ButtonGroup color="primary">
            <Tooltip title='View'>
              <Button>
                <Link href={`/users/${row.id}`}>
                  <ViewIcon />
                </Link>
              </Button>
            </Tooltip>
            <Tooltip title='Delete'>
              <Button>
                <DeleteButton/ >
              </Button>
            </Tooltip>
          </ButtonGroup>
        )
      }
    },
  ];

  const customToolBar = () => { 
    return (
      <Tooltip title="Add User">
        <Button
          onClick={handleCreate}
          className={classes.btnCreate}
          variant="contained"
          color="primary"
          endIcon={<AddIcon />}>
          Create User
        </Button>
      </Tooltip>
    );
  }

  return (
    <DashboardLayout session={session} title={'Users'}>
      <Head>
        <title>Users</title>
      </Head>
      <MyBackdrop open={loading} />
      <DataGrid 
        data={auths}
        headCells={headCells}
        title={'Users'}
        customToolBar={customToolBar}
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
    if (!session || !status) {
      return CommonService.redirectToLogin(ctx);
    }
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