/**
 * Created by nino on 17/5/26.
 */
import React, {PropTypes} from 'react';
import Tappable from '../Tappable/Tappable';
import './index.scss';
const ModalAlert = require('../../lib/ModalAlert.js').default;
const loading = require("base64-image!./loading.gif");
const loading_success = require("base64-image!./password_success.png");

const keySet = [
    [
        {num: 1, key: ''},
        {num: 2, key: 'ABC'},
        {num: 3, key: 'DEF'}
    ],
    [
        {num: 4, key: 'GHI'},
        {num: 5, key: 'JKL'},
        {num: 6, key: 'MNO'}
    ],
    [
        {num: 7, key: 'PQRS'},
        {num: 8, key: 'TUV'},
        {num: 9, key: 'WXYZ'}
    ]
];

/**
 * @module PasswordKeyboard
 * @desc 支付密码键盘 import { PasswordKeyboard } from 'PasswordKeyboard';
 * @version 1.0.0
 * @author liuzhen
 */
class PasswordKeyboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showKeyboard: false,
            keyboardLoading: false,
            keyValues: [],
            showModalAlert: false,
            mess: "",
            cancelCallback: () => {},
            cancelMess: "",
            locked: false,
            imgUrl: loading,
            modalProps: {}
        };
    }

    // 触摸键盘 改变bg values
    tap = (e) => {
        let self = this;
        let keyValues = self.state.keyValues;
        if (e.currentTarget.getAttribute('data-value') == 'del') {
            //e.currentTarget.style.background = '#fff';
            keyValues.pop();
            self.setState({
                keyValues: keyValues
            })
        } else {
            //e.currentTarget.style.background = '#D1D5DB';
            if (keyValues.length < 6) {
                keyValues.push(e.currentTarget.getAttribute('data-value'));
                self.setState({
                    keyValues: keyValues
                });
            }

            if (keyValues.length == 6) {
                // 传输密码 loading
                self.setState({
                    keyboardLoading: true,
                    locked: true
                });
                setTimeout(() => {
                    if (self.props.complete) {
                        self.props.complete();
                    } else {
                        self.hideKeyboard();
                        alert('complete is undefined!!!');
                    }
                }, 100);
            }
        }
    }

    // 输出password
    getPassword = () => {
        let password = this.state.keyValues.join("");
        return password;
    }

    showKeyboard = () => {
        this.setState({
            showKeyboard: true
        });
    }

    hideKeyboard = () => {
        this.setState({
            showKeyboard: false,
            keyValues: [],
            keyboardLoading: false,
            showModalAlert: false,
            locked: false
        });
    }

    forgetPassword = () => {
        if (!this.state.locked && this.props.forgetPasswordFunc) {
            this.props.forgetPasswordFunc();
        }
    }

    // 变成功状态  隐藏键盘  执行自定义事件
    succeed = () => {
        let self = this;
        self.setState({
            imgUrl: loading_success
        });
        return new Promise(function(resolve) {
            setTimeout(() => {
                self.hideKeyboard();
                resolve(true);
            }, 2000);
        })
    }

    // 重新输入
    resetKeyboard = () => {
        this.setState({
            keyValues: [],
            showModalAlert: false,
            keyboardLoading: false,
            locked: false
        });
    }

    requestFailure = (type = 0, mess = '') => {
        //重新输入
        if (type == 0) {
            this.setState({
                modalProps: {
                    type: 'confirm',
                    message: mess,
                    hasCloseIcon: false,
                    onCancel: () => { this.resetKeyboard() },
                    cancel: "重新输入",
                    locked: false,
                    confirm: "取消",
                    onConfirm: () => { this.hideKeyboard(); }
                },
                showModalAlert: true
            });
        } else {
            this.setState({
                modalProps: {
                    type: 'alert',
                    message: mess,
                    hasCloseIcon: false,
                    onCancel: () => { this.hideKeyboard() },
                    confirm: "取消",
                    locked: false
                },
                showModalAlert: true
            })
        }
    }

    render() {
        let { keyValues, modalProps, imgUrl} = this.state;
        let content;
        const modal = {show: this.state.showModalAlert, ...modalProps};
        const trade = (
            <div>
                <div className="trade-frames">
                    <div className="trade-frame"></div>
                    <div className="trade-frame"></div>
                    <div className="trade-frame"></div>
                    <div className="trade-frame"></div>
                    <div className="trade-frame"></div>
                    <div className="trade-frame"></div>
                </div>
                <div className="trade-values">
                    {
                        keyValues.map((item, index) => {
                            return (
                                <div className="trade-value" key={index*10}>
                                    <div className="trade-icon"></div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        );
        if (!this.state.keyboardLoading) {
            content = (
                <div className="tradePass-container">
                    {trade}
                    <div className="pass-keyboard-items">
                        {
                            keySet.map((item, index) => {
                                return (
                                    <div className="pass-keyboard-row" key={index*11}>
                                        {
                                            item.map((ritem, rindex) => {
                                                return (
                                                    <Tappable component="div" className="pass-keyboard-item" data-value={ritem.num} key={ritem.key} onTap={this.tap}>
                                                        <p className="pass-keyboard-text pass-keyboard-num">{ritem.num}</p>
                                                        <p className="pass-keyboard-text pass-keyboard-key">{ritem.key}</p>
                                                    </Tappable>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        <div className="pass-keyboard-row">
                            <Tappable component="div" className="pass-keyboard-item pass-keyboard-empty" />
                            <Tappable component="div" className="pass-keyboard-item"data-value="0" onTap={this.tap}>
                                <p className="pass-keyboard-text pass-keyboard-num pass-keyboard-zero">0</p>
                            </Tappable>
                            <Tappable component="div" classBase="del" className="pass-keyboard-item pass-keyboard-empty" data-value="del" onTap={this.tap}>
                                <i className="pass-keyboard-delete iconfont" style={{ fontSize: '.6rem'}}>&#xe02d;</i>
                            </Tappable>
                        </div>
                    </div>
                </div>
            );
        } else {
            content = (
                <div className="tradePass-container">
                    {trade}
                    <div className="pass-keyboard-loading">
                        <img className="pass-keyboard-loadingImg" src={imgUrl} />
                    </div>
                </div>
            )
        }

        return (
            <div className="pass-keyboard" style={{display: this.state.showKeyboard ? "" : "none"}}>
                <div className="pass-keyboard-mask"></div>
                <div className="pass-keyboard-container">
                    <div className="pass-keyboard-header">
                        <span className="pass-keyboard-label" onClick={!this.state.locked ? this.hideKeyboard : ''}>取消</span>
                        <span className="pass-keyboard-label pass-keyboard-title">输入交易密码</span>
                        <span className="pass-keyboard-label" onClick={this.forgetPassword}></span>
                    </div>

                    <div className="pass-keyboard-content">
                        {content}
                    </div>
                </div>
                <ModalAlert  {...modal} />
            </div>
        );
    }
}
/**
 * @var {object} propTypes
 * @prop {string} showKeyboard 是否显示键盘
 * @prop {object} complete 输入密码后事件{必须}
 * @prop {object} forgetPasswordFunc 忘记密码事件{必须}
 * @example
     <PasswordKeyboard ref="getPasswordKeyboard" complete={this.submit} />
     显示键盘: self.refs.getPasswordKeyboard.showKeyboard();
     获得密码: self.refs.getPasswordKeyboard.getPassword();
     请求成功后: self.refs.getPasswordKeyboard.succeed().then((res) => {
              console.log('bbb', res)
            });
     请求失败会弹出ModalAlert: self.refs.getPasswordKeyboard.requestFailure(type, mess); type:0->重新输入,忘记密码 1->取消,忘记密码 mess: 错误信息
     关闭键盘: self.refs.getPasswordKeyboard.hideKeyboard();
 */
PasswordKeyboard.propTypes = {
    complete: PropTypes.func,
    forgetPasswordFunc: PropTypes.func
};

PasswordKeyboard.defaultProps = {
};

export default PasswordKeyboard;
