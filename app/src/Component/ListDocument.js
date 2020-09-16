import React from 'react';
import { withStyles } from '@material-ui/styles';
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter'
import { Grid, IconButton, Tooltip, Menu, MenuItem, Button, Select } from '@material-ui/core';
import IconFolder from '@material-ui/icons/Folder';
import IconAdd from '@material-ui/icons/Add';
import IconRemove from '@material-ui/icons/Remove';
import IconAttachment from '@material-ui/icons/Attachment';
import constant from '../constants';
const URL = constant.API_URL;

let initState = {
    data: [],
    filters: [],
    anchorEl: null,
    filteredData: []
}

class ListDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = initState;
    }

    componentWillUnmount() {
        initState = this.state;
    }

    handleOpenMenuFilter = event => {
        this.setState({ anchorEl: event.target });
    };

    handleCloseMenuFilter = (event, filterId, filterName) => {
        this.setState({
            anchorEl: null,
            filters: this.state.filters.concat(filterId ? [{
                id: filterId + '-' + (this.state.filters.filter(e => e.filterId === filterId).length + 1),
                filterId,
                filterName,
                value: ''
            }] : [])
        });
    };

    onOpenFile = e => {
        this.props.onOpenFile({
            fileId: e.id,
            filePath: e.source
        })
    }

    handleRemoveFilter = e => {
        this.setState({
            filters: this.state.filters.filter(el => el.id !== e.id)
        }, () => {
            this.handleFilter();
        });
    }

    handleFilter = () => {
        let { data, filters } = this.state;

        filters = filters.map(e => {
            if (e.filterId === 'fileType') {
                return e
            }
            return {
                ...e,
                value: document.getElementById(e.id).value || ''
            }
        })

        let d = data.filter(e => {
            let rlt = undefined;
            let fileData = {};
            try {
                fileData = JSON.parse(e.data);
                filters.forEach(condition => {

                    if (rlt === false) {
                        return;
                    }

                    rlt = false;
                    if (condition.filterId === 'name') {
                        // hotenkhaisinh
                        // birthname
                        // fullname
                        if (xoa_dau((fileData.birthname || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1 ||
                            xoa_dau((fileData.hotenkhaisinh || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1 ||
                            xoa_dau((fileData.fullname || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1) {
                            rlt = true;
                        }
                    }
                    else if (condition.filterId === 'sex') {
                        // gender
                        if (xoa_dau((fileData.gender || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1) {
                            rlt = true;
                        }
                    }
                    else if (condition.filterId === 'address') {
                        // permanentaddress
                        // hokhauthuongtru_1
                        // hokhauthuongtru_2
                        // noicutruhienngay_1
                        // noicutruhienngay_2
                        if (xoa_dau((fileData.permanentaddress || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1 ||
                            xoa_dau((fileData.hokhauthuongtru_1 || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1 ||
                            xoa_dau((fileData.hokhauthuongtru_2 || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1 ||
                            xoa_dau((fileData.noicutruhienngay_1 || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1 ||
                            xoa_dau((fileData.noicutruhienngay_2 || '')).toLowerCase().indexOf(xoa_dau(condition.value).toLowerCase()) > -1) {
                            rlt = true;
                        }
                    }
                    else if (condition.filterId === 'birthyear') {
                        // birthyear
                        let birthyear = parseInt(fileData.birthyear);
                        let searchValue = xoa_dau(condition.value).toLowerCase();

                        if (isNaN(birthyear)) {
                            birthyear = 0;
                        }

                        if (searchValue.indexOf('>') > -1) {
                            let number = parseInt(searchValue.replace('>', ''));
                            if (!isNaN(number) && number !== '' && birthyear > number) {
                                rlt = true;
                            }
                        }
                        else if (searchValue.indexOf('<') > -1) {
                            let number = parseInt(searchValue.replace('<', ''));
                            if (!isNaN(number) && number !== '' && birthyear < number) {
                                rlt = true;
                            }
                        }
                        else {
                            // normal
                            let number = parseInt(searchValue.replace('=', ''));
                            if (!isNaN(number) && number !== '' && birthyear == number) {
                                rlt = true;
                            }
                        }
                    }
                    else if (condition.filterId === 'fileType') {
                        if (e.source === condition.value.path) {
                            rlt = true;
                        }
                        else {
                            rlt = false;
                        }
                    }
                })


            } catch (e) {

            }

            return (rlt === true || rlt === undefined) ? true : false;
        })

        this.setState({
            filteredData: [].concat(d),
            filters: [].concat(filters)
        })
    }


    handleFilterByFileType = (f, event) => {
        // console.log(e);
        let { filters } = this.state;
        let t = filters.filter(e => e.id === f.id)[0];

        if (t) {
            t.value = event.target.value;
            this.setState({
                filters
            })
        }
    }

    render() {
        const { filteredData, anchorEl, filters } = this.state;
        const { classes, fileTemplate } = this.props;

        return <>
            <div>
                <Grid container alignItems='center'>
                    Bộ lọc
                    <Grid item>
                        <Tooltip title='Thêm điều kiện lọc'>
                            <IconButton size='small' onClick={e => this.handleOpenMenuFilter(e)}>
                                <IconAdd fontSize='small' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={e => this.handleCloseMenuFilter(e)}
                        >
                            <MenuItem onClick={e => this.handleCloseMenuFilter(e, 'name', 'Họ tên')}>Họ tên khai sinh</MenuItem>
                            <MenuItem onClick={e => this.handleCloseMenuFilter(e, 'birthyear', 'Năm sinh')}>Năm sinh</MenuItem>
                            <MenuItem onClick={e => this.handleCloseMenuFilter(e, 'address', 'Địa chỉ')}>Địa chỉ thường trú của gia đình</MenuItem>
                            <MenuItem onClick={e => this.handleCloseMenuFilter(e, 'sex', 'Giới tính')}>Giới tính</MenuItem>
                            <MenuItem onClick={e => this.handleCloseMenuFilter(e, 'fileType', 'Loại văn bản')}>Loại văn bản</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>

                {filters.map(e => {
                    if (e.filterId === 'fileType') {
                        return <Grid container alignItems='center' style={{ marginBottom: 10 }}>
                            <Grid item style={{ paddingLeft: 10 }}>
                                <Tooltip title='Xoá điều kiện lọc'>
                                    <IconButton size='small' onClick={() => this.handleRemoveFilter(e)}>
                                        <IconRemove fontSize='small' />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                            <Grid item style={{ minWidth: 100, textAlign: 'left', paddingLeft: 10 }}>{e.filterName}</Grid>
                            <Grid item xs>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={e.value}
                                    onChange={evt => this.handleFilterByFileType(e, evt)}
                                >
                                    {fileTemplate.map(type => <MenuItem value={type}>{type.name}</MenuItem>)}
                                </Select>
                            </Grid>
                        </Grid>
                    }

                    return <Grid container alignItems='center' style={{ marginBottom: 10 }}>
                        <Grid item style={{ paddingLeft: 10 }}>
                            <Tooltip title='Xoá điều kiện lọc'>
                                <IconButton size='small' onClick={() => this.handleRemoveFilter(e)}>
                                    <IconRemove fontSize='small' />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                        <Grid item style={{ minWidth: 100, textAlign: 'left', paddingLeft: 10 }}>{e.filterName}</Grid>
                        <Grid item xs>
                            <input className={classes.filterInput} id={e.id}
                                defaultValue={e.value}
                            />
                        </Grid>
                    </Grid>
                })}

                {filters.length > 0 && <Grid style={{ marginBottom: 15 }}>
                    <Button variant='contained' fullWidth onClick={() => this.handleFilter()}>
                        Lọc
                    </Button>
                </Grid>}
            </div>
            <ReactTable
                key={filteredData.length}
                data={filteredData}
                defaultFilterMethod={(filter, row) =>
                    String(row[filter.id]) === filter.value}
                columns={[
                    {
                        Header: "File",
                        accessor: "fileName",
                        minWidth: 100,
                        filterMethod: (filter, row) => {
                            let searchValue = xoa_dau(filter.value).toLowerCase();
                            let name = xoa_dau(row.fileName || '').toLowerCase();

                            if (name.indexOf(searchValue) > -1) {
                                return true;
                            }
                            return false;
                        },
                        Cell: p => {
                            let fileType = fileTemplate.filter(e => e.path === p.original.source)[0];

                            return <div>
                                <div className={classes.fileName} onClick={() => this.onOpenFile(p.original)}>
                                    <strong>{p.original.fileName}</strong>
                                </div>
                                <Grid container wrap='nowrap'>
                                    <Grid item>
                                        <IconFolder className={classes.folderIcon} />
                                    </Grid>
                                    &nbsp;
                                    <Grid item><small>{p.original.actualPath}</small></Grid>
                                </Grid>
                                <Grid container wrap='nowrap'>
                                    <Grid item>
                                        <IconAttachment className={classes.folderIcon} />
                                    </Grid>
                                    &nbsp;
                                    <Grid item>
                                        {fileType ? <small>{fileType.name}</small> : <small>Không xác định</small>}
                                    </Grid>
                                </Grid>
                            </div>
                        }
                    },
                    {
                        Header: "Ngày sinh",
                        accessor: 'path',
                        minWidth: 40,
                        filterMethod: (filter, row) => {
                            let searchValue = xoa_dau(filter.value).toLowerCase();

                            try {
                                let age = 0;
                                let d = JSON.parse(row._original.data);
                                age = new Date().getFullYear() - d.birthyear;

                                if (isNaN(age)) {
                                    age = 0;
                                }

                                if (searchValue.indexOf('>') > -1) {
                                    let number = parseInt(searchValue.replace('>', ''));
                                    if (!isNaN(number) && number !== '' && age > number) {
                                        return true;
                                    }
                                }

                                if (searchValue.indexOf('<') > -1) {
                                    let number = parseInt(searchValue.replace('<', ''));
                                    if (!isNaN(number) && number !== '' && age < number) {
                                        return true;
                                    }
                                }


                                // normal
                                let number = parseInt(searchValue);
                                if (!isNaN(number) && number !== '' && age == number) {
                                    return true;
                                }

                            }
                            catch (e) {

                            }

                            return false;

                        },
                        Cell: p => {
                            let age = '';
                            try {
                                let d = JSON.parse(p.original.data);
                                if (d.birthyear) {
                                    if (d.birthday !== '') {
                                        age += d.birthday + '-';
                                    }
                                    else {
                                        age += 'DD' + '-';
                                    }

                                    if (d.birthmonth !== '') {
                                        age += d.birthmonth + '-';
                                    }
                                    else {
                                        age += 'MM' + '-';
                                    }

                                    if (d.birthyear !== '') {
                                        age += d.birthyear;
                                    }
                                    else {
                                        age += '__';
                                    }
                                }
                            }
                            catch (e) {

                            }
                            finally {
                                return <div style={{ textAlign: 'right' }}>
                                    {age}
                                </div>
                            }
                        }
                    }
                ]}
                noDataText='Không có dữ liệu'
                filterable={false}
                defaultPageSize={filteredData.length}
                className="-striped -highlight"
                showPagination={false}
            />
        </>
    }

    componentDidMount() {
        fetch(URL + '/api/document/getall', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                data: {}
            })
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok === 1) {
                    this.setState({
                        data: [].concat(e.data),
                        filteredData: [].concat(e.data)
                    }, () => {
                        this.handleFilter();
                    })
                }
            })
    }
}


const styles = theme => ({
    folderIcon: {
        fontSize: '1em',
        position: 'relative',
        top: 4
    },
    fileName: {
        '&:hover': {
            transition: 'all 0.12s ease',
            color: '#3f51b5',
            cursor: 'pointer'
        }
    },
    filterInput: {
        padding: '6px 8px',
        borderRadius: 4,
        width: '100%',
        boxShadow: 'none',
        border: '1px solid #CCC'
    }
});

export default withStyles(styles)(ListDocument);

function xoa_dau(str) {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    return str;
}
