import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { isArray } from 'util';

const URL = window.apiURL || 'http://127.0.0.1:33003';

function replaceAll(src, search, replacement) {
    var target = src;
    return target.replace(new RegExp(search, 'g'), replacement);
};

const getUrlParam = () => {
    let searchParams = window.location.search;
    let p = searchParams.split('?');
    let params = {};
    p.map(e => {
        if (e) {
            params[e.split('=')[0]] = e.split('=')[1];
        }
    })

    return params;
}

class App extends React.Component {
    state = {
        zoom: 100
    }

    onPrint() {
        this.refs.container.style.opacity = '0';
        window.print();
        this.refs.container.style.opacity = '1';
    }

    onSave() {
        const searchParams = getUrlParam();

        let data = {};
        if (window.payload && isArray(window.payload)) {
            window.payload.map(e => {
                data[e] = (document.getElementById(e).value || '').replace(new RegExp('\n'), '|N|')
            })
        }

        let str = JSON.stringify(data) + "";

        fetch(URL + '/api/document/save', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                id: searchParams.id,
                data: str,
                photo: document.getElementById("image").src || ""
            })
        })
            .then(e => e.json())
            .then(e => {
                if (e.ok === 1) {
                    alert("Lưu thành công");
                }
                else {
                    alert("Lưu thất bại, vui lòng thử lại");
                }
            })
    }

    componentDidMount() {
        const searchParams = getUrlParam();

        fetch(URL + '/api/document/get', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify({
                id: searchParams.id
            })
        })
            .then(e => e.json())
            .then(e => {
                let data = e.data;
                if (data) {
                    Object.keys(data).map(key => {
                        try {
                            let d = (data[key] || '').replace(new RegExp('\\|N\\|'), '\n');
                            console.log(d)
                            document.getElementById(key).value = d
                        } catch (err) { }
                    })
                }

                if (e.photo) {
                    document.getElementById("image").src = e.photo;
                }
            })
    }

    onfileChange(e) {
        let file = e.target.files[0]

        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                let base64 = e.target.result;
                document.getElementById("image").src = base64;
            }

            reader.readAsDataURL(file);
        }
    }

    onZoomIn() {
        this.setState({
            zoom: this.state.zoom + 20
        }, () => {
            document.getElementById("page-container").style.zoom = this.state.zoom + '%';
        })
    }

    onZoomOut() {
        this.setState({
            zoom: this.state.zoom - 20
        }, () => {
            document.getElementById("page-container").style.zoom = this.state.zoom + '%';
        })
    }

    render() {
        return <div className='xxx__container' ref='container'>
            <input type='file' onChange={e => this.onfileChange(e)} id="file" className='custom-file-input' />
            <div style={{ flex: 1 }}></div>
            <button className='xxx-button' onClick={() => this.onZoomIn()}>Phóng to</button>
            <button className='xxx-button' onClick={() => this.onZoomOut()}>Thu nhỏ</button>
            <button className='xxx-button' onClick={() => this.onSave()}>Lưu</button>
            <button className='xxx-button' onClick={() => this.onPrint()}>In</button>
        </div>
    }
}

ReactDOM.render(<App />, document.getElementById('fucking'));