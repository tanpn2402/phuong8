import React from 'react';
import { Dialog, Button, Paper } from '@material-ui/core';
import { DialogTitle } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import { IconButton } from '@material-ui/core';

const URL = window.apiURL || 'http://127.0.0.1:33003';

class IdentityDialog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            data: [],
            loading: true
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.open !== this.state.open) {
            this.fetchData(nextProps.data);
            this.setState({
                open: nextProps.open,
                data: []
            })
        }
    }

    fetchData({ fileid }) {
        this.setState({ loading: true })
        fetch(URL + '/api/identity/get', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                fileid
            })
        })
            .then(e => e.json())
            .then(e => {
                this.setState({ loading: false })

                if (e.ok) {
                    this.setState({
                        data: e.data
                    })
                }
            })
    }

    render() {
        const { open, loading, data, idOpenLoading } = this.state;
        const { classes } = this.props;


        return <>
            <Dialog open={open}
                onClose={() => this.setState({ open: false })}
                classes={{
                    paper: classes.dialogPaper
                }}
            >
                <DialogTitle>CMND</DialogTitle>
                <DialogContent>
                    {loading && <Typography component='small'>Đang tải...</Typography>}
                    {!loading && data && data.length === 0 && <Typography component='small'>Không tìm thấy dữ liệu</Typography>}
                    <Grid container justify='center'>
                        <Grid item>
                            {data && data.map(e => {
                                return <Paper className={classes.imageContainer}>
                                    <div className={classes.clearImage}>
                                        <IconButton onClick={() => this.onRemoveImage(e)}>
                                            <ClearIcon />
                                        </IconButton>
                                    </div>
                                    <img src={e.value} alt={'adsa'} className={classes.image} />
                                </Paper>
                            })}
                        </Grid>
                    </Grid>
                    <br />
                    <br />
                    <Grid container alignItems='center' justify='center'>
                        <Grid item>
                            <Button color='primary' variant='contained' onClick={() => this.onChooseFile()}>Thêm mới</Button>
                            <input key={new Date().getTime()} type='file' id="getFile" onChange={e => this.onfileChange(e)} style={{ display: 'none' }}></input>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>

            <Dialog open={idOpenLoading}>
                <DialogContent>
                    <Typography component='small'>Đang tải...</Typography>
                </DialogContent>
            </Dialog>
        </>
    }

    onRemoveImage(data) {
        fetch(URL + '/api/identity/delete', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                id: data.id
            })
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok) {
                    let d = this.state.data.filter(el => el.id !== data.id);

                    this.setState({
                        data: [].concat(d)
                    })
                }
            })
    }

    onChooseFile() {
        document.getElementById('getFile').click();
    }

    onfileChange(e) {
        const { data } = this.props;
        let file = e.target.files[0];
        let self = this;

        if (file) {
            self.setState({ idOpenLoading: true })
            const reader = new FileReader();

            reader.onload = function (e) {
                let base64 = e.target.result;

                fetch(URL + '/api/identity/insert', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        fileid: data.fileid,
                        value: base64
                    })
                })
                    .then(e => e.json())
                    .then(e => {
                        self.setState({ idOpenLoading: false })
                        if (e.ok) {
                            self.setState({
                                data: [].concat(self.state.data).concat({ id: e.insertId, value: base64 })
                            })
                        }
                    })
            }

            reader.readAsDataURL(file);
        }
    }
}

const styles = theme => ({
    dialogPaper: {
        minWidth: 800
    },
    image: {
        width: '100%'
    },
    imageContainer: {
        position: 'relative',
        width: 600,
        marginBottom: 10
    },
    clearImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#3f51b5'
    }
})

export default withStyles(styles)(IdentityDialog); 