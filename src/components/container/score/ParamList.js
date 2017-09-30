import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import ListPage from "../ListPage";
import Modal from '../../component/Modal/Modal';
import {hashHistory} from "react-router";

class ParamList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "参数编码", key: "scoreItemKey", textAlign: "center", width: "25%"},
                {name: "参数名称", key: "scoreItemName", textAlign: "center", width: "25%"},
                {name: "是否可计算", key: "computeAlias", textAlign: "center", width: "25%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "25%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            window.open(`/#/score/paramHistory?id=${this.state.listData[index].id}&historyLog=score`);
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
                                    label: "参数名称",
                                    key: "scoreItemName",
                                    value: obj.scoreItemName,
                                    inputType: "normal"
                                }, {
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
                                        }],
                                    value: obj.compute
                                }]
                            });
                        }
                    }
                ]
                },
            ]
        };
        this.state.table.pager = {}
    }

    renderModify() {
        const modal = {
            show: this.state.modifyModal,
            formData: this.state.formData,
            title: "修改参数",
            onCancel: () => {
                this.setState({modifyModal: false});
            },
            onConfirm: (queryData) => {
                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                data["computeType"] = !(+data.compute) ? "NON_COMPUTABLE" : "COMPUTABLE";
                data["corpCode"] =  this.state.queryParams.corpCode;

                const path = `/api/scoreRules/updateScoreItemById`; // 真正接口
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

    onQuery(param={}) {
        const p = {
            ...param,
            computable: null,
        }
        const path = `/api/scoreRules/queryScoreItemsByCorpCode?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        requestByFetch(path, "GET").then((res) => {
            res.scoreItemVos.map((item)=> {
                item["compute"] = {
                    "COMPUTABLE": 1,
                    "NON_COMPUTABLE": 0
                }[item.computable]
                item["computeAlias"] = {
                    "COMPUTABLE": "是",
                    "NON_COMPUTABLE": "否"
                }[item.computable]
            });
            this.setState({
                table: {
                    ...this.table,
                    listData: res.scoreItemVos,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: res.currentPage,
                        totalCount: res.totalCount
                    }
                }
            });
        });
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

export default ParamList;
