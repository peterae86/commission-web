
import React from 'react';
require('./Ceil.scss');
/**
 * @module Ceil
 * @desc list列表 import { Ceil } from 'component';
 * @version 1.0.0
 * @author Lingjuan.guan
 */
class Ceil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classArray: props.styleName.split('-'),
    };
   }
  render() {
    const {classArray} = this.state;

    return (
      <ul className="ceil-view">
        {
          this.props.data.map((item, index) => {
            return classArray.indexOf("h90") !== -1 ? (
              <li
                key={index}
                className={classArray.join(" ")}
                onClick={item.onClick}
              >
                <div className={"detail-label " + item.labelClass}>
                  <span style={this.props.labelStyle}>{item.label}</span>
                </div>
                <div
                  className={"detail-value " + (item.valueType ? "numbers ": "" ) + (item.value && item.icon ? "marginRight " : "") + item.valueClass }
                >
                  {
                    item.valueLine ?
                    (
                      <span>
                        <span className="value-line">{item.valueLine}</span>
                        <span className="separated">/</span>
                        <span className="current-value">{item.value}</span>
                      </span>
                    ) : (
                      <span className="current-value">{item.value}</span>
                    )
                  }
                  {
                    item.icon ?
                    (
                      <i className={"iconfont left-icon nextIcon " + (item.value ? "marginLeft": "")}>
                        &#xe013;
                      </i>
                    ) : null
                  }
                </div>
              </li>
          ) : (
              <li
                key={index}
                className={classArray.join(" ")}
                onClick={item.onClick}
              >
              <div className={"h116-line "+ (item.reverse ? "reverse ": "" ) + (item.icon ? "icon-right": "")}>
                  <div className={"value-line " + item.labelClass}>
                        <span style={this.props.labelStyle}>{item.label}</span>
                        <span className={(item.valueType ? "h116-numbers ": "" ) + item.valueClass }>{item.value}</span>
                  </div>
                  <div className="desc-line">
                      {
                        item.labelDesc ||  item.labelDesc === "" ?
                        (
                          <span className="label-gray">
                            {item.labelDesc}
                          </span>
                        ) : null
                      }
                      {
                        item.valueDesc ||  item.valueDesc === "" ?
                        (
                          <span className={"value-gray " + item.valueDescClassName}>
                            {item.valueDesc}
                          </span>
                        ) : null
                      }
                  </div>
              </div>
              <div>
              {
                item.icon ?
                (
                  <i className="iconfont left-icon nextIcon">
                    &#xe013;
                  </i>
                ) : null
              }
              </div>
              </li>
          )
          })
        }
      </ul>
    );
  }
}

/**
 * @var {object} propTypes
 * @memberOf module:Ceil
 * @prop {array} data ceil数据源
 * @prop {function} onClick data中元素,点击每一项ceil的事件
 * @prop {string} label data中元素,左侧label
 * @prop {string} value data中元素,右侧value
 * @prop {string} labelClass label样式
 * @prop {string} valueClass value样式
 * @prop {string} labelDesc data中元素,右侧下方文字
 * @prop {string} valueDesc data中元素,左侧下方文字
 * @prop {boolean} reverse data中元素,label和labelDesc位置逆转
 * @prop {string} valueType data中元素,如果是number,则字号放大一号
 * @prop {boolean} icon data中元素,true,展示箭头,false,不展示右侧箭头
 * @prop {object} valueDescClassName data中元素,右下方valueDesc的内联样式
 * @prop {styleName} ceil样式 [h90,h100,h116] [large][dark,grey,darken] 三个数组自由组合,顺序从前往后
 * @example
 *  <Ceil data=[{label: 'test', value: 'test'}]/>
 */
Ceil.propTypes = {
  data: React.PropTypes.array,
  styleName: React.PropTypes.string,
};
/**
 * @var {object} defaultProps
 * @memberOf module:Ceil
 * @desc 参数
 * @property data: []
 * @property styleName: 'h90',
 */
Ceil.defaultProps = {
  data: [],
  styleName:'h90',
};
export default Ceil;
