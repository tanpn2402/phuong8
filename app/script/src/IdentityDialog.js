import React from 'react';
import { Dialog, Button, Paper, Tooltip } from '@material-ui/core';
import { DialogTitle } from '@material-ui/core';
import { DialogContent } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import { Grid } from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import { IconButton } from '@material-ui/core';
import { saveAs } from 'file-saver';

const URL = window.apiURL || 'http://127.0.0.1:33003';

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab], { type: mimeString });
    return bb;
}

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
                                return <Paper className={classes.imageContainer} key={e.id}>
                                    <div className={classes.clearImage}>
                                        <Tooltip title='Xoay trái'>
                                            <IconButton onClick={() => this.onRotateImage(e, -1)}>
                                                <RotateLeftIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Xoay phải'>
                                            <IconButton onClick={() => this.onRotateImage(e, 1)}>
                                                <RotateRightIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Tải xuống'>
                                            <IconButton onClick={() => this.onDownloadImage(e)}>
                                                <ArrowDownwardIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title='Xóa'>
                                            <IconButton onClick={() => this.onRemoveImage(e)}>
                                                <ClearIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </div>
                                    <img src={e.value} alt={'adsa'} className={classes.image} id={'imag-' + e.id} onClick={() => this.openImage(e)} />
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
                    <Typography component='small'>Đang upload...</Typography>
                </DialogContent>
            </Dialog>
        </>
    }

    onRotateImage(data, dir) {
        let r = document.getElementById('imag-' + data.id).style.transform;
        r = r.replace('rotate(', '');
        r = r.replace('deg)', '');

        if (r === '') {
            r = 0;
        }

        r = parseInt(r) + dir * 90;

        document.getElementById('imag-' + data.id).style.transform = `rotate(${r}deg)`;
    }

    openImage(data) {
        // let w = window.open('', '_blank');
        // let image = new Image();
        // image.src = data.value;
        // setTimeout(function () {
        //     w.document.write(image.outerHTML);
        // }, 0);
    }

    onDownloadImage(data) {
        // let url = URL + '/api/identity/download?id=' + data.id;
        // saveAs(data.value);

        let blob = dataURItoBlob(data.value);
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        a.remove();

        // fetch(data.value)
        //     .then(res => res.blob())
        //     .then(console.log)

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
                        self.setState({ idOpenLoading: false });
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
        width: 500,
        height: 360,
        objectFit: 'contain'
    },
    imageContainer: {
        position: 'relative',
        width: 600,
        height: 500,
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    clearImage: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#3f51b5',
        zIndex: 9
    }
})

export default withStyles(styles)(IdentityDialog); 