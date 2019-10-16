import React, { useState, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles(theme => ({
    '@global': {
        body: {
            backgroundColor: theme.palette.common.white,
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        height: 50,
        margin: theme.spacing(3, 0, 2),
    },
}));


const URL = window.apiURL || 'http://127.0.0.1:33003';

export default function Login(props) {
    const classes = useStyles();
    const username = useRef(null);
    const password = useRef(null);
    const [isError, setError] = useState(false);

    function login(e) {
        e.preventDefault();
        setError(false);
        fetch(URL + '/api/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                username: username.current.value,
                password: password.current.value
            })
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok == 1) {
                    props.onLoginDone();
                } else {
                    setError(true);
                }
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Vui lòng Đăng nhập
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Tên đăng nhập"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        inputRef={username}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mật khẩu"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        inputRef={password}
                    />
                    {isError && <Typography>Sai tên đăng nhập hoặc tài khoản, vui lòng thử lại</Typography>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={e => login(e)}
                    >
                        Đăng nhâp
                    </Button>
                </form>
            </div>
        </Container>
    );
}