/*
  组件用法
  <Button onClick={this.onSubmit} value="确认" styleName="btn-small"/>
  styleName 分为三部分 默认为 有背景色的大按钮 btn-large-full
  如果需要其他样式的按钮可以改变后两个参数 第二个参数为large middle small
  第三个参数为full有背景色 transparent透明 如果想设置第三个  第二个不能省略哈
  disabled为true 则按钮不可用
*/
import React from 'react';
require('./Button.scss');
const loadingImg = require("base64-image-loader!./button-loading.gif");
/**
 * @module Button
 * @desc 按钮 import { Button } from 'component';
 * @version 1.0.0
 * @author Guanlingjuan
 */
class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.styleName.split('-')[0],
      size: props.styleName.split('-')[1] || "large",
      background: props.styleName.split('-')[2] || "full",
    };
    this.onClickFunc = this.onClickFunc.bind(this);
   }
   onClickFunc () {
     if (this.props.disabled) {
       return ;
     }
     const {onClick} = this.props;
     if (typeof onClick === 'function'){
       onClick();
     }
   }
  render() {
    const {value, type, disabled, style, className, loading} = this.props;
    const {name, size, background} = this.state;
    const styleName = name + " " + size + " " + background + " " + className;
    return (
      <div className="button-content">
        {loading ? (<img className="btn-loading" src={loadingImg}/> ): null}
        <button
          style={style}
          onClick={loading ? null : this.onClickFunc}
          type={type}
          disabled={disabled}
          className={styleName}>
          {loading ? "" : value}
        </button>
      </div>
    );
  }
}

/**
 * @var {object} propTypes
 * @memberOf module:Button
 * @desc 参数
 * @property disabled {boolean} 是否禁用
 * @property onClick {function} 点击事件
 * @prop {string} value 按钮值
 * @prop {string} styleName 分为三部分 默认为 有背景色的大按钮btn-large-full,其他样式的按钮改变后两个参数:第二个参数为large middle small,第三个参数full有背景色 transparent透明 (设置第三个.第二个不能省略)
 * @prop {string} className 外部class
 * @prop {object} style 外部class
 * @prop {string} type 按钮类型三选一 'button', 'reset', 'submit'
 * @prop {boolean} loading 是否显示loading
 * @example
 * 调用方法: <Button onClick={this.onSubmit} value="确认" styleName="btn-small"/>
 *
 */
Button.propTypes = {
  disabled: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  value: React.PropTypes.string,
  styleName: React.PropTypes.string,
  className: React.PropTypes.string,
  style: React.PropTypes.object,
  type: React.PropTypes.oneOf(['button', 'reset', 'submit']),
  loading: React.PropTypes.bool,
};

/**
 * @var {object} defaultProps
 * @memberOf module:Button
 * @desc 参数
 * @property disabled false
 * @property styleName 'btn-large-full'
 * @property className ''
 * @property style '{}'
 * @property type 'button'
 * @property loading false
 */
Button.defaultProps = {
  disabled: false,
  styleName: 'btn-large-full', // 默认btn  按钮大小small large middle 背景透明transparent
  className: '',
  style: {},
  type: 'button',
  loading: false,
};
export default Button;
