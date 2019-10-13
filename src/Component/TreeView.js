import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import FolderIcon from '@material-ui/icons/Folder';
import { Grid, Paper, Popover, MenuList } from '@material-ui/core';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DescriptionIcon from '@material-ui/icons/Description';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DialogFunc from './Dialog';

export default function TreeViewComp(props){
    const classes = props.classstyle;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [typeFolder, setTypeFolder] = React.useState(null);
    const [subDialog, setSubDialog] = React.useState(false);
    const [actionSub, setActionSub] = React.useState(null)
    const [actionType, setActionType] = React.useState(null)
    const [itemName, setItemName] = React.useState(null)


    const openDialog=(e)=>{
      setSubDialog(true)
      setActionSub(e.target.getAttribute("name"))
      setActionType(e.target.id)

    } 

    const closeDialog =()=>{
      setSubDialog(false)
      setAnchorEl(null)
    }

    const optionmenu=(e)=>{
        e.preventDefault();
        setAnchorEl(e.currentTarget);
        setTypeFolder(e.currentTarget.id)
        setItemName(e.currentTarget.getAttribute("name"))
      }
    const handleClose=()=>{
        setAnchorEl(null)
      }


      const open = Boolean(anchorEl);
    return(
        <Grid item xs={3}>
              <Paper className={classes.paper} >
                  <h1>TreeView-Folders</h1>
                  <TreeView
                    
                    className={classes.root}
                    defaultCollapseIcon={<FolderOpenIcon />}
                    defaultExpandIcon={<FolderIcon />}
                    defaultEndIcon={<DescriptionIcon/>}
                  >
                        {props.data.map(function mapfolder(folder) {
                          if(Array.isArray(folder.files)){
                            return(
                              <div key={folder.created} style={{display: "flex", justifyContent: "space-between"}}>
                              <TreeItem nodeId={folder.created.toString()}  style={{textAlign:"left"}} label={folder.name}>
                                {folder.files.map(mapfolder)}
                              </TreeItem>
                              <MoreVertIcon id={folder.type} name={folder.name} onClick={optionmenu}/>
                              </div>
                              )
                          }else{
                            return(
                              <div key={folder.created} style={{display: "flex", justifyContent: "space-between"}}>
                              <TreeItem className={folder.type} nodeId={folder.created.toString()} style={{textAlign:"left"}} label={folder.name}/>
                              <MoreVertIcon id={folder.type} name={folder.name} onClick={optionmenu} />
                              </div>
                              )
                          }
                        }
                        )}
                  
                  </TreeView>
                  <Popover anchorEl={anchorEl} keepMounted open={open} onClose={handleClose} 
                    anchorOrigin={{ vertical: 'bottom',
                                    horizontal: 'center',
                                  }}
                    transformOrigin={{ vertical: 'top',
                                       horizontal: 'left',
                                  }}
                  >
                    {
                      (typeFolder ==="folder") ?
                      <MenuList>
                        <MenuItem onClick={openDialog} name="folder" id="add" >Add Folder</MenuItem>
                        <MenuItem onClick={openDialog} name="file" id="add">Add File</MenuItem>
                        <MenuItem onClick={openDialog} name="folder" id="rename">Rename Folder</MenuItem>
                        <MenuItem onClick={openDialog} id="delete">Delete Folder</MenuItem>
                      </MenuList>
                      : <MenuList>
                          <MenuItem onClick={openDialog} name="file" id="rename">Rename file</MenuItem>
                          <MenuItem onClick={openDialog} id="delete">Delete File</MenuItem>
                        </MenuList>
                    }
                </Popover>
                <DialogFunc setItemName={(e)=>{setItemName(e.target.value)}} itemName={itemName} actionType={actionType} actionSub={actionSub} subDialog={subDialog} closeDialog={closeDialog}/>
              </Paper>
            </Grid>
      )
}