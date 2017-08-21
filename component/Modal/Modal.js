// 下周再优化
import React, { PropTypes } from 'react';
const Button = require('../../lib/Button.js').default;
require('./Modal.scss');
/**
 * @module Modal
 * @desc 模态窗 import { Modal } from 'component';
 * @version 1.0.0
 * @author Liuzhen
 */
class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: props.show
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({show: nextProps.show});
  }

  render() {
    const { type, title, img, desc, btnText, linkText, btnClick, linkClick, hasCloseIcon, dialogStyles, confirmHorizontalClass, closeIconClick, contentStyles, dangerousHtml, imgStyle } = this.props;
    let imgModal;
    let clickArea;
    let closeIcon;
    if (hasCloseIcon) {
      closeIcon = (
        <div className="md-dialog-head">
          <span onClick={closeIconClick}>
            <i className="iconfont">&times;</i>
          </span>
        </div>
      );
    }
    if (img !== null) {
      imgModal = (<img src={img} style={imgStyle} className="md-dialog-img"/>);
    }
    if (type === 'alert') {
      clickArea = (
        <div>
          <Button onClick={btnClick} value={btnText} styleName="btn-small" />
        </div>
      );
    } else if (type === 'confirm') {
      clickArea = (
        <div>
          <Button onClick={btnClick} value={btnText} styleName="btn-small" />
          <Button onClick={linkClick} value={linkText} styleName="btn-small" />
        </div>
      );
    } else if (type === 'confirmHorizontal') {
      if (confirmHorizontalClass == 'left') {
        clickArea = (
          <div className="confirm-horizontal">
            <Button onClick={btnClick} value={btnText} styleName="btn-small-transparent" className="btn-first"/>
            <Button onClick={linkClick} value={linkText} styleName="btn-small" />
          </div>
        );
      } else {
        clickArea = (
          <div className="confirm-horizontal">
            <Button onClick={btnClick} value={btnText} styleName="btn-small" className="btn-first"/>
            <Button onClick={linkClick} value={linkText} styleName="btn-small-transparent" />
          </div>
        );
      }
    } else {
      clickArea = (
        <div>
          <Button onClick={btnClick} value={btnText} styleName="btn-small" />
          <p className="md-dialog-link" onClick={linkClick}>{linkText}</p>
        </div>
      );
    }
    return (
      <div style={{ display: this.state.show ? null : 'none', }} className="modal">
         <div className="m-mask" style={{ zIndex: 999 }} >
           <div className="m-dialog" style={dialogStyles}>
              <div className="md-dialog">
                {closeIcon}
                <div className="md-dialog-content">
                    {imgModal}
                    <p className="md-dialog-title">{title}</p>
                    {
                      dangerousHtml ?
                      (<div className="md-dialog-desc" dangerouslySetInnerHTML={{__html: desc}} style={contentStyles}></div>) :
                      (<p className="md-dialog-desc" style={contentStyles}>{desc}</p>)
                    }
                    {clickArea}
                </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * @var {object} propTypes
 * @memberOf module:Modal
 * @desc 参数
 * @property show {boolean} 是否显示
 * @property {string} type alert: 1个按钮 ；confirm: 2个按钮竖排 ： confirmHorizontal: 2个按钮横排； modal: 1按钮+文本链接
 * @prop {string} title 标题 (默认不填写 min-height: 0.5rem)
 * @prop {string} img 图片
 * @prop {string} desc 描述
 * @prop {string} btnText 按钮文本
 * @prop {string} linkText 底部文本或第二个按钮
 * @prop {function} btnClick 按钮事件
 * @prop {function} linkClick 底部文本或第二个按钮事件
 * @prop {boolean} hasCloseIcon 是否需要右上角X
 * @prop {object} dialogStyles dialog外部样式 className="m-dialog"
 * @prop {object} imgStyle dialog图片样式 className="md-dialog-img"
 * @prop {object} contentStyles desc描述外部样式
 * @prop {string} confirmHorizontalClass 确认modal按钮样式背景置白 left right
 * @prop {function} closeIconClick 右上角X事件
 * @prop {boolean} dangerousHtml 组件是否转译content部分字符串
 * @example
 * const modalProps = {
      show: this.state.showConfirm,
      desc: "下午2点前删除，当日不生效；下午2点后删除，当日追加仍会生效。",
      type: 'confirmHorizontal',
      hasCloseIcon: false,
      btnText: "取消",
      btnClick: () => {this.setState({showConfirm: false});},
      linkText: "确认删除",
      linkClick: () => { this.deleteClick();},
      confirmHorizontalClass: 'left',
      dialogStyles: {width:"5.2rem",height:"2.6rem",padding:"0.6rem 0.4rem",top:"-2rem"},
      imgStyle: {width:"5.2rem",height:"2.6rem",}
    };
 *
 * <Modal {...modalProps} />
 */
Modal.propTypes = {
    show: PropTypes.bool,
    type: PropTypes.string, // alert: 1个按钮 ；confirm: 2个按钮竖排 ： confirmHorizontal: 2个按钮横排； modal: 1按钮+文本链接
    title: PropTypes.string,
    img: PropTypes.string,
    desc: PropTypes.string,
    btnText: PropTypes.string, //按钮文本
    linkText: PropTypes.string, // 底部文本或第二个按钮
    btnClick: PropTypes.func, // 按钮事件
    linkClick: PropTypes.func, // 底部文本或第二个按钮事件
    hasCloseIcon: PropTypes.bool, //是否需要右上角X
    // 例子见 containers/Quit.js 65行
    dialogStyles: PropTypes.object,
    imgStyle: PropTypes.object,
    contentStyles : PropTypes.object,
    confirmHorizontalClass: PropTypes.string, // 确认modal按钮样式背景置白 left right
    closeIconClick: PropTypes.func, // 右上角X事件
    dangerousHtml: PropTypes.bool, //组件是否转译content部分字符串
};

/**
 * @var {object} defaultProps
 * @memberOf module:Modal
 * @property show: false
 * @property type: 'modal',
 * @property title: '',
 * @property img: null,
 * @property desc: '',
 * @property btnText: '',
 * @property linkText: '',
 * @property hasCloseIcon: true,
 * @property dialogStyles: null,
 * @property imgStyle: null,
 * @property contentStyles: null,
 * @property confirmHorizontalClass: 'left',
 * @property dangerousHtml: false
 */

Modal.defaultProps = {
  show: false,
  type: 'modal',
  title: '',
  img: null,
  desc: '',
  btnText: '',
  linkText: '',
  hasCloseIcon: true,
  dialogStyles: null,
  imgStyle: null,
  contentStyles: null,
  confirmHorizontalClass: 'left',
  dangerousHtml: false,
};

export default Modal;
