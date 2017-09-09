import React, { PropTypes } from 'react';
import Button from '../Button/Button';
require('./ModalAlert.scss');
/**
 * @module ModalAlert
 * @desc 弹层 import { ModalAlert } from 'component';
 * @version 1.0.0
 * @author lingjuan.guan
 */
class ModalAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show
    };
    this.cancelFunc = this.cancelFunc.bind(this);
    this.comfirmFunc = this.comfirmFunc.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({show: nextProps.show});
  }
  cancelFunc () {
      this.setState({
          show: false,
      });
      const func = this.props.onCancel;
      if (func) {
          func();
      }
  }
  comfirmFunc () {
      this.setState({
          show: false,
      });
      const func = this.props.onConfirm;
      if (func) {
          func();
      }
  }

  render() {
    const { type, title, message, confirm, cancel} = this.props;
    return (
        <div style={{ display: this.state.show ? null : 'none', }} className="alert-container">
            <div className="alert">
                {
                    !title ?
                    null:
                    (
                        <div className="alert-title">{title}</div>
                    )
                }
                <div className="alert-message">
                    {
                        message.indexOf("\n") > 0 ? message.split("\n").map((item, index) => <p key={`mess${index}`}>{item}</p>) : message
                    }
                </div>
                <div className="alert-button">
                    {
                        type === "alert" ?
                        (
                            <Button value={confirm} styleName="btn-middle" onClick={this.cancelFunc}/>
                        ) :
                        (
                            <div className="comfirm-button">
                                <Button value={confirm} styleName="btn-middle" className="comfirm-view" onClick={this.comfirmFunc}/>
                                <Button value={cancel} styleName="btn-middle-gray" onClick={this.cancelFunc}/>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
  }
}

/**
 * @var {object} propTypes
 * @memberOf module:ModalAlert
 * @desc 参数
 * @property show {boolean} 是否显示
 * @property {string} type alert: 1个按钮 ；confirm: 2个按钮竖排
 * @prop {string} title 标题
 * @prop {string} message 描述
 * @prop {string} confirm 右边按钮文本
 * @prop {string} cancel 左边按钮文本
 * @prop {function} onConfirm 右边按钮事件
 * @prop {function} onCancel 左边按钮事件
 * @example
 * const modalProps = {
      show: this.state.showConfirm,
      message: "下午2点前删除，当日不生效；下午2点后删除，当日追加仍会生效。",
      type: '；confirm',
      cancel: "取消",
      cancelClick: () => {this.setState({showConfirm: false});},
      confirm: "确认删除",
      confirmClick: () => { this.deleteClick();}
    };
 *
 * <ModalAlert {...modalProps} />
 */
ModalAlert.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string, // alert: 1个按钮 ；confirm: 2个按钮竖排
    title: PropTypes.string,
    message : PropTypes.string,
    confirm: PropTypes.string, // 右边按钮文字
    cancel: PropTypes.string, //左边按钮文字
    onConfirm: PropTypes.func, //右边按钮事件
    onCancel: PropTypes.func, //左边按钮事件
};

/**
 * @var {object} defaultProps
 * @memberOf module:ModalAlert
 * @property show: false
 * @property type: 'confirm',
 * @property title: '',
 * @property message: '',
 * @property confirm: '确定',
 * @property cancel: '取消'
 * @property onConfirm: null
 * @property onCancel: null
 */

ModalAlert.defaultProps = {
  show: true,
  type: 'confirm',
  title: '提示',
  message: '',
  confirm: '确定',
  cancel: '取消',
  onConfirm: null,
  onCancel: null
};

export default ModalAlert;
