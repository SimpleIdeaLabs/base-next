import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

export default function MyBackdrop(props) {
  const { open } = props;
  const classes = useStyles();
  return (
    <div>
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color='primary' />
      </Backdrop>
    </div>
  );
}