import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import FolderIcon from '@material-ui/icons/Folder';
import { Grid, Paper, Popover, MenuList, IconButton } from '@material-ui/core';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DescriptionIcon from '@material-ui/icons/Description';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DialogFunc from './Dialog';
import classNames from 'classnames';

export default function TreeViewComp(props) {
    const classes = props.classstyle;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [typeFolder, setTypeFolder] = React.useState(null);
    const [subDialog, setSubDialog] = React.useState(false);
    const [actionSub, setActionSub] = React.useState(null);
    const [actionType, setActionType] = React.useState(null);
    const [itemName, setItemName] = React.useState(null);
    const [pathItem, setItemPath] = React.useState(null);
    const [fileSelected, setFileSelected] = React.useState({});

    const openDialog = (e) => {
        setSubDialog(true)
        setActionSub(e.target.getAttribute("name"))
        setActionType(e.target.id)
        if (e.target.id === "add") {
            setItemName("")
        }
    }

    const closeDialog = () => {
        setSubDialog(false)
        setAnchorEl(null)
    }

    const optionmenu = (e) => {
        e.preventDefault();
        setAnchorEl(e.currentTarget);
        setTypeFolder(e.currentTarget.id)
        setItemPath(e.currentTarget.getAttribute("path"))
        setItemName(e.currentTarget.getAttribute("name"))
        setFileSelected({
            fileId: e.currentTarget.getAttribute("fileId"),
            filePath: e.currentTarget.getAttribute("filePath")
        })
    }

    const handleClose = () => {
        setAnchorEl(null)
        setFileSelected({})
    }

    const submitItem = (valueitem, i = 1) => {
        setSubDialog(false)
        setAnchorEl(null)
        const linkarr = pathItem.split("/")
        var path = "/" + linkarr[i]
        var data2 = props.data

        function subfunc(target) {
            if (actionType === "delete") {
                if (linkarr.length <= 2) {
                    data2 = data2.filter((exa) => { return exa.path !== target.path })
                } else {
                    if (i < linkarr.length - 2) {
                        i = i + 1
                        path = path + "/" + linkarr[i]
                        target = target.files.find((exa) => { return exa.path === path })
                        subfunc(target)
                    } else {
                        target.files = target.files.filter((exa) => { return exa.path !== pathItem })
                    }
                }
            } else {
                if (linkarr.length < 2) {
                    props.submit(data2.push(valueitem))
                }
                else {
                    if (i < linkarr.length - 1) {
                        i = i + 1
                        path = path + "/" + linkarr[i]
                        target = target.files.find((exa) => { return exa.path === path })
                        subfunc(target)
                    } else {
                        switch (actionType) {
                            case "add": target.files.push(valueitem); break
                            case "rename": target.name = valueitem.name; break
                            default: console.log("choose nothing")
                        }
                    }
                }
            }
        }
        subfunc(data2.find((dataeach) => { return dataeach.path === path }))
        props.submit(data2)
    }

    function openFile() {
        props.onOpenFile(fileSelected);
        handleClose();
    }

    const open = Boolean(anchorEl);
    return (
        <Grid item xs={3} onContextMenu={optionmenu} style={{ maxWidth: 400, minWidth: 300 }}>
            <Paper className={classNames(classes.paper, classes.treeView)} >
                <h2 style={{ display: "flex", justifyContent: "space-between", margin: 0 }}>
                    Thư mục
                    <IconButton size="small">
                        <MoreVertIcon path={""} onClick={optionmenu} />
                    </IconButton>
                </h2>

                <TreeView
                    className={classes.root}
                    defaultCollapseIcon={<FolderOpenIcon />}
                    defaultExpandIcon={<FolderIcon />}
                    defaultEndIcon={<DescriptionIcon />}
                >
                    {props.data.map(function mapfolder(folder) {
                        if (folder.type === "folder") {
                            return (
                                <div key={folder.created} style={{ display: "flex", justifyContent: "space-between", position: 'relative', minHeight: 28 }}>
                                    <TreeItem className={classes.treeItem}
                                        nodeId={folder.created.toString()}
                                        style={{ textAlign: "left" }}
                                        label={folder.name}
                                    >
                                        {folder.files.map(mapfolder)}
                                    </TreeItem>
                                    <IconButton className={classes.treeItemIcon} size="small">
                                        <MoreVertIcon
                                            path={folder.path}
                                            id={folder.type}
                                            name={folder.name}
                                            onClick={optionmenu}
                                        />
                                    </IconButton>
                                </div>
                            )
                        } else {
                            return (
                                <div key={folder.created} style={{ display: "flex", justifyContent: "space-between", position: 'relative', minHeight: 28 }}>
                                    <TreeItem className={classes.treeItem}
                                        nodeId={folder.created.toString()}
                                        style={{ textAlign: "left" }}
                                        label={folder.name}
                                    />
                                    <IconButton className={classes.treeItemIcon} size="small">
                                        <MoreVertIcon
                                            fileId={folder.fileId}
                                            filePath={folder.filePath}
                                            path={folder.path}
                                            id={folder.type}
                                            name={folder.name}
                                            onClick={optionmenu}
                                        />
                                    </IconButton>
                                </div>
                            )
                        }
                    })}
                </TreeView>
                <Popover anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'center',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                >
                    {(typeFolder) ?
                        (typeFolder === "folder") ?
                            <MenuList>
                                <MenuItem onClick={openDialog} name="folder" id="add" >Tạo thư mục</MenuItem>
                                <MenuItem onClick={openDialog} name="file" id="add">Tạo file</MenuItem>
                                <MenuItem onClick={openDialog} name="folder" id="rename">Đổi tên</MenuItem>
                                <MenuItem onClick={openDialog} name="folder" id="delete">Xóa</MenuItem>
                            </MenuList>
                            : <MenuList>
                                <MenuItem onClick={() => openFile()} name="file" id="open">Mở file</MenuItem>
                                <MenuItem onClick={openDialog} name="file" id="rename">Đổi tên</MenuItem>
                                <MenuItem onClick={openDialog} name="file" id="delete">Xóa</MenuItem>
                            </MenuList>
                        : <MenuList>
                            <MenuItem onClick={openDialog} name="folder" id="add" >Tạo thư mục</MenuItem>
                            <MenuItem onClick={openDialog} name="file" id="add">Tạo file</MenuItem>
                        </MenuList>
                    }
                </Popover>
                <DialogFunc
                    submitItem={submitItem}
                    pathItem={pathItem}
                    setItemName={(e) => { setItemName(e.target.value) }}
                    itemName={itemName}
                    actionType={actionType}
                    actionSub={actionSub}
                    subDialog={subDialog}
                    template={props.template}
                    closeDialog={closeDialog}
                />
            </Paper>
        </Grid>
    )
}