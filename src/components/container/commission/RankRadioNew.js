import React from 'react';
import Table from '../../component/Table/Table';
import Crumbs from '../../component/Crumbs/Crumbs';
import Dropdown from '../../component/Dropdown/Dropdown';
import ModalAlert from "../../component/ModalAlert/ModalAlert";
import Modal from '../../component/Modal/Modal';
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import {hashHistory} from "react-router";
class RankRadioList extends React.Component {
    constructor(props) {
        super();
        const self = this;
        this.state = {
            //面包屑
            pathNames: props.pathNames,
            // 当前公司
            type: "",
            //搜索参数
            queryParams: {
                cityCode: "",
                corpCode: "",
                dutyScope: "",
                pageSize: 10, // 默认分页
                currentPage: 0, // 当前页码
                ...props.location.query
            },
            //表单数据
            queryFormData: {
                currentCity: {},
                corpCode: ''
            },
            //表格配置
            table: {
                listData: [], //数据列表
                config: {
                    column: [
                        {name: "职级", key: "dutyLevel", textAlign: "center", width: "25%"},
                        {name: "提佣系数（底薪）", key: "baseSalaryModelRatio", textAlign: "center", width: "25%", transform:(x)=>{return (x*100).toFixed(2)+'%'}},
                        {name: "提佣系数（双薪提成）", key: "doubleSalaryModelRatio", textAlign: "center", width: "25%", transform:(x)=>{return (x*100).toFixed(2)+'%'}},
                        {
                            name: "操作", key: "opt", textAlign: "center", width: "25%", content: [
                            {
                                key: "操作历史",

                                func: (index) => {
                                    //debugger
                                    window.open(`/#/commission/history?id=${this.state.table.listData[index].id}&historyLog=commission`);
                                }
                            },
                            {
                                key: "修改",
                                func: (index) => {
                                    const obj = this.state.table.listData[index];
                                    this.setState({
                                        modifyModal: true,
                                        formData: [{
                                            value: obj.id,
                                            key: "id",
                                        }, {
                                            label: "职级",
                                            key: "dutyLevel",
                                            value: obj.dutyLevel,
                                            readOnly: true
                                        }, {
                                            label: "提佣系数（底薪）%",
                                            key: "baseSalaryModelRatio",
                                            value: (obj.baseSalaryModelRatio*100).toFixed(2),
                                            inputType: "float"
                                        }, {
                                            label: "提佣系数（双薪提成）%",
                                            key: "doubleSalaryModelRatio",
                                            value: (obj.doubleSalaryModelRatio*100).toFixed(2),
                                            inputType: "float"
                                        }]
                                    });
                                }
                            }
                        ]
                        },
                    ]
                },
                pager: {
                    pageSize: 10,
                    clickPager: function (index) {
                        let p = {
                            ...self.state.queryParams,
                            currentPage: index
                        };

                        self.onQuery(p);
                    }
                }
            },
            showConfirm: false,
            modifyModal: false,
            modifyModalNew: false,
            message: "", // alert message
            formData: [],
        };
        this.onSelectCity = this.onSelectCity.bind(this);
        this.onSelectCompany = this.onSelectCompany.bind(this);
        this.onSelectScope = this.onSelectScope.bind(this);
        this.onQuery = this.onQuery.bind(this);
    }

    componentWillReceiveProps(newProps){
        if(newProps.cities){
            this.setState({
                    queryFormData: {
                        currentCity: newProps.cities.find(x=>x.cityCode===newProps.location.query.cityCode)||{},
                        corpCode: newProps.location.query.corpCode
                    }
                }
            )
        }
    }

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
            queryFormData: {
                corpCode:'',
                dutyScope: '',
                currentCity: this.props.cities.find(x => x.cityCode === value)
            },
            queryParams:{
                ...this.state.queryParams
            }
        });
    }
    // 选择所属序列回调
    onSelectScope (value) {
        this.setState({
            queryFormData: {
                ...this.state.queryFormData,
                dutyScope: value
            }
        });
        if (!this.state.queryFormData.corpCode) {
            this.setState({
                showConfirm: true,
                message: "请选择公司"
            });
            return false;
        }
        if (!value) {
            this.setState({
                showConfirm: true,
                message: "请选择所属序列"
            });
            return false;
        }
        const param = {
            ...this.state.queryParams,
            dutyScope: value
        };
        console.log(param);
        this.onQuery(param);
    }

    // 选择公司回调
    onSelectCompany(value) {
        this.setState({
            queryFormData: {
                ...this.state.queryFormData,
                corpCode: value
            },
            queryParams: {
                ...this.state.queryParams,
                corpCode: value
            }
        });

        if (this.state.queryFormData.dutyScope) { // 如果所属序列不为空,则直接查询接口
            const param = {
                ...this.state.queryParams,
                corpCode: value
            };
            this.onQuery(param);
        }

    }

    renderModify() {
        const modal = {
            show: this.state.modifyModal,
            formData: this.state.formData,
            title: "修改底薪",
            onCancel: () => {
                this.setState({modifyModal: false});
            },
            onConfirm: (queryData) => {
                let data = {};
                queryData.map((item) => {
                    if (item.key === "id" || item.key === "dutyLevel") {
                        data[item.key] = item.value;
                    } else {
                        data[item.key] = (item.value/100).toFixed(2);
                    }
                });
                data["userCode"]=window.localStorage.getItem("userCode");
                if (data.baseSalaryModelRatio < 0 || data.doubleSalaryModelRatio < 0) {
                    this.setState({
                        showConfirm: true,
                        message: "系数不能为负数",
                    });
                    return;
                }
                const path = `/api/dutyLevelCommission/updateById?${parseParamsGet(data)}`;
                requestByFetch(path, "GET").then((res) => {
                    this.setState({
                        modifyModal: false,
                        showConfirm: true,
                        message: "修改成功!"
                    });
                    this.onQuery(this.state.queryParams);
                });
            }
        };
        return <Modal {...modal} />
    }


    renderModifyNewAlert() {
        const modal = {
            show: this.state.modifyModalNew,
            formData: this.state.formData,
            title: "修改底薪",
            onCancel: () => {
                this.setState({modifyModalNew: false});
            },
            onConfirm: (queryData) => {
                let data = {};
                queryData.map((item) => {
                    if (item.key === "id" || item.key === "dutyLevel") {
                        data[item.key] = item.value;
                    }
                });
                data["specialCommissionRatioDetailConfigs"] = [];
                data.specialCommissionRatioDetailConfigs.push({
                    "yejiLevel": "0-15000",
                    "baseSalaryModelRatio": (queryData[2].value/100).toFixed(2)
                });
                data.specialCommissionRatioDetailConfigs.push({
                    "yejiLevel": "15001-26000",
                    "baseSalaryModelRatio": (queryData[3].value/100).toFixed(2)
                });
                data.specialCommissionRatioDetailConfigs.push({
                    "yejiLevel": "26001-38000",
                    "baseSalaryModelRatio": (queryData[4].value/100).toFixed(2)
                });
                data.specialCommissionRatioDetailConfigs.push({
                    "yejiLevel": "38001-51000",
                    "baseSalaryModelRatio": (queryData[5].value/100).toFixed(2)
                });
                data.specialCommissionRatioDetailConfigs.push({
                    "yejiLevel": "51001-65000",
                    "baseSalaryModelRatio": (queryData[6].value/100).toFixed(2)
                });
                data.specialCommissionRatioDetailConfigs.push({
                    "yejiLevel": "65001-",
                    "baseSalaryModelRatio": (queryData[7].value/100).toFixed(2)
                });

                data["corpCode"] = "yi_wu_feng_gong_si";
                data["userCode"]=window.localStorage.getItem("userCode");
                const path = `/api/dutyLevelCommission/updateSpecialCommissionRationConfig`;
                requestByFetch(path, data).then((res) => {
                    this.setState({
                        modifyModalNew: false,
                        showConfirm: true,
                        message: "修改成功!"
                    });
                    this.onQuery(this.state.queryParams);
                });
            }
        };
        return <Modal {...modal} />
    }

    renderModifyNew (index) {
        const obj = this.state.table.listData[index];
        this.setState({
            modifyModalNew: true,
            formData: [{
                value: obj.id,
                key: "id",
            }, {
                label: "职级",
                key: "dutyLevel",
                value: obj.dutyLevel,
                readOnly: true
            }, {
                label: "0-15000",
                key: "lv0",
                inputType: "float",
                value: obj.specialCommissionConfigs[0] ? obj.specialCommissionConfigs[0].baseSalaryModelRatio : 0
            },{
                label: "15001-26000",
                key: "lv15000",
                inputType: "float",
                value: obj.specialCommissionConfigs[1] ? obj.specialCommissionConfigs[1].baseSalaryModelRatio: 0
            },{
                label: "26001-38000",
                key: "lv26000",
                inputType: "float",
                value:obj.specialCommissionConfigs[2] ? obj.specialCommissionConfigs[2].baseSalaryModelRatio: 0
            },{
                label: "38001-51000",
                key: "lv38000",
                inputType: "float",
                value: obj.specialCommissionConfigs[3] ? obj.specialCommissionConfigs[3].baseSalaryModelRatio: 0
            },{
                label: "51001-65000",
                key: "lv51000",
                inputType: "float",
                value: obj.specialCommissionConfigs[4] ? obj.specialCommissionConfigs[4].baseSalaryModelRatio: 0
            },{
                label: "65000以上",
                key: "lv65000",
                inputType: "float",
                value: obj.specialCommissionConfigs[5]? obj.specialCommissionConfigs[5].baseSalaryModelRatio: 0
            }]
        });
    }

    // 搜索函数
    onQuery(p) {
        const path = p.corpCode === "yi_wu_feng_gong_si"? `/api/dutyLevelCommission/queryCommissionRatioConfigsByCorpCode?${parseParamsGet(p)}` : `/api/dutyLevelCommission/queryCommissionRatioConfigsByCorpCode?${parseParamsGet(p)}`; // 真正接口  两个城市走不同的接口
        this.setState({
            queryParams: p,
            type: p.corpCode
        });
        requestByFetch(path, "GET").then((res) => {
                this.setState({
                    table: {
                        ...this.state.table,
                        listData: res.commissionRatioVoList,
                        pager: {
                            ...this.state.table.pager,
                            currentPage: res.currentPage,
                            totalCount: res.totalCount
                        }
                    }
                });
        });
    }


    renderSearchInputs() {
        const {queryFormData} = this.state;
        return <div className="title-right">
            <div className="right-company">
                <span>城市：</span>
                <Dropdown onSelect={this.onSelectCity} options={this.props.cities}
                          placeholder="请选择城市" value={queryFormData.currentCity.cityCode} propsLabel="cityName" propsValue="cityCode"/>
            </div>
            <div className="right-company">
                <span>公司：</span>
                <Dropdown onSelect={this.onSelectCompany} options={queryFormData.currentCity.corps}
                          placeholder="请选择公司" propsLabel="corpName" propsValue="corpCode" value={queryFormData.corpCode}/>
            </div>
            <div className="right-company">
                <span>所属序列：</span>
                <Dropdown onSelect={this.onSelectScope} options={[{"label": "S序列","value": "S"},{"label": "P序列","value": "P"}]}
                          placeholder="全部" value={queryFormData.dutyScope}/>
            </div>
        </div>
    }
    renderPager() {
        let list = [];

        const {totalCount, currentPage, pageSize} = this.state.table.pager;
        const lenght = Math.ceil(totalCount / pageSize);
        let flag = true;
        for (let i = 0; i < lenght; i++) {

            if (lenght > 5) {
                if (i === 0 || i === (lenght - 1) || i === currentPage) {
                    list.push(<li key={i} className={currentPage === i ? "active" : ""}
                                  onClick={this.jumpToNumber.bind(this, i)}>{i + 1}</li>);
                    flag = true;
                } else if (i > currentPage - 3 && i < currentPage + 3) {
                    list.push(<li key={i} className={currentPage === i ? "active" : ""}
                                  onClick={this.jumpToNumber.bind(this, i)}>{i + 1}</li>);
                    flag = true;
                } else if (flag) {
                    list.push(<li key={i}>...</li>);
                    flag = false;
                } else {
                    continue;
                }
            }
            else {
                list.push(<li key={i} className={currentPage === i ? "active" : ""}
                              onClick={this.jumpToNumber.bind(this, i)}>{i + 1}</li>);
            }

        }
        return list;
    }
    jumpToBefor() {
        this.jumpTo(this.state.table.pager.currentPage - 1);
    }

    jumpToNext() {
        this.jumpTo(this.state.table.pager.currentPage + 1);
    }

    jumpTo(index) {
        this.state.table.pager.clickPager(index);
    }

    jumpToNumber(index) {
        this.jumpTo(index);
    }


    gotoHistory (index) {
        window.open(`/#/commission/history?id=${this.state.table.listData[index].id}&historyLog=commission`);
    }

    render() {
        const {table, pathNames, modifyModal} = this.state;
        const pager = this.state.table.pager;
        return (
            <div className="rank-container">
                {this.renderAlert()}
                {this.renderModifyNewAlert()}
                <div className="container-title">
                    <Crumbs names={pathNames}/>
                    {this.renderSearchInputs()}
                </div>
                {
                    this.state.type== "yi_wu_feng_gong_si" ? (
                        <div>
                            <ul className="table-container">
                                <li className="container-header">
                                    <div className="header-item flex" style={{width: "10%"}}>职级</div>
                                    <div className="header-item yiwu" style={{width: "80%"}}>
                                        <div style={{marginBottom: "20px", color: "#000"}}>业绩提佣系数</div>
                                        <div className="yiwu-item"><span>0-15000</span><span>15001-26000</span><span>26001-38000</span><span>38001-51000</span><span>51001-65000</span><span>65000以上</span></div>
                                    </div>
                                    <div className="header-item flex" style={{width: "10%"}}>操作</div>
                                </li>
                                {
                                    table.listData.length > 0 ? table.listData.map((item, index) => {
                                        return <li className="container-list" key={index}>
                                            <div className="list-item" style={{width: "10%"}}>{item.dutyLevel}</div>
                                            <div  className="list-item yiwu-item" style={{width: "80%"}}>
                                                {item.specialCommissionConfigs.map((ie, indexs)=> {
                                                    return <span>{(ie.baseSalaryModelRatio*100).toFixed(2)}%</span>
                                                })}
                                            </div>
                                            <div className="list-opt yiwu-opt list-item" style={{width: "10%"}}><span onClick={this.gotoHistory.bind(this, index)}>操作历史</span><span onClick={this.renderModifyNew.bind(this, index)}>修改?</span></div>
                                        </li>
                                    }) : (<p className="table-empty">暂无数据</p>)
                                }
                            </ul>
                            <ul className="pager-container">
                                {
                                    (pager.currentPage !== 0 && Math.ceil(pager.totalCount / pager.pageSize) > 1) ? (
                                        <li className="upstairs" onClick={this.jumpToBefor}>上一页</li>) : null
                                }
                                {
                                    this.renderPager()
                                }
                                {

                                    pager.currentPage < Math.ceil(pager.totalCount / pager.pageSize)-1 ? (
                                        <li className="upstairs" onClick={this.jumpToNext}>下一页</li>) : null
                                }
                            </ul>
                        </div>
                    ) : (<Table data={table.listData} config={table.config} pager={table.pager}/>)
                }

            </div>
        );
    }
}

export default RankRadioList;
