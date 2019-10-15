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
    const [actionSub, setActionSub] = React.useState(null);
    const [actionType, setActionType] = React.useState(null);
    const [itemName, setItemName] = React.useState(null);
    const [pathItem, setItemPath] = React.useState(null);

    const openDialog=(e)=>{
      setSubDialog(true)
      setActionSub(e.target.getAttribute("name"))
      setActionType(e.target.id)
      if(e.target.id === "add"){
        setItemName("")
      }
    } 

    const closeDialog =()=>{
      setSubDialog(false)
      setAnchorEl(null)
    }

    const optionmenu=(e)=>{
        e.preventDefault();
        setAnchorEl(e.currentTarget);
        setTypeFolder(e.currentTarget.id)
        setItemPath(e.currentTarget.getAttribute("path"))
        setItemName(e.currentTarget.getAttribute("name"))

      }
    const handleClose=()=>{
        setAnchorEl(null)
      }

    const submitItem = (valueitem, i=1) =>{
      setSubDialog(false)
      setAnchorEl(null)
      const linkarr = pathItem.split("/") 
      var path = "/" + linkarr[i]
      var data2 = props.data
  
      function subfunc(target){
        if(actionType === "delete"){
          if(linkarr.length<=2){
            data2 = data2.filter((exa)=>{ return exa.path !== target.path})
          }else{
          if(i<linkarr.length-2){
            i = i + 1
            path = path + "/" + linkarr[i]
            target = target.files.find((exa)=>{ return exa.path === path})
            subfunc(target)
          }else{
            target.files = target.files.filter((exa)=>{ return exa.path !== pathItem})
          }}
        }else{
        if(linkarr.length<2){
          props.submit(data2.push(valueitem))
        }
        else{
        if(i<linkarr.length-1){
          i = i + 1
          path = path + "/" + linkarr[i]
          target = target.files.find((exa)=>{ return exa.path === path})
          console.log(target)
          subfunc(target)
        }else{
          switch(actionType){
          case "add": target.files.push(valueitem);break
          case "rename": target.name = valueitem.name;break
          default: console.log("choose nothing")
          }
        }
      } }
      }
      subfunc(data2.find((dataeach)=>{ return dataeach.path === path }))
      props.submit(data2)
    }

      const open = Boolean(anchorEl);
    return(
        <Grid item xs={3} onContextMenu={optionmenu}>
              <Paper className={classes.paper} >
                    <h2 style={{display: "flex", justifyContent: "space-between"}}>TreeView-Folders 
                    <MoreVertIcon path={""} onClick={optionmenu}/></h2>
                    
                  <TreeView
                    
                    className={classes.root}
                    defaultCollapseIcon={<FolderOpenIcon />}
                    defaultExpandIcon={<FolderIcon />}
                    defaultEndIcon={<DescriptionIcon/>}
                  >
                        {props.data.map(function mapfolder(folder) {
                          if(folder.type === "folder"){
                            return(
                              <div key={folder.created} style={{display: "flex", justifyContent: "space-between"}}>
                              <TreeItem nodeId={folder.created.toString()} style={{textAlign:"left"}} label={folder.name}>
                                {folder.files.map(mapfolder)}
                              </TreeItem>
                              <MoreVertIcon path={folder.path} id={folder.type} name={folder.name} onClick={optionmenu}/>
                              </div>
                              )
                          }else{
                            return(
                              <div key={folder.created} style={{display: "flex", justifyContent: "space-between"}}>
                              <TreeItem className={folder.type} nodeId={folder.created.toString()} style={{textAlign:"left"}} label={folder.name}/>
                              <MoreVertIcon path={folder.path} id={folder.type} name={folder.name} onClick={optionmenu} />
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
                    { (typeFolder) ?
                      (typeFolder ==="folder") ?
                        <MenuList>
                          <MenuItem onClick={openDialog} name="folder" id="add" >Add Folder</MenuItem>
                          <MenuItem onClick={openDialog} name="file" id="add">Add File</MenuItem>
                          <MenuItem onClick={openDialog} name="folder" id="rename">Rename Folder</MenuItem>
                          <MenuItem onClick={openDialog} name="folder" id="delete">Delete Folder</MenuItem>
                        </MenuList>
                      : <MenuList>
                          <MenuItem onClick={openDialog} name="file" id="rename">Rename file</MenuItem>
                          <MenuItem onClick={openDialog} name="file" id="delete">Delete File</MenuItem>
                        </MenuList>
                      : <MenuList>
                          <MenuItem onClick={openDialog} name="folder" id="add" >Add Folder</MenuItem>
                          <MenuItem onClick={openDialog} name="file" id="add">Add File</MenuItem>
                        </MenuList>
                    }
                </Popover>
                <DialogFunc submitItem={submitItem} pathItem={pathItem} setItemName={(e)=>{setItemName(e.target.value)}} itemName={itemName} actionType={actionType} actionSub={actionSub} subDialog={subDialog} closeDialog={closeDialog}/>
              </Paper>
            </Grid>
      )
}