
/*
  组件用法
  <Captcha
    src="/api/v2/captchaImage"
    ref="captcha"
    onRefresh={
    function() {
      return null;
    }
   }
  />

src: 图片请求地址,需要自己拼完整
onRefresh: 点击图片验证码的时候需要刷新
customClass: 额外加的样式

注意,在请求失败的时候需要刷新验证码请使用
  this.refs.captcha.clickFunc();
*/

import React, {PropTypes} from 'react';
/**
 * @module Captcha
 * @desc 图片验证码 import { Captcha } from 'component';
 * @version 1.0.0
 * @author Guanlingjuan
 */
class Captcha extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      src: this.getSrc()
    };
    this.clickFunc = this.clickFunc.bind(this);
  }

  getSrc() {
    return this.props.src + "?_=" + new Date().getTime();
  }

  clickFunc() {
    const { props } = this;

    this.setState({
      src: this.getSrc()
    });

    props.onRefresh(this.state.src);
  }

  needLess() {}

  render() {
    let {customClass, onRefresh, src, ...left} = this.props;

    this.needLess(onRefresh, src);

    customClass = customClass?"captcha-img " + customClass: "captcha-img";

    const pathSrc = this.state.src;
    return (
      <img
        className={customClass}
        src={pathSrc}
        onClick={this.clickFunc}
        {
          ...left
        }
      />
    );
  }
}
/**
 * @var {object} propTypes
 * @memberOf module:Captcha
 * @desc 参数
 * @property {string} customClass 额外加的样式
 * @property {string} src 图片请求地址,需要自己拼完整
 * @property {function} onRefresh 点击图片验证码的时候需要刷新
 * @example
 * <Captcha
 src="/api/v2/captchaImage"
 ref="captcha"
 onRefresh={
    function() {
      return null;
    }
   }
 />

注意,在请求失败的时候需要刷新验证码请使用
this.refs.captcha.clickFunc();
 */
Captcha.propTypes = {
  customClass: PropTypes.string,
  src: PropTypes.string,
  onRefresh: PropTypes.func
};
/**
 * @var {object} defaultProps
 * @memberOf module:Captcha
 * @desc 参数
 * @property customClass ''
 * @property src ''
 * @property onRefresh function() {}
 */
Captcha.defaultProps = {
  customClass: '',
  src: '',
  onRefresh: function() {}
};

export default Captcha;
