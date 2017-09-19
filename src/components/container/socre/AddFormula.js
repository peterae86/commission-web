import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import Button from '../../component/Button/Button';
import {requestByFetch} from "../../../utils/request";
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import {hashHistory} from "react-router";

class AddFormula extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: props.pathNames,
            corpCode: "", // 城市公司下编码
            currentCity:{},
            operator:[{value:"ADD",label:"+"},{value:"MINUS",label:"-"}],
            paramList: [],
            allParamList: [],
            showConfirm: false,
            message: "", // alert message
            ruleName: "", // 公式名称
            ruleDesc: "",
            optIcon: "",
            scoreItemKey: "",
            parameters:[], // 一共有几个积分公式
            paramScoreCount: 1,
            tmpStr: [], // 新增加的参数
        }
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompnay = this.onSelectCompnay.bind(this);
        this.onSelectIcon = this.onSelectIcon.bind(this);// 选择运算符
        this.itemRender = this.itemRender.bind(this);
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
            optIcon: value
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

    // comfirmFunc () {
    //     const path = "../data/newRank.json";
    //     //const path = "/scoreRules/addNewScoreItem"; 真实路径
    //     const {currentCity, corpCode, scoreItemName, compute} = this.state;
    //     if (!currentCity.cityCode || !corpCode) {
    //         this.setState({
    //             showConfirm: true,
    //             message: "请选择城市和公司!"
    //         });
    //         return false;
    //     }
    //     if (!scoreItemName) {
    //         this.setState({
    //             showConfirm: true,
    //             message: "请输入参数名称!"
    //         });
    //         return false;
    //     }
    //     const param = {
    //         cityCode:currentCity.cityCode,
    //         corpCode: corpCode,
    //         scoreItemName: scoreItemName,
    //         computeType: ["NON_COMPUTABLE","COMPUTABLE"][compute]
    //     };
    //     this.setState({
    //         showConfirm: true,
    //         message: "新增成功"
    //     });
    //     setTimeout(()=> {
    //         this.setState({
    //             showConfirm: false,
    //             message: ""
    //         });
    //         this.props.onJump('/score/paramList');
    //     }, 700);
    // }
    // cancelFunc () {
    //     this.props.onJump('/score/paramList');
    // }
    itemRender() {
        const {currentCity, corpCode, compute, ruleName, ruleDesc, optIcon, paramList,operator,paramScoreCount} = this.state;
        const list = [{
            label: "参数运算符",
            value: optIcon,
            type: "dropdown",
            onSelect: this.onSelectIcon,
            options: operator,
            style: {height: "30px",lineHeight: "24px"}
        },{
            label: "参数运算符",
            value: optIcon,
            type: "dropdown",
            onSelect: this.onSelectIcon,
            options: operator,
            style: {height: "30px",lineHeight: "24px"}
        },{
            label: "参数运算符",
            value: optIcon,
            type: "dropdown",
            onSelect: this.onSelectIcon,
            options: operator,
            style: {height: "30px",lineHeight: "24px"}
        }];

        let temp = [...this.state.tmpStr];
        list.map((item, index)=>{
            temp.push(
                <div className="form-row" key={Math.random().toString(36).substr(2)}>
                    <span className="form-label">{item.label}</span>
                    <Dropdown
                        className="form-value"
                        style={item.style}
                        onSelect={item.onSelect}
                        options={item.options}
                        value={item.value}/>
                </div>
            );
        });
        this.setState({
            tmpStr: temp,
            paramScoreCount: this.state.paramScoreCount++,
        });
    }

    render() {
        const {currentCity, corpCode, compute, ruleName, ruleDesc, optIcon, paramList, tmpStr} = this.state;

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
                            propsValue="scoreItemKey"
                            value={currentCity.cityCode}
                            propsLabel="scoreItemName"/>
                    </div>
                    <p className="form-icon">=</p>
                    <div className="caculate-block">
                        <div className="form-row">
                            <span className="form-label">参数系数</span>
                            <Input
                                className="form-value"
                                inputStyle={{height: "30px", paddingLeft: "5px",width: "60px"}}
                                value={ruleName}/>
                        </div>
                        <p className="form-icon">x</p>
                        <div className="form-row">
                            <span className="form-label">参数</span>
                            <Dropdown
                                className="form-value"
                                style={{height: "30px",lineHeight: "24px"}}
                                options={this.state.allParamList}
                                propsValue="scoreItemKey"
                                value={currentCity.cityCode}
                                propsLabel="scoreItemName"/>
                        </div>
                    </div>
                    <div className="caculate-block">
                    {
                        tmpStr.map((item, index)=> {
                            return item
                        })
                    }
                    </div>

                    <p className="add-new-param" onClick={this.itemRender}>㊉ 参数配置</p>
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
