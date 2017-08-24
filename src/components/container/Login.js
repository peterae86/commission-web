import React from 'react';
import Button from '../component/Button/Button';
const logo = require("../../images/logo.png");
class Login extends React.Component {
    constructor(props) {
        super(props);
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
                            <Button value="登录" styleName="btn-middle"/>
                        </div>
                    </div>
                </div>
               
            </div>
        );
    }
}

export default Login;