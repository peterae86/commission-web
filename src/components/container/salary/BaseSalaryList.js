import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";
import Modal from "../../component/Modal/Modal";

class BaseSalaryList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "30%"},
                {name: "底薪", key: "baseSalaryAmount", textAlign: "center", width: "30%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "40%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            window.open(`/#/salary/baseSalaryHistory?id=${this.state.table.listData[index].id}&historyLog=salary`);
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
                                    label: "底薪",
                                    key: "baseSalaryAmount",
                                    value: obj.baseSalaryAmount,
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
        //const path = '/data/BaseSalary.json';
        const path = `/api/dutyLevelRelatedInfo/queryDutyLevelBaseSalaryByCorpCode?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        // hashHistory.push({
        //     ...this.props.location,
        //     query: p});
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res.baseSalaryConfigs,
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
                // const path = "../data/rankUpdate.json";
                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                const path = `/api/dutyLevelRelatedInfo/updateDutyLevelBaseSalaryInfoById`; // 真正接口
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

export default BaseSalaryList;
