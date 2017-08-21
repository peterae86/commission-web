
/*
  组件用法
  <Dropdown
  onSelect={this.onSelectFunc}      //选择之后的回调  还有onClick onChange onBulr
  placeholder="请选择:"              // 默认展示的汉字
  type="plhdSelect"                 // 默认为 select 选中后placeholder 消失, type 为plhdSelect时 选中后placeholder永不消失
  defaultOption={defaultOption}     //defaultOption默认展示那个数据,必须与option中一致,作死我可不管哈
  optionStyle={optionStyle}         //option的样式,万一你不喜欢宽度,pandding,自己加
  options={option}                  // 格式必须数组,支持[1,2,3] [{},{}]两种形式
  optionType="number"/>             // 说明当前option是那种格式的数组 number为纯数字数组  默认object
                                    //  propsValue:'value', 默认使用对象中的那个key作为value 可指定
                                    //propsLabel:'label',默认使用对象中的那个key作为label 可指定
                                    // style 对于整个dropdown的样式自定义




注意,目前缺少支持option中value为数字0的情况,所以为了避免各位小主遇到挫折,请所有数字都使用string

*/
import React from 'react';
require('./Dropdown.scss');
/**
 * @module Dropdown
 * @desc 下拉框 import { Dropdown } from 'component';
 * @version 1.0.0
 * @author Lingjuan.guan
 */
class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.index = -1;
        this.state = {
            isOpen: this.props.isOpen,
            selected:this.doDealDefault(this.props.defaultOption, this.props.optionType),
            placeholder: this.props.placeholder
        };
        this.onClickFunc = this.onClickFunc.bind(this);
    }

    componentWillReceiveProps (newProps) {
        const {options, propsValue, propsLabel, isOpen} = newProps;
        const {onChange} = this.props;
        const {selected} = this.state;
        if (typeof options[this.index] === "object") {
          // 如果props中传递的option数组中每个元素是对象
          let newValue = options[this.index] ? options[this.index][propsValue] : "";
          let newLabel = options[this.index] ? options[this.index][propsLabel] : "";
          if (newValue && newValue !== selected[propsValue]) {
              // 如果变化之后的新值存在并且不等于上一次被选择的值
              this.setState({selected: options[this.index],isOpen:false, value:newValue});
              onChange && onChange(newValue,newLabel);
          } else if (!newProps.value && newProps.placeholder) {
              // 如果变化之后的新值不存在 并且placeholder存在
              this.setState({ selected: { label: '', value: '' },isOpen:false, value:""});
          }
        } else {
          // 如果props中传递的option数组中每个元素是非对象
          let newValue = options[this.index];
          let newLabel = options[this.index];
          if (newValue && newValue !== selected) {
              this.setState({selected: newValue,isOpen:false, value: newValue});
              onChange &&  onChange(newValue,newLabel);
          } else if (!newProps.value && newProps.placeholder) {
              this.setState({ selected: newProps.value,isOpen:false, value:newProps.value });
          }
        }

        this.setState({
          isOpen: isOpen
        });
    }
    onClickFunc () {
        const {onClick} = this.props;
        onClick && onClick(this.state);
        this.setState({isOpen:!this.state.isOpen});
    }
    onSelectFunc (value, label, index) {
        const {onSelect} = this.props;
        if (onSelect && onSelect(value, label) === false){
            // 如果onSelect返回的结果是false 那么 关闭dropdown 不更新值
            this.setState({isOpen:false});
            return false;
        }
        this.index = index;
        this.setState({isOpen:false});
        // 当没有返回 或者 返回true的时候 获取当前的索引
    }
    doDealDefault (defaultOption, optionType) {
        // 对于初始化时,组件对默认值的处理
        const {propsValue, propsLabel} = this.props;
        if (optionType === "number") {
          return defaultOption || "";
        } else {
          let selected = {};
          selected[propsValue] = defaultOption[propsValue].toString() || "";
          selected[propsLabel] = defaultOption[propsLabel] || "";
          return selected;

        }
    }
    render() {
        const { isOpen, selected, placeholder} = this.state; // 需要dropdown内部维护的变量

        const {style, optionStyle, options, propsValue, propsLabel, optionType, type} = this.props;

        const self = this;
        let styleNameClass = 'dropdown';
        // 处理dropdown上的样式
        if (isOpen) {
            styleNameClass +=' open';
        }
        let labelString = null;
        if (optionType === "number") {
          labelString = (
              selected ?
                (type === "plhdSelect" ?
                (
                  <div className="dropdown-placeholder">
                    {placeholder}
                    <div className="dropdown-label">
                    {selected}
                    </div>
                  </div>
                ):
              (<div className="dropdown-label">{selected}</div>)):
              (<div className="dropdown-placeholder">{placeholder}</div>)
          );
        } else {
          labelString = (
            selected[propsLabel] ?
              (type === "plhdSelect" ?
              (
                <div className="dropdown-placeholder">
                  {placeholder}
                  <div className="dropdown-label">
                  {selected[propsLabel]}
                  </div>
                </div>):
            (<div className="dropdown-label">{selected[propsLabel]}</div> )):
            (<div className="dropdown-placeholder">{placeholder}</div>)
          );
        }
        return (
            <div style={style} className={styleNameClass}>
                <div className="dropdown-control" onClick={this.onClickFunc}>
                  {labelString}
                    <span className={isOpen ? "dropdown-arrow open-arrow" : "dropdown-arrow"} />
                </div>
                <div className={isOpen ? "dropdown-menu" : "hidden"} >
                    {
                        options.map(function (item, index) {
                            if (typeof item !== "object") {
                                return (
                                  <div
                                    style={optionStyle}
                                    key={index}
                                    className= {item === selected ? "hidden":"dropdown-option"}
                                    data-value={item}
                                    onClick={self.onSelectFunc.bind(self, item, item, index)}
                                  >{item}
                                </div>);
                            } else {
                                return (
                                  <div
                                    style={optionStyle}
                                    key={index}
                                    className= {item[propsValue] === selected[propsValue] ? "hidden" : "dropdown-option"}
                                    data-value={item[propsValue]}
                                    onClick={self.onSelectFunc.bind(self, item[propsValue], item[propsLabel], index)}
                                  >{item[propsLabel] ? item[propsLabel] : item[propsValue]}
                                </div>
                              );
                            }
                        })
                      }
                </div>
            </div>
        );
    }
}


/**
 * @var {object} propTypes
 * @memberOf module:Dropdown
 * @prop {boolean} isOpen 下拉框当前状态,打开还是关闭
 * @prop {function} onClick 点击下拉框事件时触发此函数
 * @prop {function} onChange 下拉框内容发生改变时触发此函数,点击原有选项不触发此函数
 * @prop {function} onSelect 下拉框点击选项时触发此函数
 * @prop {function} onBlur 下拉框失去焦点时触发此函数
 * @prop {string} placeholder 默认展示文本
 * @prop {array} defaultOption input默认值 string字符串如'2',number数字如2,object对象包含value,label
 * @prop {string} value 下拉框当前选中元素的值
 * @prop {string} defaultClass input为dark时,内容为空则靠左对齐
 * @prop {string} value input的值
 * @prop {array} options 下拉框列表选项
 * @prop {string} optionType number:下拉框中列表选项数组为纯数字如[1,2,3],object:下拉框中列表选项数组为对象如[{'value':'123','label':'1'}]
 * @prop {string} type 下拉框为单选还是多选,目前尚未支持多选
 * @prop {object} style 下拉框外层div内联样式
 * @prop {string} propsValue 下拉框内展示value所取options的'key'
 * @prop {string} propsLabel 下拉框内展示label所取options的'key'
 * @prop {object} optionStyle 下拉框列表元素内联样式
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

Dropdown.propTypes = {
    isOpen: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onBlur: React.PropTypes.func,
    placeholder: React.PropTypes.string,
    defaultOption: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number,
      React.PropTypes.object
    ]),
    value: React.PropTypes.oneOfType([
      React.PropTypes.string,
    ]),
    options: React.PropTypes.array,
    optionType: React.PropTypes.oneOf(['number','object']),
    type: React.PropTypes.oneOf(['select','plhdSelect']),
    style: React.PropTypes.object,
    propsValue: React.PropTypes.string,
    propsLabel: React.PropTypes.string,
    optionStyle: React.PropTypes.object,
};


/**
 * @var {object} defaultProps
 * @memberOf module:Dropdown
 * @desc 参数
 * @property placeholder: '请选择',
 * @property isOpen: false,
 * @property options: [],
 * @property value: '',
 * @property type: 'select',
 * @property optionType: 'object',
 * @property style: {},
 * @property defaultOption: {},
 * @property propsValue: 'value'
 * @property propsLabel: 'label',
 * @property optionStyle: {},
 */
Dropdown.defaultProps = {
    placeholder:'请选择',
    isOpen:false,
    options:[],
    value: "",
    type: 'select',
    optionType:'object',
    style:{},
    defaultOption: {"value":"","label":""},
    propsValue:'value',
    propsLabel:'label',
    optionStyle: {},
};

export default Dropdown;
