import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import Button from '../../component/Button/Button';
import {requestByFetch} from "../../../utils/request";
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import {hashHistory} from "react-router";

class AddParam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: props.pathNames,
            corpCode: "", // 城市公司下编码
            currentCity:{},
            showConfirm: false,
            message: "", // alert message
            scoreItemName: "",
            compute: "1", // 是否可计算
        }
        this.onChangeFunc = this.onChangeFunc.bind(this);
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompnay = this.onSelectCompnay.bind(this);
        this.comfirmFunc = this.comfirmFunc.bind(this);
        this.cancelFunc = this.cancelFunc.bind(this);
    }

    //修改input 值
    onChangeFunc(value, key) {
        this.setState({
            [key]: value
        });
    }
    // 渲染碳层
    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'alert',
            onCancel: () => {
                this.setState({showConfirm: false});
            },
        };
        return <ModalAlert {...modalProps} />
    }
    // 选择城市回调
    onSelectCity(value) {
        this.setState({
            currentCity: this.props.cities.find(x => x.cityCode === value)
        });
    }

    // 选择公司回调
    onSelectCompnay(value) {
        this.setState({
            corpCode: value
        });
        if (!value) {
            this.setState({
                showConfirm: true,
                message: "请选择公司!"
            });
            return false;
        }
    }

    changeRadio(e) {
        this.setState({
            compute: e.target.value
        });
    }

    comfirmFunc () {
        // const path = "../data/newRank.json";
        const path = "/api/scoreRules/addNewScoreItem";
        const {currentCity, corpCode, scoreItemName, compute} = this.state;
        if (!currentCity.cityCode || !corpCode) {
            this.setState({
                showConfirm: true,
                message: "请选择城市和公司!"
            });
            return false;
        }
        if (!scoreItemName) {
            this.setState({
                showConfirm: true,
                message: "请输入参数名称!"
            });
            return false;
        }
        const param = {
            cityCode:currentCity.cityCode,
            corpCode: corpCode,
            scoreItemName: scoreItemName,
            computeType: ["NON_COMPUTABLE","COMPUTABLE"][compute]
        };
        requestByFetch(path, param).then((res) => {
            this.setState({
                showConfirm: true,
                message: "新增成功"
            });
            setTimeout(()=> {
                this.setState({
                    showConfirm: false,
                    message: ""
                });
                this.props.onJump('/score/paramList');
            }, 700);
        });

    }
    cancelFunc () {
        this.props.onJump('/score/paramList');
    }


    render() {
        const {currentCity, corpCode, compute} = this.state;
        const list = [{
                label: "参数名称",
                key: "scoreItemName",
                errorMessage: "请输入参数名称"
            },{
                label: "是否可计算",
                key: "compute",
                type: "radio",
                radioLabel: [
                    {
                        value: 1,
                        label: "是"
                    },
                    {
                        value: 0,
                        label: "否"
                    }]
            }
        ];
        return (
            <div className="add-param-container">
                {this.renderAlert()}
                <div className="container-title">
                    <Crumbs names={this.state.pathNames}/>
                </div>
                <div className="form-body">
                    <div className="form">
                        <span className="form-label">城市：</span>
                        <Dropdown
                            className="form-value"
                            onSelect={this.onSelectCity}
                            style={{height: "30px",lineHeight: "24px",width: "175px"}}
                            options={this.props.cities}
                            propsValue="cityCode"
                            placeholder="请选择城市"
                            value={currentCity.cityCode}
                            propsLabel="cityName"/>
                            <span className="form-message">* 请选择城市</span>
                    </div>
                    <div className="form">
                        <span className="form-label">公司：</span>
                        <Dropdown
                            className="form-value"
                            onSelect={this.onSelectCompnay}
                            style={{height: "30px",lineHeight: "24px", width: "175px"}}
                            options={currentCity.corps}
                            propsValue="corpCode"
                            placeholder="请选择公司"
                            propsLabel="corpName"
                            value={corpCode}/>
                            <span className="form-message">* 请选择公司</span>
                    </div>
                    {
                        list.map((item, index)=> {
                            return <div className="form" key={index}>
                                <span className="form-label">{item.label}：</span>
                                {
                                    item.type==="radio" ? (
                                        <div className="form-radio">
                                           {
                                               item.radioLabel.map((items, index)=> {
                                                   return (
                                                       <div className="radio-body" key={index}>
                                                           <input type="radio" defaultChecked={items.value == compute} onClick={this.changeRadio.bind(this)} name={item.key} value={items.value} />
                                                           <span className="radio-label">{items.label}</span>
                                                       </div>);
                                               })
                                           }
                                        </div>
                                    ) : (
                                        <Input
                                            className="form-value"
                                            inputType={item.inputType}
                                            changeRef={item.key}
                                            onChange={this.onChangeFunc}
                                            placeholder="0"
                                            inputStyle={{height: "30px", paddingLeft: "5px"}}
                                            value={this.state[item.key]}/>
                                    )
                                }

                                {item.errorMessage ? <span className="form-message">* {item.errorMessage}</span>  : ""}
                            </div>
                        })
                    }
                    <div className="form-button">
                        <Button value="提交" styleName="btn-middle" className="comfirm-view" onClick={this.comfirmFunc}/>
                        <Button value="取消" styleName="btn-middle-gray" onClick={this.cancelFunc}/>
                    </div>
                    <div className="form-tips">
                        <p>注意: 以*开头的选项为必填项.</p>
                    </div>

                </div>
            </div>
        )
    }
}

export default AddParam;
