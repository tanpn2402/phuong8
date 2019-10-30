import React from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Typography, List, ListItem, ListItemIcon, Checkbox, ListItemText } from '@material-ui/core';

const URL = window.apiURL || 'http://127.0.0.1:33003';

export default function DialogFunc(props) {
    const actionSub = props.actionSub
    const actionType = props.actionType
    const itemName = props.itemName
    const subDialog = props.subDialog
    const pathItem = props.pathItem
    const [checked, setChecked] = React.useState(-1);

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
                            props.submitItem(valueitem);
                        }
                        else {
                            alert("Xuất hiện lỗi, vui lòng thử lại");
                        }
                    })
            }
            else if (actionType === 'delete') {
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
                            props.submitItem(valueitem);
                        }
                        else {
                            alert("Xuất hiện lỗi, vui lòng thử lại");
                        }
                    })
            }
            else {
                props.submitItem(valueitem);
            }
        }
        else {
            props.submitItem(valueitem);
        }
    }

    const handleCheck = value => () => {
        setChecked(value);
    };


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
                    {(actionType === "add")
                        ? <TextField
                            autoFocus
                            margin="dense"
                            id={"new" + actionSub}
                            label={"Tên file"}
                            type="text"
                            fullWidth
                            value={itemName}
                            onChange={props.setItemName}
                        />
                        : <TextField
                            autoFocus
                            margin="dense"
                            id={"rename" + actionSub}
                            label={"Tên file"}
                            type="text"
                            fullWidth
                            value={itemName}
                            onChange={props.setItemName}
                        />
                    }
                    {actionType === 'add' && <>
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