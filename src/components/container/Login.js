import React from 'react';
import Button from '../component/Button/Button';
class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="login-container">
                <Button value="测试"/>
            </div>
        );
    }
}

export default Login;