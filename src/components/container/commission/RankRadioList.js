import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import ListPage from "../ListPage1";
import {hashHistory} from "react-router";
import Modal from "../../component/Modal/Modal";

class RankRadioList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
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
        }
    }
    onQuery(p) {
        // const path = '/data/commission.json';
        const path = `/api/dutyLevelCommission/queryCommissionRatioConfigsByCorpCode?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
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
                // const path = "../data/rankUpdate.json";
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

    render() {
        return (
            <div>
                {this.renderModify()}
                {super.render()}
            </div>
        )
    }
}

export default RankRadioList;
