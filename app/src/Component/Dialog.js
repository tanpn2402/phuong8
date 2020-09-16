import React from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, List, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';
import constant from '../constants';
const URL = constant.API_URL;

export default function DialogFunc(props) {
    const actionSub = props.actionSub
    const actionType = props.actionType
    const itemName = props.itemName
    const subDialog = props.subDialog
    const pathItem = props.pathItem
    const [checked, setChecked] = React.useState(-1);

    console.log(props.fileSelected)

    const submitF = () => {
        const date = new Date();

        let valueitem = {
            name: itemName,
            type: actionSub,
            path: pathItem + "/" + itemName.replace(" ", ""),
            created: date.getHours() + "h" + date.getMinutes() + "m" + date.getSeconds() + "s-" + date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear(),
            files: []
        }

        if (actionSub === 'file') {
            if (actionType === 'add') {
                console.log(valueitem);
                // return;
                if (checked.path === undefined) {
                    alert("Vui lòng chọn loại file");
                    return;
                }
                fetch(URL + '/api/document/new', {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json; charset=utf-8'
                    },
                    body: JSON.stringify({
                        name: itemName,
                        folder: pathItem,
                        source: checked.path
                    })
                })
                    .then(e => e.json())
                    .then(e => {
                        if (e.ok === 1) {
                            valueitem.fileId = e.insertId;
                            valueitem.filePath = checked.path;
                            props.submitItem(valueitem, actionType);
                        }
                        else {
                            alert("Xuất hiện lỗi, vui lòng thử lại");
                        }
                    })
            }
            else if (actionType === 'delete') {
                if(props.fileSelected.fileId) {

                    fetch(URL + '/api/document/delete', {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json; charset=utf-8'
                        },
                        body: JSON.stringify({
                            id: props.fileSelected.fileId
                        })
                    })
                    .then(e => e.json())
                    .then(e => {
                        if (e.ok === 1) {
                            props.submitItem(valueitem, actionType);
                        }
                        else {
                            alert("Xuất hiện lỗi, vui lòng thử lại");
                        }
                    })
                } 
                else {
                    props.submitItem(valueitem, actionType);
                }
            }
            else if (actionType === 'move') {
                // console.log(valueitem)
                // console.log(checked);

                let p = {
                    from: valueitem,
                    to: {
                        ...valueitem,
                        path: checked.path + "/" + itemName.replace(" ", ""),
                        fileId: props.fileSelected.fileId,
                        filePath: props.fileSelected.filePath
                    }
                }
                console.log(p)
                props.moveFile(p);

                // fetch(URL + '/api/document/new', {
                //     method: 'POST',
                //     headers: {
                //         'Content-type': 'application/json; charset=utf-8'
                //     },
                //     body: JSON.stringify({
                //         name: itemName,
                //         folder: checked.path,
                //         source: props.fileSelected.filePath
                //     })
                // })
                //     .then(e => e.json())
                //     .then(e => {
                //         if (e.ok === 1) {
                //             p.to.fileId = e.insertId;
                //             p.to.filePath = props.fileSelected.filePath;
                //             console.log(p);
                //             props.moveFile(p);
                //         }
                //         else {
                //             alert("Xuất hiện lỗi, vui lòng thử lại");
                //         }
                //     })
                
                // props.moveFile(p);
            }
            else if (actionType === 'copy') {
                props.submitItem(valueitem, actionType);
            }
            else {
                props.submitItem(valueitem, actionType);
            }
        }
        else {
            props.submitItem(valueitem, actionType);
        }
    }

    const handleCheck = value => () => {
        setChecked(value);
    };


    const listFolder = getFolder(props.listFolder);

    if (actionType === "delete") {
        return (
            <Dialog open={subDialog} onClose={props.closeDialog}>
                {(actionSub === "folder") ? <DialogTitle>Đồng ý xóa thư mục {itemName}?</DialogTitle>
                    : <DialogTitle>Đồng ý xóa file {itemName}?</DialogTitle>}
                {actionSub === "folder" && <DialogContentText>Tất cả thư mục và files trong thư mục này sẽ mất.</DialogContentText>}
                <DialogActions>
                    <Button onClick={props.closeDialog} color="secondary">
                        Đóng
                    </Button>
                    <Button onClick={submitF} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
    else if (actionSub === "folder") {
        return (
            <Dialog open={subDialog} onClose={props.closeDialog} >
                <DialogTitle>Thư mục</DialogTitle>
                <DialogContent>
                    {(actionType === "add")
                        ? <TextField
                            autoFocus
                            margin="dense"
                            id={"new" + actionSub}
                            label={"Tên thư mục"}
                            type="text"
                            fullWidth
                            value={itemName}
                            onChange={props.setItemName}
                        />
                        : <TextField
                            autoFocus
                            margin="dense"
                            id={"rename" + actionSub}
                            label={"Tên thư mục"}
                            type="text"
                            fullWidth
                            value={itemName}
                            onChange={props.setItemName}
                        />
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.closeDialog} color="secondary">
                        Đóng
                    </Button>
                    <Button onClick={submitF} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
    else if (actionSub === "file") {
        return (
            <Dialog open={subDialog} onClose={props.closeDialog}>
                <DialogTitle>File</DialogTitle>
                <DialogContent>
                    {actionType === "rename" && <TextField
                        autoFocus
                        margin="dense"
                        id={"rename" + actionSub}
                        label={"Tên file"}
                        type="text"
                        fullWidth
                        value={itemName}
                        onChange={props.setItemName}
                    />}
                    {actionType === 'add' && <>
                        <TextField
                            autoFocus
                            margin="dense"
                            id={"new" + actionSub}
                            label={"Tên file"}
                            type="text"
                            fullWidth
                            value={itemName}
                            onChange={props.setItemName}
                        />
                        <div style={{ marginTop: 20 }}></div>
                        <Typography>Chọn loại file</Typography>
                        <List>
                            {(props.template || []).map(value => {
                                const labelId = `checkbox-list-label-${value.id}`;
                                return (
                                    <ListItem key={value.id} role={undefined} dense button onClick={handleCheck(value)}>
                                        <ListItemIcon style={{ minWidth: 0 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.id === value.id}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value.name} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>}

                    {actionType === 'move' && <>
                        <div style={{ marginTop: 20 }}></div>
                        <Typography>Chuyển đến thư mục: </Typography>
                        <List>
                            {(listFolder || []).map((value, index) => {
                                const labelId = `checkbox-list-label-${value.actualPath}`;
                                return (
                                    <ListItem key={index} role={undefined} dense button onClick={(props.pathItem.includes(value.path)) ? ()=>alert("Bạn đang chọn thư mục hiện tại ! Vui lòng chọn thư mục khác !") : handleCheck(value)}>
                                        <ListItemIcon style={{ minWidth: 0 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.actualPath === value.actualPath}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value.actualPath} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>}

                    {actionType === 'copy' && <>
                        <div style={{ marginTop: 20 }}></div>
                        <Typography>Chuyển đến thư mục: </Typography>
                        <List>
                            {(listFolder || []).map(value => {
                                const labelId = `checkbox-list-label-${value}`;
                                return (
                                    <ListItem key={value} role={undefined} dense button onClick={handleCheck(value)}>
                                        <ListItemIcon style={{ minWidth: 0 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={checked.actualPath === value.actualPath}
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{ 'aria-labelledby': labelId }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText id={labelId} primary={value.actualPath} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>}

                </DialogContent>
                <DialogActions>
                    <Button onClick={props.closeDialog} color="secondary">
                        Đóng
                    </Button>
                    <Button onClick={submitF} color="primary">
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        )
    } else {
        return <div></div>
    }
}


const getFolder = (data) => {
    let list = [];

    const getListFolder = (e, path) => {
        if (e.files && e.files.length > 0) {
            // e.files.map(el => {
            //     getListFolder(el, path + '/' + el.name);
            // })
            if (e.files.filter(el => el.type === 'folder').length > 0) {

                e.files.filter(el => el.type === 'folder').map(el => {
                    getListFolder(el, path + '/' + el.name);
                })
            }
            else {
                list.push({
                    ...e,
                    actualPath: path
                });
            }
        }
        else {
            list.push({
                ...e,
                actualPath: path
            });
        }
    }

    data.map(e => {
        getListFolder(e, e.name);
    })

    let rlt = [];
    list.forEach(e => {
        if (rlt.indexOf(e.actualPath) > -1) {

        }
        else {
            rlt.push(e);
        }
    })

    // console.log(rlt);
    return rlt;
}

