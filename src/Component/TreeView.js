import React from 'react';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import FolderIcon from '@material-ui/icons/Folder';
import { Grid, Paper,Menu, Popover } from '@material-ui/core';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import DescriptionIcon from '@material-ui/icons/Description';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

export default function TreeViewComp(props){
    const classes = props.classstyle;
    const [anchorEl, setAnchorEl] = React.useState(null);
    
    let id = null
    const rightclick=(e)=>{
        e.preventDefault();
        setAnchorEl(e.currentTarget);
        id = e.currentTarget.id;
        console.log(id);
      }
      const handleClose=()=>{
        setAnchorEl(null)
      }
      const open = Boolean(anchorEl);
    return(
        <Grid item xs={3}>
                <Paper className={classes.paper} >
                  <h1>TreeView-Folders</h1>
                  <TreeView onContextMenu={rightclick}
                    
                    className={classes.root}
                    defaultCollapseIcon={<FolderOpenIcon />}
                    defaultExpandIcon={<FolderIcon />}
                    defaultEndIcon={<DescriptionIcon/>}
                  >
                        {props.data.map(function mapfolder(folder) {
                          if(Array.isArray(folder.files)){
                            return(
                              <div key={folder.created} style={{display: "flex", justifyContent: "space-between"}}>
                              <TreeItem id="12" nodeId={folder.created.toString()}  style={{textAlign:"left"}} label={folder.name}>
                                {folder.files.map(mapfolder)}
                              </TreeItem>
                              <MoreVertIcon id={folder.type} onClick={rightclick}/>
                              </div>
                                  )
                          }else{
                            return(
                              <div key={folder.created} style={{display: "flex", justifyContent: "space-between"}}>
                              <TreeItem className={folder.type} nodeId={folder.created.toString()} style={{textAlign:"left"}} label={folder.name}/>
                              <MoreVertIcon id={folder.type} onClick={rightclick} />
                              </div>
                              )
                          }
                        }
                        )}
                  
                  </TreeView>
                  <Popover
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    id={id}
                  >
                    {}
                </Popover>
                </Paper>
              </Grid>
      )
}