/**
 * Created by zhen.liu1 on 17/6/8.
 */
import React, {PropTypes} from 'react';
import PubSub from '../PubSub';
import './index.scss';
import {formateNumber} from '../mathHelper';
let treeNodeClickHandler;

/**
 * @module MoneyInput
 * @desc 金额输入框 [必须搭配金额键盘使用] [获得金额请使用this.refs] [使用观察者模式] import { MoneyInput } from 'component';
 * @version 1.0.0
 * @author liuzhen
 */
class MoneyInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            values: '',
            value: '',
            formatValues: '',
            onFocus: false,
            hideCursor: true
        };
    }

    componentDidMount() {
        this.listener();
    }

    componentWillUnmount(){
        PubSub.off('showKeyboard');
        PubSub.off('addValue');
        PubSub.off('delValue');
        PubSub.off('confirmValues');
        treeNodeClickHandler = null;
    }

    listener = () => {
        let self = this;
        // 监听来自金额键盘主动弹出
        PubSub.on('showKeyboard', () => {
            self.setState({
                formatValues: this.state.values,
                hideCursor: false
            });
        });
        PubSub.on('addValue', (value) => {
            let dotLength = 2;
            let hasDot = false;

            // 只有一个.
            if (value == '.' && self.state.values.indexOf('.') >= 0) {
                hasDot = true;
            } else {
                hasDot = false;
            }

            // 小数点后两位
            if ((self.state.values + value).indexOf('.') >= 0) {
                dotLength = (self.state.values + value).split(".")[1].length;
            }

            if (self.state.values.length < self.props.maxLength && dotLength < 3 && !hasDot) {
                if (this.props.change) {
                    this.props.change(self.state.values + value);
                }
                self.setState({
                    values: self.state.values + value,
                    formatValues: self.state.values + value,
                    onFocus: true,
                    hideCursor: false
                });
            }
        });
        PubSub.on('delValue', () => {
            if (self.state.onFocus) {
                if (this.props.change) {
                    this.props.change(self.state.values.substring(0, self.state.values.length - 1));
                }
                self.setState({
                    values: self.state.values.substring(0, self.state.values.length - 1),
                    formatValues: self.state.values.substring(0, self.state.values.length - 1),
                    onFocus: true, //delete最后一位后隐藏光标
                    hideCursor: false
                });
            }
        });
        PubSub.on('confirmValues', () => {
            let value = self.state.values.length > 0 ? parseFloat(self.state.values).toString() : self.state.values;

            self.setState({
                values: value,
                formatValues: formateNumber(value),
                hideCursor: true
            });

            if (this.props.confirm) {
                this.props.confirm(self.state.values == '' ? '0' : self.state.values);
            }
        });
    }

    setValues = (values) => {
        let value = values;
        if (Object.prototype.toString.call(values) !== "[object String]") {
            value = values.toString();
        }

        this.setState({
            values: value,
            formatValues: formateNumber(value),
            onFocus: true
        });
    }

    onCk = () => {
        // 点击金额输入框唤起键盘
        PubSub.trigger('showKeyboardFromInput');
        this.setState({
            formatValues: this.state.values,
            hideCursor: false,
            onFocus: true
        });
    }

    // 暴露金额
    getMoney = () => {
        PubSub.trigger('hideKeyboardFromInput');
        this.setState({
            formatValues: formateNumber(this.state.values),
            hideCursor: true
        });

        return (this.state.values == '' ? !this.state.onFocus ? parseFloat(this.props.initValue) : '0' : this.state.values);
    }

    render() {
        const {message, styleName, containerStyle, cursorStyle, messageStyle, valueStyle, initValueStyle, initValue} = this.props;
        let content;
        if (this.state.onFocus) {
            content = (
                <div>
                    <span className="money-input-value" style={{...valueStyle}}>{this.state.formatValues != this.state.values ? formateNumber(this.state.values) : this.state.formatValues}</span>
                    {
                        this.state.hideCursor ? <span className="money-input-cursor-hidden" /> : <span className="money-input-cursor" style={{...cursorStyle}} />
                    }
                </div>
            )
        } else {
            content = (
                <div>
                    {
                        this.state.hideCursor ? <span className="money-input-cursor-hidden" /> : <span className="money-input-cursor" style={{...cursorStyle}} />
                    }
                    <span className="money-input-init" style={{...initValueStyle}}>{initValue}</span>
                </div>
            )
        }

        return (
            <div className={`money-input-container ${styleName}`} style={{...containerStyle}}>
                <div className="money-input" onClick={this.onCk}>
                    {content}
                    <p className="money-input-text" style={{...messageStyle}}>{message}</p>
                </div>
            </div>
        );
    }
}

/**
 * @var {object} propTypes
 * @memberOf module:MoneyInput
 * @prop {string} maxLength input长度限制
 * @prop {string} message input下方需要展示的字
 * @prop {string} styleName input样式
 * @prop {string} initValue 初始化值
 * @prop {object} containerStyle input最外围div样式,可改变背景颜色
 * @prop {object} cursorStyle 光标样式,可改变背景颜色
 * @prop {object} messageStyle input下方需要展示的字样式
 * @prop {object} initValueStyle 初始化值样式
 * @prop {object} valueStyle value样式
 * @example
 <MoneyInput message="追加投资金额（元）" ref="moneyInput"/>
 获取金额:this.refs.moneyInput.getMoney()
 */


MoneyInput.propTypes = {
    maxLength: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
    ]),
    message: React.PropTypes.string,
    styleName: React.PropTypes.string,
    containerStyle: React.PropTypes.object,
    cursorStyle: React.PropTypes.object,
    messageStyle: React.PropTypes.object,
    valueStyle: React.PropTypes.object,
    initValueStyle: React.PropTypes.object,
    initValue: React.PropTypes.string,
    confirm: PropTypes.func, //相当于blur,获取金额
    change: PropTypes.func //相当于onChange,获取金额
};

/**
 * @var {object} defaultProps
 * @memberOf module:MoneyInput
 * @desc 参数
 * @property maxLength: 8
 * @property message: '',
 * @property initValue: '0.00'其余全为空,默认微信样式

 */
MoneyInput.defaultProps = {
    maxLength: 12,
    message: '',
    styleName: '',
    containerStyle: {},
    cursorStyle: {},
    messageStyle: {},
    valueStyle: {},
    initValueStyle: {},
    initValue: '0.00'
};

export default MoneyInput;
