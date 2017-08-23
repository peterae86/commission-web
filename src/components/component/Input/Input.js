/*
  组件用法
  <Input placeholder="请输入交易密码" value="" type="password"/>
  <Input placeholder="0.00" value="" onChange={this.test} styleName='black-input' message="每期定投金额(元)"/>
  默认样式为input 白色背景的普通input
  styleName='black-input' 为黑色背景 input ,message为input下方需要展示的字,可以不传递
  maxLength:最大支持长度
  onClick,onBlur,onChange 与原生使用方法一致
  type:支持'text', 'number', 'email','password', 'tel',有问题及时联系我 =>lingjuan.guan
  alReadyCursor: false,是否展示一个假的光标,true展示,false不展示
  showIcon: false,  是否展示右侧的眼睛
  showPassword: false, // 判断展示那种状态 默认为showLaws第一个
  showLaws:[] // 要切换于那两种格式,默认为password和tel
*/
import React from 'react';
require('./Input.scss');
const eyes14 = require("base64-image!./eyes14.png");
const eyes15 = require("base64-image!./eyes15.png");
/**
 * @module Input
 * @desc 输入框 import { Input } from 'component';
 * @version 1.0.0
 * @author Lingjuan.guan
 */
class Input extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      value: props.value,
      cursorValue: 0, //手动光标的 透明度
      alReadyCursor: props.alReadyCursor,
      shouldFocus: false,
      isFocusing: false,
      autocomplete: props.autocomplete,
      autoClass: props.value ? (props.value === "0.00" ? props.defaultClass : props.normalClass) : props.defaultClass,
      showPassword: props.showPassword,
      showLaws: props.showLaws,
      inputType: {
        "numeric":  /^[0-9a-zA-Z]*$/,
        "digital": /^[0-9]*$/,
        "normal": '',
      }[props.inputType] || ""
    };
    this.onClickFunc = this.onClickFunc.bind(this);
    this.onChangeFunc = this.onChangeFunc.bind(this);
    this.onBlurFunc = this.onBlurFunc.bind(this);
    this.onFocusFunc = this.onFocusFunc.bind(this);
    this.clickhHidden = this.clickhHidden.bind(this);
    this.showChangeType = this.showChangeType.bind(this);
     if (this.state.alReadyCursor && ( !props.value || props.value === "0.00" )) {
       this.setTimeCursor = setInterval( () => {
         this.setState({
           cursorValue: Number(!this.state.cursorValue),
         });
       },500);
     }
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
    this.setState({
      alReadyCursor: false,
      cursorValue: 0,
    });
    clearInterval(this.setTimeCursor);
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
     if (!Number(e.target.value)) {
       this.setState({
         autoClass:this.props.defaultClass
       });
     } else if (nameClass === "black-input") {
       this.setState({
         autoClass:this.props.normalClass
       });
     }
     this.setState({
       value: e.target.value,
     });
     const {onChange} = this.props;
     if (typeof onChange === 'function'){
       onChange(e.target.value);
     }
   }

   onBlurFunc (e) {
     const {onBlur} = this.props;
     if (typeof onBlur === 'function' ) {
        onBlur(this.state.value, e);
     }
     this.setState({
       cursorValue: 0,
       alReadyCursor: false,
       isFocusing: false
     });
     clearInterval(this.setTimeCursor);
   }
  onFocusFunc () {
    this.setState({
      isFocusing: true
    });
  }

  showChangeType () {
    const {showPassword} = this.state;
    this.setState({
      showPassword: !showPassword,
    });
  }

  render() {
    const { style, inputStyle, styleName, placeholder, type, message, maxLength, messageSpecial, curSurStyle, readOnly, showIcon } = this.props;
    const { value, cursorValue, autoClass, autocomplete, showPassword, showLaws } = this.state;
    const finalStyle = {...inputStyle };
    const cursurStyle = {
      "opacity": cursorValue,
      ...curSurStyle
    };
    const str = styleName === 'input' ?
      (  <div className="input-container" style={style}>
            <input
              type={ showIcon ? (showPassword ? showLaws[1]:showLaws[0]) : type}
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
            {
              showIcon ?
              (<img className="right-icon" onClick={this.showChangeType} src={ showPassword ? eyes14: eyes15} />):
              null
            }

        </div>): (
          <div style={style} className="black-div">
              <div className="cursor" style={cursurStyle}/>
              <input type={type}
                onClick={this.onClickFunc}
                onBlur={this.onBlurFunc}
                onFocus={this.onFocusFunc}
                onChange={this.onChangeFunc}
                placeholder={placeholder}
                style={finalStyle}
                value={value}
                readOnly = {readOnly}
                ref="myInput"
                maxLength={maxLength}
                className={styleName+" " +autoClass}
                autoComplete={autocomplete}
              />
              <div className="black-tips">{message}</div>
              {
                !messageSpecial ? null:
                (
                  <div className="black-special">{messageSpecial}</div>
                )
              }
          </div>
        );
    return (
      str
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
 * @prop {string} message 当input为dark时,input下方需要展示的字
 * @prop {string} placeholder 默认展示文本
 * @prop {string} styleName input样式
 * @prop {string} normalClass input为dark时,内容不为空则居中对齐
 * @prop {string} defaultClass input为dark时,内容为空则靠左对齐
 * @prop {string} value input的值
 * @prop {array} type 'text','number','email','password','tel'
 * @prop {object} style input外部的div内联样式
 * @prop {object} inputStyle input内部的input内联样式
 * @prop {boolean} shouldFocus input是否默认获得焦点
 * @prop {boolean} alReadyCursor input是否有假光标闪动
 * @prop {object} curSurStyle input光标的内联样式
 * @prop {string} messageSpecial 当input为dark时,input下方message下方展示的字
 * @prop {array} inputType input输入内容的校验1.'numeric'纯数字,2.'digital'数字字母,3.'normal'不校验
 * @prop {boolean} readOnly input只读
 * @prop {boolean} showIcon input右方是否展示眼睛icon
 * @prop {boolean} showPassword input右方展示眼睛判断当前展示那种状态
 * @prop {array} showLaws input右侧展示眼睛时,配置哪两种状态切换
 * @example
 *   <Input styleName="black-input"
            inputType="digital"
            normalClass="center-input"
            defaultClass="WL220"
            maxLength={8}
            onChange={this.changeMoney}
            placeholder="请输入"
            type="tel"
            onBlur={this.onBlur}
            message="计划投资(元)"
            onClick={this.onFocus}
            curSurStyle={{left:'2.933333rem'}}
            alReadyCursor={alReadyCursor}
            value={value}
          />
 */


Input.propTypes = {
  onClick: React.PropTypes.func,
  onBlur: React.PropTypes.func,
  onChange: React.PropTypes.func,
  maxLength: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number,
  ]),
  message: React.PropTypes.string,
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
  alReadyCursor: React.PropTypes.bool,
  curSurStyle:React.PropTypes.object,
  autocomplete: React.PropTypes.string,
  messageSpecial: React.PropTypes.string,
  inputType: React.PropTypes.oneOf(['numeric', 'digital', 'normal']),
  readOnly: React.PropTypes.bool,
  showIcon: React.PropTypes.bool,
  showPassword: React.PropTypes.bool,
  showLaws: React.PropTypes.array,
};



/**
 * @var {object} defaultProps
 * @memberOf module:Input
 * @desc 参数
 * @property maxLength: null
 * @property message: '',
 * @property placeholder: '请输入',
 * @property styleName: 'input',
 * @property normalClass: '',
 * @property defaultClass: '',
 * @property type: 'text',
 * @property style: {},
 * @property inputStyle: {},
 * @property value: '',
 * @property shouldFocus: false
 * @property alReadyCursor: false,
 * @property curSurStyle: {},
 * @property autocomplete: 'on',
 * @property messageSpecial: ''
 * @property inputType: 'normal'
 * @property readOnly: false,
 * @property showIcon: false,
 * @property showPassword: false,
 * @property showLaws: ["password", "tel"]
 */
Input.defaultProps = {
  maxLength: null,
  message: '',
  placeholder: '请输入',
  styleName: 'input',
  normalClass: "",
  defaultClass: "",
  type: 'text',
  style: {},
  inputStyle: {},
  value: '',
  shouldFocus: false,
  alReadyCursor: false,
  curSurStyle:{},
  autocomplete: "on",
  messageSpecial: "",
  inputType :'normal',    //numeric为数字和字母    digital为纯数字
  readOnly: false,
  showIcon: false, // 是否展示右侧的眼睛
  showPassword: false, // 判断展示那种状态
  showLaws: ["password", "tel"] // 在点击眼睛时,切换的两种状态,false为第一种,true为第二种
};
export default Input;
