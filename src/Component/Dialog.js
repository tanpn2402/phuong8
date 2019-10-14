import React from 'react';
import { TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from '@material-ui/core';


export default function DialogFunc(props){
    const actionSub = props.actionSub
    const actionType = props.actionType
    const itemName = props.itemName
    const subDialog = props.subDialog
    const pathItem = props.pathItem

    const submitF = () =>{
        var date = new Date()
        let valueitem = {
                name: itemName,
                type: actionSub,
                path: pathItem + "/" + itemName.replace(" ", ""),
                created: date.getHours()+"h"+date.getMinutes()+"m"+date.getSeconds()+"s "+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear(), 
                files: []
            }
        props.submitItem(valueitem)
    }
    

    if(actionType === "delete"){
        return(
            <Dialog open={subDialog} onClose={props.closeDialog}>
                {(actionSub === "folder") ? <DialogTitle>Do You Really Want To Delete This Folder ?</DialogTitle> 
                : <DialogTitle>Do You Really Want To Delete This File ?</DialogTitle>}
                <DialogContentText style={{textAlign: "center"}}>If you do, please confirm </DialogContentText>
                <DialogActions>
                    <Button onClick={props.closeDialog} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={props.closeDialog} color="primary">
                      Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
    else{
    return(
        <Dialog open={subDialog} onClose={props.closeDialog} >
                  {(actionSub === "folder") ? <DialogTitle>Folder</DialogTitle> : <DialogTitle>File</DialogTitle>}
                  <DialogContent>
                    {(actionType === "add") 
                    ? <TextField
                      autoFocus
                      margin="dense"
                      id={"new"+actionSub}
                      label={"New "+actionSub}
                      type="text"
                      fullWidth
                      value = {itemName}
                      onChange = {props.setItemName}
                    />
                    : <TextField
                    autoFocus
                    margin="dense"
                    id={"rename"+actionSub}
                    label={"Rename "+actionSub}
                    type="text"
                    fullWidth
                    value = {itemName}
                    onChange = {props.setItemName}
                        />
                    }
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={props.closeDialog} color="secondary">
                      Cancel
                    </Button>
                    <Button onClick={submitF} color="primary">
                      Confirm
                    </Button>
                  </DialogActions>
                </Dialog>
    )
                }
}