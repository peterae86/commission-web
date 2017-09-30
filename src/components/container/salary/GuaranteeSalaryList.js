import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";
import Modal from "../../component/Modal/Modal";

class GuaranteeSalaryList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "10%"},
                {name: "保障标准", key: "guaranteeStanderAmount", textAlign: "center", width: "18%"},
                {name: "担保0%保障上限", key: "guarantee0Amount", textAlign: "center", width: "18%"},
                {name: "担保50%保障上限", key: "guarantee50Amount", textAlign: "center", width: "18%"},
                {name: "担保100%保障上限", key: "guarantee100Amount", textAlign: "center", width: "18%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "18%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            this.props.onJump('?id=' + this.state.table.listData[index].id);
                            window.open(`/#/salary/guaranteeSalaryHistory?id=${this.state.table.listData[index].id}&historyLog=salary`);
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
                                    label: "保障标准",
                                    key: "guaranteeStanderAmount",
                                    value: obj.guaranteeStanderAmount,
                                },
                                    {
                                        label: "担保0%保障上限",
                                        key: "guarantee0Amount",
                                        value: obj.guarantee0Amount,
                                    }
                                    ,
                                    {
                                        label: "担保50%保障上限",
                                        key: "guarantee50Amount",
                                        value: obj.guarantee50Amount,
                                    }
                                    ,{
                                        label: "担保100%保障上限",
                                        key: "guarantee100Amount",
                                        value: obj.guarantee100Amount,
                                    }]
                            });
                        }
                    }
                ]
                },
            ]
        };
    }

    onQuery(p) {
        //const path = '/data/GuaranteeSalaryList.json';
        const path = `/api/dutyLevelRelatedInfo/queryDutyLevelGuaranteeSalaryInfoByCorpCode?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res.guaranteeConfigList,
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
            title: "修改保障薪资",
            onCancel: () => {
                this.setState({modifyModal: false});
            },
            onConfirm: (queryData) => {

                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                data["userCode"] = window.localStorage.getItem("userCode");
                //const path = "../data/rankUpdate.json";
                const path = `/api/dutyLevelRelatedInfo/updateDutyLevelGuaranteeSalaryInfoById`; // 真正接口
                requestByFetch(path, data).then((res) => {
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

export default GuaranteeSalaryList;
