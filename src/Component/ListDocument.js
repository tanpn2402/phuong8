import React from 'react';
import { withStyles } from '@material-ui/styles';
import ReactTable from "react-table";
import "react-table/react-table.css";
import matchSorter from 'match-sorter'
import { Grid } from '@material-ui/core';
import IconFolder from '@material-ui/icons/Folder';

const URL = window.apiURL || 'http://127.0.0.1:33003';

class ListDocument extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    onOpenFile = e => {
        console.log(e);
        this.props.onOpenFile({
            fileId: e.id,
            filePath: e.source
        })
    }


    render() {
        const { data } = this.state;
        const { classes } = this.props;

        return <ReactTable
            key={data.length}
            data={data}
            filterable
            defaultFilterMethod={(filter, row) =>
                String(row[filter.id]) === filter.value}
            columns={[
                {
                    Header: "Tên file",
                    accessor: "fileName",
                    filterMethod: (filter, row) => {
                        let searchValue = xoa_dau(filter.value).toLowerCase();
                        let name = xoa_dau(row.fileName || '').toLowerCase();

                        if (name.indexOf(searchValue) > -1) {
                            return true;
                        }
                        return false;
                    },
                    Cell: p => {
                        return <div>
                            <div className={classes.fileName} onClick={() => this.onOpenFile(p.original)}>
                                {p.original.fileName}
                            </div>
                            <Grid container wrap='nowrap'>
                                <Grid item>
                                    <IconFolder className={classes.folderIcon} />
                                </Grid>
                                &nbsp;
                                <Grid item><small>{p.original.actualPath}</small></Grid>
                            </Grid>
                        </div>
                    }
                },
                {
                    Header: "Tuổi",
                    accessor: 'path',
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
                        let age = '---';
                        try {
                            let d = JSON.parse(p.original.data);
                            age = new Date().getFullYear() - d.birthyear;

                            if (isNaN(age)) {
                                age = '---'
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
            defaultPageSize={data.length}
            className="-striped -highlight"
            showPagination={false}
        />
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
                    this.setState({ data: e.data })
                }
            })
    }
}


const styles = theme => ({
    folderIcon: {
        fontSize: '1em'
    },
    fileName: {
        '&:hover': {
            transition: 'all 0.12s ease',
            color: '#3f51b5',
            cursor: 'pointer'
        }
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
