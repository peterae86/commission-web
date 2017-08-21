/**
 * Created by zhen.liu1 on 17/7/31.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import ToastBasic from './component';

const div = document.createElement("div");
document.body.appendChild(div);
const container = ReactDOM.render(<ToastBasic />, div);

function show(opt) {
  container.show(opt || {});
}

function hide() {
  container.hide();
}

const Toast = {
  show,
  hide
};

export default Toast;