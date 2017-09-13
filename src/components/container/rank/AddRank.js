import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
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
            currentCity:{},
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
    }

    componentWillMount() {
        // this.onQuery({})
    }
    //修改input 值
    onChangeFunc(value, key) {
        console.log(value, key);
    }
    // 渲染碳层
    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'alert',
            cancelClick: () => {
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
                message: "请选择公司"
            });
            return false;
        }
    }


    onQuery(p) {

        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res.baseSalaryConfigs,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: p.currentPage,
                        totalCount: res.totalCount
                    }
                }
            });
        });
    }

    render() {
        const {currentCity, corpCode, dutyScope, dutyLevel, minScore, maxScore, baseScore, masterScoreRatio, masterCommissionRatio} = this.state;
        const list = [{
                label: "所属序列",
                key: "dutyScope",
                inputType: "digital",
                errorMessage: "请输入所属序列"
            },{
                label: "职级",
                key: "dutyLevel",
                inputType: "digital",
                errorMessage: "请输入职级"
            },
            {
                label: "职级积分下线",
                key: "minScore",
                inputType: "digital"
            },{
                label: "职级积分上线",
                key: "maxScore",
                inputType: "digital"
            },{
                label: "职级基础分",
                key: "baseScore",
                inputType: "digital"
            },{
                label: "师徒制积分贡献比例",
                key: "masterScoreRatio",
                inputType: "float"
            },{
                label: "师徒制提佣积分贡献系数",
                key: "masterCommissionRatio",
                inputType: "float"
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
                            style={{height: "30px",lineHeight: "24px",width: "130px"}}
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
                            style={{height: "30px",lineHeight: "24px", width: "130px"}}
                            options={currentCity.corps}
                            propsValue="corpCode"
                            placeholder="请选择公司"
                            propsLabel="corpName"
                            value={corpCode}/>
                    </div>
                    {
                        list.map((item, index)=> {
                            console.log();
                            return <div className="form" key={index}>
                                <span className="form-label">{item.label}：</span>
                                <Input
                                    className="form-value"
                                    inputType={item.inputType}
                                    changeRef={item.key}
                                    onChange={this.onChangeFunc}
                                    placeholder="0"
                                    inputStyle={{height: "30px", paddingLeft: "5px"}}
                                    value={this.state[item.key]}/>

                                {item.errorMessage ? <span>* {item.errorMessage}</span>  : ""}
                            </div>
                        })
                    }

                </div>
            </div>
        )
    }
}

export default AddRank;
