import React from 'react';
import View from './Component/View';
import Login from './Component/Login';
import constant from './constants';
const URL = constant.API_URL;

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            template: [],
            isLogged: false
        };
        this.pathdirect = this.pathdirect.bind(this)
    }

    pathdirect(changedata) {
        fetch(URL + '/api/folder/save', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                data: JSON.stringify(changedata)
            })
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok === 1) {
                    this.setState({ data: changedata })
                }
            })
    }

    componentDidMount() {
        // const electron = window.require('electron');
        // if (electron) {
        //     electron.ipcRenderer.send('load', {
        //         id: 1
        //     });

        //     electron.ipcRenderer.on('push', (event, data) => {
        //         console.log(data);
        //     })
        // }

        fetch(URL + '/api/folder/get', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({})
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok === 1 && e.data) {
                    this.setState({ data: e.data })
                }
            })

        fetch(URL + '/api/template/get', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({})
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok === 1 && e.data) {
                    this.setState({ template: e.data })
                }
            })
    }

    onLoginDone(e) {
        this.setState({
            isLogged: true
        })
    }

    render() {
        if (!this.state.isLogged) {
            return <Login onLoginDone={e => this.onLoginDone(e)} />
        }
        return (
            <View data={this.state.data} template={this.state.template} submit={this.pathdirect} />
        )
    }
}
export default App