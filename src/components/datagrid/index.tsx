import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Alignement } from '@material-ui/data-grid';
import { DataGridHeaderProps, DataGridProps } from './datagrid.dto';
import { DataGridToolBar } from './datagridtoolbar';
import { ROWS_PER_PAGE_OPTIONS } from './datagrid.constant';
import { CircularProgress } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2),
    },
    table: {
      minWidth: 750,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    }
  }),
);

function DataGridHead(props: DataGridHeaderProps) {
  const { headCells } = props;
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align as Alignement}
            padding={'default'}>
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function DataGrid(props: DataGridProps) {
  const { title, data, headCells, customToolBar, rowsPerPage, page, onRowPageChange, onPageChange, total, loading } = props;
  const classes = useStyles();

  const handleChangePage = (event: unknown, newPage: number) => {
    onPageChange(+newPage);
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    onRowPageChange(+event.target.value);
  }

  const fillEmptyRows = (rowsPerPage, page, data) => {
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
    if (!emptyRows) return;
    return (
      <TableRow style={{ height: 53 * emptyRows }}>
        <TableCell colSpan={6} />
      </TableRow>
    );
  }

  const tableRow = (row: any) => {
    return (
      <TableRow key={row.id}>
        {headCells.map(head => {
          if (head.id === 'action') {
            return (
              <TableCell component="th" scope="row" padding="default" align='right'>
                {head.cellActionRender(row)}
              </TableCell>
            );
          }

          if (head.cellRender) {
            return head.cellRender(row);
          }

          return (
            <TableCell component="th" scope="row" padding="default">
              {row[head.id]}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <DataGridToolBar
          title={title}
          customToolBar={customToolBar} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'medium'}
            aria-label="enhanced table"
          >
            <DataGridHead
              headCells={headCells}
              classes={classes}
              rowCount={data.length}
            />
            <TableBody>
              {data.map((row, index) => {
                return tableRow(row);
              })}
              {fillEmptyRows(rowsPerPage, page, data)}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
          component="div"
          count={total}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}