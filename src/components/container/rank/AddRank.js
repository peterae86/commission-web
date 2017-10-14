import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import Button from '../../component/Button/Button';
import {requestByFetch} from "../../../utils/request";
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import {hashHistory} from "react-router";

class AddRank extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: props.pathNames,
            corpCode: "", // 城市公司下编码
            showConfirm: false,
            message: "", // alert message
            currentCity: {},
            dutyScope: "",
            dutyLevel: "",
            minScore: "",
            maxScore: "",
            baseScore: "",
            masterScoreRatio: "",
            masterCommissionRatio: ""
        }
        this.onChangeFunc = this.onChangeFunc.bind(this);
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompnay = this.onSelectCompnay.bind(this);
        this.comfirmFunc = this.comfirmFunc.bind(this);
        this.cancelFunc = this.cancelFunc.bind(this);
    }

    //修改input 值
    onChangeFunc(value, key) {
        if (key === "dutyScope" || key === "dutyLevel") {
            this.setState({
                [key]: value.toUpperCase()
            });
        } else {
            this.setState({
                [key]: value
            });
        }

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

    comfirmFunc() {
        const {currentCity, corpCode, dutyScope, dutyLevel, minScore, maxScore, baseScore, masterScoreRatio, masterCommissionRatio} = this.state;
        if (!currentCity.cityCode || !corpCode) {
            this.setState({
                showConfirm: true,
                message: "请选择城市和公司!"
            });
            return false;
        }
        if (!dutyScope || !dutyLevel) {
            this.setState({
                showConfirm: true,
                message: "请填写完整所属序列和职级!"
            });
            return false;
        }
        if (maxScore&&+maxScore <= +minScore) {
            this.setState({
                showConfirm: true,
                message: "职级积分上限必须大于职级积分下限!"
            });
            return false;
        }
        const param = {
            corpCode: corpCode,
            dutyScope: dutyScope,
            dutyLevel: dutyLevel,
            minScore: minScore,
            maxScore: maxScore,
            baseScore: baseScore,
            masterScoreRatio: masterScoreRatio/100,
            masterCommissionRatio: masterCommissionRatio/100
        };

        //    const path = "../data/newRank.json";
        const path = "/api/dutyLevelConfig/addNew";
        requestByFetch(path, param).then((res) => {
            this.setState({
                showConfirm: true,
                message: "新增成功"
            });
            setTimeout(() => {
                this.setState({
                    showConfirm: false,
                    message: ""
                });
                this.props.onJump('/rank');
            }, 700);
        });

    }

    cancelFunc() {
        this.props.onJump('/rank');
    }


    render() {
        const {currentCity, corpCode, dutyScope, dutyLevel, minScore, maxScore, baseScore, masterScoreRatio, masterCommissionRatio} = this.state;
        const list = [{
            label: "所属序列",
            key: "dutyScope",
            inputType: "numeric",
            errorMessage: "* 请输入所属序列. 例如 A"
        }, {
            label: "职级",
            key: "dutyLevel",
            inputType: "numeric",
            errorMessage: "* 请输入职级.例如 A1"
        },
            {
                label: "职级积分下限",
                key: "minScore",
                inputType: "digital"
            }, {
                label: "职级积分上限",
                key: "maxScore",
                inputType: "digital"
            }, {
                label: "职级基础分",
                key: "baseScore",
                inputType: "digital"
            }, {
                label: "师徒制积分贡献比例",
                key: "masterScoreRatio",
                inputType: "float",
                errorMessage:"（%）"
            }, {
                label: "师徒制提佣积分贡献系数",
                key: "masterCommissionRatio",
                inputType: "float",
                errorMessage:"（%）"
            }
        ];
        return (
            <div className="add-container">
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
                            style={{height: "30px", lineHeight: "24px", width: "175px"}}
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
                            style={{height: "30px", lineHeight: "24px", width: "175px"}}
                            options={currentCity.corps}
                            propsValue="corpCode"
                            placeholder="请选择公司"
                            propsLabel="corpName"
                            value={corpCode}/>
                        <span className="form-message">* 请选择公司</span>
                    </div>
                    {
                        list.map((item, index) => {
                            return <div className="form" key={index}>
                                <span className="form-label">{item.label}：</span>
                                <Input
                                    className="form-value"
                                    inputType={item.inputType}
                                    changeRef={item.key}
                                    onChange={this.onChangeFunc}
                                    placeholder={["dutyLevel", "dutyScope"].indexOf(item.key) !== -1 ? "" : "0"}
                                    inputStyle={{height: "30px", paddingLeft: "5px"}}
                                    value={this.state[item.key]}/>

                                {item.errorMessage ? <span className="form-message">{item.errorMessage}</span> : ""}
                            </div>
                        })
                    }
                    <div className="form-button">
                        <Button value="提交" styleName="btn-small" className="comfirm-view" onClick={this.comfirmFunc}/>
                        <Button value="取消" styleName="btn-small-gray" onClick={this.cancelFunc}/>
                    </div>
                    <div className="form-tips">
                        <p>注意: 以*开头的选项为必填项.</p>
                    </div>

                </div>
            </div>
        )
    }
}

export default AddRank;
