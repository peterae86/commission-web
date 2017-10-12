import React from 'react';
require('./Input.scss');

class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      value: props.value,
      shouldFocus: false,
      isFocusing: false,
      autocomplete: props.autocomplete,
      inputType: {
        "numeric":  /^[0-9a-zA-Z]*$/,
        "digital": /^[0-9]*$/,
        "float": /^[\d.]*$/,
        "normal": '',
      }[props.inputType] || ""
    };
    this.onClickFunc = this.onClickFunc.bind(this);
    this.onChangeFunc = this.onChangeFunc.bind(this);
    this.onBlurFunc = this.onBlurFunc.bind(this);
    this.onFocusFunc = this.onFocusFunc.bind(this);
    this.clickhHidden = this.clickhHidden.bind(this);
   }
   componentWillReceiveProps (newProps) {
       const {value, shouldFocus} = newProps;
       this.setState({value, shouldFocus});
   }
  componentDidUpdate () {
    if(this.state.shouldFocus && !this.state.isFocusing) {
      this.refs.myInput.focus();
    }
  }
  componentWillUnmount() {
    clearInterval(this.setTimeCursor);
  }
  onClickFunc () {
    if (this.props.readOnly) {
      return ;
    }
    const {onClick} = this.props;

    if (typeof onClick === 'function'){
      onClick();
    }
   }
   clickhHidden() {
     this.refs.myInput.focus();
     this.refs.myInput.click();
   }

   onChangeFunc (e) {
     const {inputType} = this.state;
     if (inputType && !inputType.test(e.target.value)) {
       return false;
     }
     const nameClass = this.props.styleName;

     this.setState({
       value: e.target.value,
     });
     const {onChange, changeRef} = this.props;

     if (typeof onChange === 'function'){
       onChange(e.target.value, changeRef);
     }
   }

   onBlurFunc (e) {
     const {onBlur} = this.props;
     if (typeof onBlur === 'function' ) {
        onBlur(this.state.value, e);
     }
     this.setState({
       cursorValue: 0,
       isFocusing: false
     });
     clearInterval(this.setTimeCursor);
   }
  onFocusFunc () {
    this.setState({
      isFocusing: true
    });
  }

  render() {
    const { style, inputStyle, styleName, placeholder, type, maxLength, curSurStyle, readOnly } = this.props;
    const { value, cursorValue, autocomplete, showPassword, showLaws } = this.state;
    const finalStyle = {...inputStyle };
    const cursurStyle = {
      "opacity": cursorValue,
      ...curSurStyle
    };

    return (
      <div className="input-container" style={style}>
            <input
              type={type}
              onClick={this.onClickFunc}
              onFocus={this.onFocusFunc}
              onBlur={this.onBlurFunc}
              onChange={this.onChangeFunc}
              readOnly = {readOnly}
              placeholder={placeholder}
              style={finalStyle}
              value={value}
              ref="myInput"
              maxLength={maxLength}
              className={styleName}
              autoComplete={autocomplete}
            />
        </div>
    );
  }
}

/**
 * @var {object} propTypes
 * @memberOf module:Input
 * @prop {function} onClick 点击input使input获得焦点
 * @prop {function} onBlur input失去焦点
 * @prop {function} onChange input内value发生变化
 * @prop {string} maxLength input长度限制
 * @prop {string} placeholder 默认展示文本
 * @prop {string} styleName input样式
 * @prop {string} normalClass input为dark时,内容不为空则居中对齐
 * @prop {string} defaultClass input为dark时,内容为空则靠左对齐
 * @prop {string} value input的值
 * @prop {array} type 'text','number','email','password','tel'
 * @prop {object} style input外部的div内联样式
 * @prop {object} inputStyle input内部的input内联样式
 * @prop {boolean} shouldFocus input是否默认获得焦点
 * @prop {object} curSurStyle input光标的内联样式
 * @prop {array} inputType input输入内容的校验1.'numeric'纯数字,2.'digital'数字字母,3.'normal'不校验
 * @prop {boolean} readOnly input只读
 */



Input.propTypes = {
  onClick: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  onChange: React.PropTypes.func,
  maxLength: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  placeholder: React.PropTypes.string,
  styleName: React.PropTypes.string,
  normalClass: React.PropTypes.string,
  defaultClass: React.PropTypes.string,
  value:  React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  type: React.PropTypes.oneOf(['text', 'number', 'email','password', 'tel']),
  style: React.PropTypes.object,
  inputStyle: React.PropTypes.object,
  shouldFocus: React.PropTypes.bool,
  curSurStyle:React.PropTypes.object,
  autocomplete: React.PropTypes.string,
  inputType: React.PropTypes.oneOf(['numeric', 'digital', 'normal','float']),
  readOnly: React.PropTypes.bool,
  changeRef: React.PropTypes.string,
};


Input.defaultProps = {
  maxLength: null,
  placeholder: '请输入',
  styleName: 'input',
  normalClass: "",
  defaultClass: "",
  type: 'text',
  style: {},
  inputStyle: {},
  value: '',
  shouldFocus: false,
  curSurStyle:{},
  autocomplete: "on",
  inputType :'normal',    //numeric为数字和字母    digital为纯数字
  readOnly: false,
  changeRef: "",
};
export default Input;
