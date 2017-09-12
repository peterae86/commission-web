// 下周再优化
import React, { PropTypes } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
require('./Modal.scss');

class Modal extends React.Component {
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
      const { title,confirm, cancel, formData} = this.props;
      const flag = (formData.length > 0) && this.state.show;
      return (
          <div  style={{ display: flag ? null : 'none', }} className="m-modal">
              <div className="m-mask">
                  <div className="modal-container">
                      <div className="modal-title">{title}</div>
                      <ul className="modal-body">
                          {
                              formData.map((item, index)=> {
                                  return (<li key={index} className="body-list">
                                          <span>{item.label}</span>
                                          <Input style={{width: "75%"}} inputStyle={{width: "75%",height: "30px"}} value={item.value} />
                                  </li>)
                              })
                          }
                      </ul>
                      <div className="modal-button">
                          <Button value={confirm} styleName="btn-middle" className="comfirm-view" onClick={this.comfirmFunc}/>
                          <Button value={cancel} styleName="btn-middle-gray" onClick={this.cancelFunc}/>
                      </div>
                  </div>
              </div>
          </div>
      );
  }
}

Modal.propTypes = {
    show: PropTypes.bool,
    title: PropTypes.string,
    confirm: PropTypes.string, //按钮文本
    cancel: PropTypes.string, // 底部文本或第二个按钮
    comfirmFunc: PropTypes.func, // 按钮事件
    cancelFunc: PropTypes.func, // 底部文本或第二个按钮事件
    formData: PropTypes.array
};

Modal.defaultProps = {
  show: false,
  title: '提示',
  confirm: '提交',
  cancel: '关闭',
  formData: []
};

export default Modal;
