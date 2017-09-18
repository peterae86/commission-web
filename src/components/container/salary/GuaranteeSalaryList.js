import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
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
                            this.props.onJump('/salary/guaranteeSalaryHistory?id=' + this.state.table.listData[index].id);
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

    componentWillMount() {
        this.onQuery({})
    }

    onQuery(p) {
        const path = '/data/GuaranteeSalaryList.json';
        //    const paths = `/dutyLevelRelatedInfo/queryDutyLevelGuaranteeSalaryInfoByCorpCode?${parseParamsGet(param)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        hashHistory.push({
            ...this.props.location,
            query: p});
        requestByFetch(path, "GET").then((res) => {
            debugger
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
                const path = "../data/rankUpdate.json";
                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                this.setState({
                    modifyModal: false,
                    showConfirm: true,
                    message: "修改成功!"
                });
                this.onQuery(this.state.queryParams);

                //    const paths = `/dutyLevelConfig/updateInfoById`; // 真正接口
                // requestByFetch(path, data).then((res) => {
                // this.setState({
                //     modifyModal: false
                //     showConfirm: true,
                //     message: "修改成功!"
                // });
                // });
            }
        };
        return <Modal {...modal} />
    }


    render() {
        return super.render();
    }
}

export default GuaranteeSalaryList;
