/**
 * Created by zhen.liu1 on 17/7/31.
 */
import React, {Component} from 'react';
import classnames from 'classnames';
require('./Toast.scss');
const loading = require("base64-image!./TOAST_loading.gif");

/**
 * @module Toast
 * @desc 提示框 import { Toast } from 'component';
 * @desc 使用: Toast.show({mess: '请输入验证码'}); 默认 type:'mess' type='loading'时显示时间3s 可以使用Toast.hide();隐藏;
 * @version 2.0.0
 * @author Liuzhen
 */
class ToastBasic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "mess",
      mess: "",
      timer: 0,
      className: "",
    };
    this.show = this.show.bind(this);
  }

  show = (opt) => {
    let {type, mess, duration} = opt;
    let time = null;
    const {timer} = this.state;

    //if (timer != 0) {
    //    return false;
    //}
    clearTimeout(timer);
    duration = duration || 1800;

    if (!type) {
      type = 'mess';
    }

    let _self = this;
    time = setTimeout(() => {
      _self.setState({
        className: "toastEnter",
      });
      setTimeout(() => {
        let cls = this.state.className;
        if (cls.match("toastEnter")) {
          _self.setState({
            className: "toastEnter toastOut",
            timer: 0,
            type: '',
          });
        }
      }, 500);
    }, type != "loading" ? duration : 3000);

    this.setState({
      type: type,
      mess: mess,
      timer: time,
      className: ""
    });
  }

  hide = () => {
    clearTimeout(this.state.timer);
    this.setState({
      type: '',
      className: "toastEnter toastOut",
      timer: 0
    });
  }

  render() {
    let toastContent = "";
    if (this.state.type == "mess") {
      toastContent = this.state.mess;
    } else if (this.state.type == "loading") {
      toastContent =
          <div className="toastInnerBox">
            <div className="toastLoadingImg">
              <img src={loading} />
            </div>
            <div className="toastInnerText">
              { this.state.mess }
            </div>
          </div>
      ;
    }
    return (
        <div
            className={
                    classnames({
                        toastInit: this.state.mess == "",
                        toastBox: true,
                        toastOut: this.state.className.match("toastOut"),
                    })
                }
        >
          {
            this.state.type == "loading" ? <div className="toastMask"></div> : ''
          }
          <div
              className={
                        classnames({
                            toastContent: true,
                            toastEnter: this.state.className.match("toastEnter"),
                        })
                    }
              style={{
                        padding: this.state.mess ? "15px 35px" : "0"
                    }}
          >
            { toastContent }
          </div>
        </div>
    );
  }
}

export default ToastBasic;