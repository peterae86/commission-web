import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import Modal from '../../component/Modal/Modal';
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";

class FormulaList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "公式编码", key: "ruleAutoCode", textAlign: "center", width: "10%"},
                {name: "公式名称", key: "ruleName", textAlign: "center", width: "15%"},
                {name: "公式详情", key: "ruleDetail", textAlign: "center", width: "15%"},
                {name: "状态", key: "statusAlias", textAlign: "center", width: "10%"},
                {name: "备注（公式描述）", key: "ruleDesc", textAlign: "center", width: "15%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "35%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            window.open(`/#/score/formulaHistory?id=${this.state.table.listData[index].id}&historyLog=score`);
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
                                    label: "公式编码",
                                    key: "ruleAutoCode",
                                    value: obj.ruleAutoCode,
                                    readOnly: true
                                }, {
                                    label: "公式名称",
                                    key: "ruleName",
                                    value: obj.ruleName,
                                    inputType: "normal"
                                }, {
                                    label: "公式详情",
                                    key: "ruleDetail",
                                    value: obj.ruleDetail,
                                    rows: true,
                                    readOnly: true
                                }, {
                                    label: "状态",
                                    key: "statusAlias",
                                    value: obj.statusAlias,
                                    readOnly: true
                                }, {
                                    label: "备注（公式描述）",
                                    key: "ruleDesc",
                                    value: obj.ruleDesc,
                                    inputType: "normal"
                                }]
                            });
                        }
                    },
                    {
                        key: "启/停用",
                        func: (index) => {
                            const id =  this.state.table.listData[index].id;
                            const status = this.state.table.listData[index].status;
                            const message = status? "启用": "停用";
                            this.setState({
                                statusAlert: true,
                                id: id,
                                userforStatus: +!status,
                                message: `确定${message}这个公式么?`
                            });

                        }
                    },{
                        key: "删除",
                        func: (index) => {
                            if (!this.state.table.listData[index].status) {
                                this.setState({
                                    showConfirm: true,
                                    message: "有效状态的公式无法删除"
                                });
                                return false;
                            }
                            this.setState({
                                deleteAlert: true,
                                id: this.state.table.listData[index].id,
                                message: "确定删除这个公式么?"
                            });
                        }
                    }
                ]
                },
            ]
        };
        this.state.deleteAlert = false;
        this.state.id = "";
        this.state.statusAlert = false;
        this.state.userforStatus = 0;
        this.state.userCode = window.localStorage.getItem("userCode");
    }

    dealList (list) {
        let str = `${list.ruleLeftScoreDesc}=`;
        let strArra = [];
        list.paramItems.map((it, idx)=>{
            const symbol = {
                "ADD": "+",
                "MINUS": "-"
            }[it.symbolTag];
            strArra.push(`${symbol}${it.paramScoreDesc}*${(it.ratio*100).toFixed(2)}%`);
        });
        return  `${str}${strArra.join("").replace(/^\+/g,"")}`;
    }

    onQuery(p={}) {
        // const path = '/data/formulaList.json';
        const path = `/api/scoreRules/queryScoreRulesByCorpCode?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        requestByFetch(path, "GET").then((res) => {
            res.scoreRuleVos.map((item)=>{
                item["statusAlias"] = ["有效","无效"][item.status]
                item["ruleDetail"] = this.dealList(item);
            })
            this.setState({
                table: {
                    ...this.table,
                    listData: res.scoreRuleVos,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: +p.currentPage || 0,
                        totalCount: res.totalCount
                    }
                }
            });
        });
    }

    deleteRender() {
        const modalProps = {
            show: this.state.deleteAlert,
            message: this.state.message,
            type: 'confirm',
            onCancel: () => {
                this.setState({deleteAlert: false});
            },
            onConfirm: () =>{
                const path = `/api/scoreRules/deleteRuleById?id=${this.state.id}&userCode=${this.state.userCode}`; // 真正接口
                requestByFetch(path, 'GET').then((res) => {
                    this.setState({
                        deleteAlert: false,
                        showConfirm: true,
                        message: "删除成功"
                    });
                    this.onQuery(this.state.queryParams);
                });
            },
        };
        return <ModalAlert {...modalProps} />
    }
    statusRender() {
        const modalProps = {
            show: this.state.statusAlert,
            message: this.state.message,
            type: 'confirm',
            onCancel: () => {
                this.setState({statusAlert: false});
            },
            onConfirm: () =>{
                const path = `/api/scoreRules/updateStatusById?id=${this.state.id}&status=${this.state.userforStatus}&userCode=${this.state.userCode}`; // 真正接口
                requestByFetch(path, 'GET').then((res) => {
                this.setState({
                    statusAlert: false,
                    showConfirm: true,
                    message: "操作成功"
                });
                this.onQuery(this.state.queryParams);
                });
            },
        };
        return <ModalAlert {...modalProps} />
    }
    modifyRender () {
        const modal = {
            show: this.state.modifyModal,
            formData: this.state.formData,
            title: "修改积分计算公式",
            onCancel: () => {
                this.setState({modifyModal: false});
            },
            onConfirm: (queryData) => {
                const path = "/api/scoreRules/updateScoreRuleById"
                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                data["corpCode"] = this.state.queryParams.corpCode;
                data["scoreRuleName"] = data.ruleName;
                data["scoreRuleDesc"] = data.ruleDesc;
                data["userCode"] = this.state.userCode;

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
            {this.deleteRender()}
            {this.statusRender()}
            {this.modifyRender()}
            {super.render()}
            </div>
        )
    }
}

export default FormulaList;
