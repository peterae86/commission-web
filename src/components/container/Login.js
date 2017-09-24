import React from 'react';
import Button from '../component/Button/Button';
import Input from '../component/Input/Input';
import {hashHistory} from 'react-router';
const logo = require("../../images/logo.png");
import {requestByFetch} from '../../utils/request.js';
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userCode: "123",
            passwd: "Zy168168"
        };
        this.changeValue = this.changeValue.bind(this);
        this.changePasswd = this.changePasswd.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }

    changeValue (value) {
        this.setState({
            userCode: value,
        });
    }
    changePasswd (value) {
        this.setState({
            passwd: value,
        });
    }

    submitLogin () {
        const param = {
                userCode: this.state.userCode,
                passwd: this.state.passwd
        };
        const path = `/api/loginIn/submit`;
        requestByFetch(path, param).then((res) => {
            // hashHistory.push("/");
            window.localStorage.setItem("userCode",this.state.userCode);
            console.log("种userCode");
            const paths = `/api/userAuth/queryAllAuths?userCode=${this.state.userCode}`;
            requestByFetch(paths, 'GET').then((response) => {
                console.log(response.roleAuthMap); // 获取当前人所有角色
                window.localStorage.setItem("roleAuthMap",JSON.stringify(response.roleAuthMap));
            });

        });
    }

    render() {
        const {userCode, passwd} = this.state;
        return (
            <div className="login-container">
                <div className="login-title">
                    <img src={logo}/>
                </div>
                <div className="login-body">
                    <div className="login-panel-container">
                        <div className="login-panel">

                            <div className="panel-title">密码登录</div>
                            <div className="panel-body">
                                <div className="body-form">
                                    <p>账号</p>
                                    <Input placeholder="请输入登录账号" onChange ={this.changeValue} value={userCode} type="text"/>
                                </div>
                                <div className="body-form">
                                    <p>密码</p>
                                     <Input placeholder="请输入登录密码" onChange ={this.changePasswd} value={passwd} type="password"/>
                                </div>
                                <div className="body-form">
                                    <p className="tip">忘记密码</p>
                                    <Button value="马上登录" styleName="btn-square" onClick={this.submitLogin}/>
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Login;
