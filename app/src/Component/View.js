import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Grid, Paper, Button } from '@material-ui/core';
import TreeViewComp from './TreeView'
import constant from '../constants';
const URL = constant.API_URL;

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing(7),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 7),
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: 120,
            '&:focus': {
                width: 200,
            },
        },
    },
    paper: {
        textAlign: 'center',
        color: theme.palette.text.primary,
        height: '100%'
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
    treeView: {
        padding: 10,
        userSelect: 'none',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        '& .ReactTable': {
            flex: 1,
            overflow: 'auto'
        }
    },
    treeItem: {
        textAlign: 'left',
        width: '100%'
    },
    treeItemIcon: {
        position: 'absolute',
        right: 0
    },
    tabMain: {
        backgroundColor: '#FFF'
    },
    treeviewRoot: {
        flex: 1,
        minHeight: 0,
        overflow: 'auto'
    }
}));


export default function View(props) {
    const classes = useStyles();
    const [fileSelected, setFileSelected] = React.useState({});


    function openFile(file) {
        setFileSelected(file);
    }

    function openInChrome() {
        fetch(URL + '/api/open/?e=chrome', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                data: JSON.stringify({})
            })
        })
            .then(e => e.json())
            .then(e => {
                
            })
    }

    return (
        <div className={classes.root} style={{ backgroundColor: "lightgrey" }}>
            <AppBar position="static" style={{ height: "25" }}>
                <Toolbar>
                    <Grid container>
                        <Grid item xs>
                            <Typography className={classes.title} variant="h5" noWrap>
                                Phường 8
                            </Typography>
                        </Grid>

                        {window.navigator.appVersion.includes('Electron') && <Grid item>
                            <Button variant='contained' onClick={() => openInChrome()}>Mở bằng Chrome</Button>
                        </Grid>}
                    </Grid>
                    {/* <div className={classes.search}>
                        <div className={classes.searchIcon}>
                            <SearchIcon />
                        </div>
                        <InputBase
                            placeholder="Search…"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.inputInput,
                            }}
                            inputProps={{ 'aria-label': 'search' }}
                        />
                    </div> */}
                </Toolbar>
            </AppBar>
            <Grid container spacing={2} style={{ padding: 6, flex: 1, minHeight: 0 }}>
                <TreeViewComp
                    data={props.data}
                    template={props.template}
                    submit={props.submit}
                    classstyle={classes}
                    onOpenFile={e => openFile(e)}
                />
                <Grid item xs>
                    <Paper className={classes.paper} style={{ height: '100%' }} key={fileSelected.fileId || -1}>
                        {fileSelected.fileId && <iframe style={{ width: '100%', height: '100%', border: 'none', borderRadius: 4 }}
                            title='document'
                            src={`${URL}/${fileSelected.filePath}?id=${fileSelected.fileId}`}
                        />}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}