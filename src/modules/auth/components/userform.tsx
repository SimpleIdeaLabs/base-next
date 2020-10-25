import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Button, Grid, MenuItem, Paper, Toolbar, Typography } from '@material-ui/core';
import { IUserFormProps } from './userform.dto';
import { useEffect } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
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

export const UserForm = (props: IUserFormProps) => {
  const classes = useStyles();
  const { mode, onSubmit, errors, roles, loading, btnText, initialFormValue } = props;
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!initialFormValue) return;
    setEmail(initialFormValue.email);
    setRole(initialFormValue.roles[0].id);
    return () => { }
  }, [initialFormValue]);
  
  const handleSubmit = () => {
    onSubmit({
      email,
      role,
      password,
      confirmPassword
    });
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        alignItems='center'
        justify='center'>
        <Grid item xs={8} md={8} lg={6}>
          <Paper className={classes.paper}>
            <Toolbar>
              <Typography variant='h6'>Create User</Typography>
            </Toolbar>
            <form noValidate autoComplete="off">
              <div className={classes.formFieldContainer}>
                <TextField 
                  required 
                  id="email" 
                  label="Email" 
                  fullWidth
                  error={errors.email}
                  value={email}
                  helperText={errors.email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={mode == 'VIEW'} />
              </div>
              <div className={classes.formFieldContainer}>
                <TextField
                  id="role"
                  select
                  label="Role"
                  fullWidth
                  error={errors.role}
                  helperText={errors.role}
                  onChange={e => setRole(e.target.value)}
                  value={role}
                  disabled={mode == 'VIEW'}>
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              {
                mode == 'VIEW' ? null : 
                <>
                  <div className={classes.formFieldContainer}>
                    <TextField 
                      required 
                      id="password" 
                      label="Password"
                      type='password'
                      fullWidth 
                      onChange={e => setPassword(e.target.value)} 
                      error={errors.password}
                      helperText={errors.password} />
                  </div>
                  <div className={classes.formFieldContainer}>
                    <TextField 
                      required 
                      id="confirmPassword" 
                      label="Confirm Password"
                      type='password'
                      fullWidth
                      onChange={e => setConfirmPassword(e.target.value)}
                      error={errors.confirmPassword}
                      helperText={errors.confirmPassword} />
                  </div>
                  <div className={classes.formFieldContainer}>
                    <Button 
                      fullWidth 
                      color='secondary' 
                      variant='contained'
                      onClick={handleSubmit}
                      disabled={loading}>
                        { loading ? 'Loading...' : btnText }
                    </Button>
                  </div>
                </>
              }
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}