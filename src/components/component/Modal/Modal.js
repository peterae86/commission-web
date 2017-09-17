// 下周再优化
import React, { PropTypes } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
require('./Modal.scss');

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      formData: props.formData
    };
    this.cancelFunc = this.cancelFunc.bind(this);
    this.comfirmFunc = this.comfirmFunc.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({show: nextProps.show,formData: !nextProps.show ? []: nextProps.formData});
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
          func(this.state.formData);
      }
  }
  changeValue(value, key) {
      let newFormData = [];
      this.state.formData.map((item, index)=>{
          if (key === item.key) {
              newFormData.push({
                  ...item,
                  value: /^[\d,.]+$/.test(value) ?  +value : value
              });
          } else{
              newFormData.push(item);
          }
      });

      this.setState({
          formData: newFormData
      })
  }

  changeRadio(e) {
      let newForm = [...this.state.formData];
      newForm[2].value = e.target.value;
      this.setState({
          formData: newForm
      });
  }

  render() {
      const { title,confirm, cancel} = this.props;
      const {formData} = this.state;
      const flag = (formData.length > 0) && this.state.show;
      return (
          <div  style={{ display: flag ? null : 'none', }} className="m-modal">
              <div className="m-mask">
                  <div className="modal-container">
                      <div className="modal-title">{title}</div>
                      <ul className="modal-body">
                          {
                              formData.map((item, index)=> {
                                  if (item.label) {
                                      return (<li key={index} className="body-list">
                                              <span className="list-label">{item.label}</span>
                                              {
                                                  item.type==="radio" ? (
                                                      <div className="form-radio">
                                                         {
                                                             item.radioLabel.map((items, index)=> {
                                                                 return (
                                                                     <div className="radio-body" key={index}>
                                                                         <input type="radio" defaultChecked={item.value==items.value} onClick={this.changeRadio.bind(this)} name={item.key} value={items.value} />
                                                                         <span className="radio-label">{items.label}</span>
                                                                     </div>);
                                                             })
                                                         }
                                                      </div>
                                                      ) :
                                                  (<Input onChange={this.changeValue} changeRef={item.key} inputType={item.inputType || "digital"} style={{width: "75%"}} inputStyle={{width: "75%",height: "30px",background:item.readOnly? "#e6e6e6": "#fff"}} readOnly={item.readOnly} value={item.value} />)
                                             }
                                      </li>)
                                  }

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
