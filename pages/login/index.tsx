import { Button, Container, createStyles, Grid, makeStyles, Paper, TextField, Theme } from "@material-ui/core";
import Head from "next/head";
import React, { useState } from "react";
import MainLayout from "../../src/layouts/main.layout";
import LoginService from '../../src/modules/login/login.service';
import Router from 'next/router';
import swal from 'sweetalert2';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      paddingTop: theme.spacing(5)
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    formFieldContainer: {
      padding: theme.spacing(2)
    }
  }),
);

export default function Login() {
  const classes = useStyles();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await LoginService.login(form);
      Router.replace('/profile');
    } catch (error) {
      swal.fire('Error', 'Login Failed', 'error');
    }
  };

  return (
    <MainLayout>
      <Head>
        <title>Login</title>
      </Head>
      <Container className={classes.root}>
        <Grid
          container
          alignItems='center'
          justify='center'
        >
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <form noValidate autoComplete="off">
                <div className={classes.formFieldContainer}>
                  <TextField label="Emails" type='email' fullWidth onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div className={classes.formFieldContainer}>
                  <TextField label="Password" type='password' fullWidth onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
                <div className={classes.formFieldContainer}>
                  <Button variant="contained" color="primary" fullWidth onClick={handleLogin}>
                    Login
                  </Button>
                </div>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
}