import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import Button from '../../component/Button/Button';
import {requestByFetch} from "../../../utils/request";
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import {hashHistory} from "react-router";

const defaultObj = {
   "paramScoreKey": "",
   "paramScoreDesc": "",
   "symbolTag": "ADD", //左边的式子是加还是减
   "ratio": "", // 中间input参数
   "computeType": "" // 右边参数是否可计算 根据下拉框来决定
};
class AddFormula extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: props.pathNames,
            corpCode: "", // 城市公司下编码
            currentCity:{},
            paramList: [],   //
            allParamList: [],
            showConfirm: false,
            message: "", // alert message
            ruleName: "", // 公式名称
            ruleDesc: "",
            scoreKey: "", //左边的
            parametersTemp: [],
            parameters:[defaultObj], // 一共有几个积分公式
            paramScoreCount: 1,
            symbolTag: "ADD",
            paramScoreKey:"", // 参数
            paramScoreDesc: "", //公式0的参数1的描述
            ruleLeftScoreKey: "", //"等式左边的积分参数
            ruleLeftScoreDesc: "" //等式左边的积分参数描述
        }
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompnay = this.onSelectCompnay.bind(this);
        this.onSelectIcon = this.onSelectIcon.bind(this);// 选择运算符
        this.onSelectLeft = this.onSelectLeft.bind(this);
        this.onSelectRight = this.onSelectRight.bind(this);
        this.itemAddRender = this.itemAddRender.bind(this);
        this.changeRatio = this.changeRatio.bind(this);
        // this.comfirmFunc = this.comfirmFunc.bind(this);
        // this.cancelFunc = this.cancelFunc.bind(this);
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
        this.getParam({corpCode:value}) //获取可计算的参数
    }
    onSelectIcon (value) {
        this.setState({
            symbolTag: value
        });
    }

    onSelectLeft (value, label){
        this.setState({
            ruleLeftScoreKey: value,
            ruleLeftScoreDesc: label
        });
    }
    onSelectRight (value, label) { //onSelect={this.onSelectRight}
        this.setState({
            paramScoreKey: value,
            paramScoreeDesc: label
        });
    }

    changeRatio(value) {
        this.setState({
            ratio: value
        });
    }

    getParam (p={}) {
        //获取所有的 参数列表
        const path = '/data/paramList.json';
        //    const paths = `/scoreRules/queryScoreItemsByCorpCode?${parseParamsGet(p)}`; // 真正接口

        requestByFetch(path, "GET").then((res) => {
            let computableArray = [];
            res.map((item)=> {
                if (item.computable === "COMPUTABLE") {
                    computableArray.push(item);
                }
            });
            this.setState({
                allParamList:res,
                paramList: computableArray
            });
        });
    }

    itemAddRender() {
        // let newArray = [...this.state.parametersTemp];
        // let newparam = [...this.state.parameters];
        // newArray.push(tempList);
        // newparam.push(defaultObj);
        // this.setState({
        //     parametersTemp: newArray,
        //     parameters: newparam
        // });
    }

    render() {
        const {currentCity, corpCode, compute, ruleName, ruleDesc, paramList, allParamList, parameters ,symbolTag, paramScoreKey,ratio, ruleLeftScoreKey} = this.state;
        const style = {height: "30px",lineHeight: "24px"};
        const options =[{value:"ADD",label:"+"},{value:"MINUS",label:"-"}]
        return (
            <div className="add-formula-container">
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
                    </div>
                </div>
                <div className="form-body formula">
                    <div className="form">
                        <span className="form-label">公式名称：</span>
                        <Input
                            className="form-value"
                            placeholder="请输入公式名称"
                            inputStyle={{height: "30px", paddingLeft: "5px"}}
                            value={ruleName}/>
                    </div>
                    <div className="form">
                        <span className="form-label">公式描述：</span>
                        <textarea
                            className="form-value"
                            rows="4"
                            cols="50"
                            placeholder="请输入公式描述"
                            value={ruleDesc} />
                    </div>
                </div>
                <p  className="form-tips">公式配置：</p>
                <div className="form-body formula">
                    <div className="form-row">
                        <span className="form-label">计算参数</span>
                        <Dropdown
                            className="form-value"
                            style={{height: "30px",lineHeight: "24px"}}
                            options={this.state.paramList}
                            onSelect={this.onSelectLeft}
                            propsValue="scoreItemKey"
                            value={ruleLeftScoreKey}
                            propsLabel="scoreItemName"/>
                    </div>
                    <p className="form-icon">=</p>
                    <div className="caculate-block">
                        <div className="form-row">
                            <span className="form-label">参数运算符</span>
                            <Dropdown
                                className="form-value"
                                style={style}
                                onSelect={this.onSelectIcon}
                                options={options}
                                defaultOption={options[0]}
                                value={symbolTag}/>
                        </div>
                        <div className="form-row">
                            <span className="form-label">参数系数</span>
                            <Input
                                className="form-value"
                                inputStyle={{height: "30px", paddingLeft: "5px",width: "100px"}}
                                inputType="float"
                                onChange={this.changeRatio}
                                value={ratio}/>
                        </div>
                        <p className="form-icon">x</p>
                        <div className="form-row">
                            <span className="form-label">参数</span>
                            <Dropdown
                                className="form-value"
                                style={style}
                                onSelect={this.onSelectRight}
                                options={allParamList}
                                propsValue="scoreItemKey"
                                propsLabel="scoreItemName"
                                value={paramScoreKey}/>
                        </div>
                        <div className="form-row form-show">
                            <span className="form-label">公式展示：</span>
                            <textarea
                                className="form-value"
                                rows="4"
                                cols="50"
                                readOnly
                                placeholder="请选择"
                                value={ruleDesc} />
                        </div>
                    </div>
                    <p className="add-new-param" onClick={this.itemAddRender}>㊉ 参数配置</p>
                </div>
                <div className="form-button">
                    <Button value="提交" styleName="btn-middle" className="comfirm-view" onClick={this.comfirmFunc}/>
                    <Button value="取消" styleName="btn-middle-gray" onClick={this.cancelFunc}/>
                </div>
            </div>
        )
    }
}

export default AddFormula;
