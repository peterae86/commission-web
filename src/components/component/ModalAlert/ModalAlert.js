import React, { PropTypes } from 'react';
import Button from '../Button/Button';
require('./ModalAlert.scss');
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
