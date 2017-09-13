import React from 'react';
import Button from '../component/Button/Button';
import Input from '../component/Input/Input';
const logo = require("../../images/logo.png");
class Login extends React.Component {
    constructor(props) {
        super(props);

        this.changeValue = this.changeValue.bind(this);
    }

    changeValue (value) {
    }

    render() {
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
                                    <Input placeholder="请输入登录账号" onChange ={this.changeValue} value="" type="text"/>
                                </div>
                                <div className="body-form">
                                    <p>密码</p>
                                     <Input placeholder="请输入登录密码" value="" type="password"/>
                                </div>
                                <div className="body-form">
                                    <p className="tip">忘记密码</p>
                                    <Button value="马上登录" styleName="btn-square"/>
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
