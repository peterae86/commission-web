/**
 * Created by zhen.liu1 on 17/6/8.
 */
import React, {PropTypes} from 'react';
import Tappable from '../Tappable/Tappable';
import './index.scss';
import PubSub from '../PubSub';
let treeNodeClickHandler;

/**
 * @module MoneyKeyboard
 * @desc 金额键盘 [必须搭配金额输入框使用] [唤起方式] [使用观察者模式] import { MoneyKeyboard } from 'MoneyKeyboard';
 * @version 1.0.0
 * @author liuzhen
 */
class MoneyKeyboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showKeyboard: props.showKeyboard,
            keyboardLoading: false,
            keyValues: []
        };
    }

    componentDidMount() {
        this.setStatus(this.props.showKeyboard);
        this.showKeyboard();
    }

    componentWillReceiveProps(nextProps) {
        this.setStatus(nextProps.showKeyboard);
    }

    componentWillUnmount(){
        PubSub.off('showKeyboardFromInput');
        PubSub.off('hideKeyboardFromInput');
        treeNodeClickHandler = null;
    }

    setStatus = (status) => {
        // 自定义点击唤起键盘
        if (status) {
            PubSub.trigger('showKeyboard');
            this.setState({
                showKeyboard: true
            });
        }
    }

    tap = (e) => {
        let self = this;
        let keyValues = self.state.keyValues;

        if (e.currentTarget.getAttribute('data-value') == 'del') {
            PubSub.trigger('delValue');
            keyValues.pop();
            self.setState({
                keyValues: keyValues
            })
        } else {
            PubSub.trigger('addValue', e.currentTarget.getAttribute('data-value'));
            keyValues.push(e.currentTarget.getAttribute('data-value'));
            self.setState({
                keyValues: keyValues
            });
        }
    }

    // MoneyInput唤起键盘
    showKeyboard = () => {
        PubSub.on('showKeyboardFromInput', () => {
            this.setState({
                showKeyboard: true
            });
        });
        PubSub.on('hideKeyboardFromInput', () => {
            this.setState({
                showKeyboard: false,
                keyValues: []
            });
        });
    }

    hideKeyboard = () => {
        this.setState({
            showKeyboard: false,
            keyValues: []
        });
    }

    confirm = () => {
        PubSub.trigger('confirmValues');
        this.setState({
            showKeyboard: false,
            keyValues: []
        });
    }

    render() {
        let content;
        let typeContent;
        const keySet = Array.apply(null, Array(6)).map((item, i) => ++i);

        if (this.props.type == 'dot') {
            typeContent = (
                <Tappable component="div" className="money-keyboard-item"  data-value="."  onTap={this.tap}>
                    <p className="money-keyboard-text money-keyboard-num money-keyboard-zero">.</p>
                </Tappable>
            )
        } else {
            typeContent = (
                <Tappable component="div" className="money-keyboard-item money-keyboard-empty" />
            )
        }

        if (!this.state.keyboardLoading) {
            content = (
                <div className="moneyKeyboard-container">
                    <div className="money-keyboard-row">
                        <div className="money-keyboard-items">
                            {
                                keySet.map((item, index) => {
                                    if (index < 3) {
                                        return (
                                            <Tappable component="div" className="money-keyboard-item money-keyboard-item-white" style={{ marginTop: 0 }} data-value={item} key={index} onTap={this.tap}>
                                                <p className="money-keyboard-text money-keyboard-num">{item}</p>
                                            </Tappable>
                                        )
                                    }
                                    return (
                                        <Tappable component="div"  className="money-keyboard-item" data-value={item} key={index} onTap={this.tap}>
                                            <p className="money-keyboard-text money-keyboard-num">{item}</p>
                                        </Tappable>
                                    )
                                })
                            }
                        </div>
                        <Tappable className="money-keyboard-right money-keyboard-delete-container" component="div" data-value="del" onTap={this.tap}>
                            <i className="money-keyboard-delete iconfont" style={{ fontSize: '.6rem'}}>&#xe00b;</i>
                        </Tappable>
                    </div>
                    <div className="money-keyboard-row">
                        <div className="money-keyboard-items">
                            {
                                [7,8,9].map((item, index) => {
                                    return (
                                        <Tappable component="div" className="money-keyboard-item" data-value={item} key={index} onTap={this.tap}>
                                            <p className="money-keyboard-text money-keyboard-num">{item}</p>
                                        </Tappable>
                                    )
                                })
                            }
                            {typeContent}
                            <Tappable className="money-keyboard-item" component="div" data-value="0"  onTap={this.tap}>
                                <p className="money-keyboard-text money-keyboard-num money-keyboard-zero">0</p>
                            </Tappable>

                            <Tappable component="div" className="money-keyboard-item money-keyboard-empty" data-value="0" onTap={this.confirm}>
                                <i className="money-keyboard-delete iconfont" style={{ fontSize: '.6rem'}}>&#xe00c;</i>
                            </Tappable>
                        </div>
                        <Tappable component="div" className="money-keyboard-right money-keyboard-confirm" onTap={this.confirm}>确定</Tappable>
                    </div>
                </div>
            );
        }

        return (
            <div className="money-keyboard" style={{display: this.state.showKeyboard ? "" : "none"}}>
                {/* <div className="pass-mask" onClick={this.confirm}></div> */}
                <div className="money-keyboard-container">
                    <div className="money-keyboard-content">
                        {content}
                    </div>
                </div>
            </div>
        );
    }
}

/**
 * @var {object} propTypes
 * @memberOf module:MoneyKeyboard
 * @prop {string} showKeyboard 是否显示键盘
 * @prop {string} type normal正常键盘 dot可输入小数点键盘
 * @example
 <MoneyInput message="追加投资金额（元）" ref="moneyInput"/>
 <MoneyKeyboard showKeyboard={this.state.showKeyboard}/>
 */

MoneyKeyboard.propTypes = {
    showKeyboard: PropTypes.bool,
    type: PropTypes.string
};

MoneyKeyboard.defaultProps = {
    showKeyboard: false,
    type: 'normal'
};

export default MoneyKeyboard;
