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
                {name: "公式编码", key: "id", textAlign: "center", width: "10%"},
                {name: "公式名称", key: "ruleName", textAlign: "center", width: "15%"},
                {name: "公式详情", key: "ruleDesc", textAlign: "center", width: "15%"},
                {name: "状态", key: "statusAlias", textAlign: "center", width: "10%"},
                {name: "备注（公式描述）", key: "ruleDesc", textAlign: "center", width: "20%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "30%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            this.props.onJump('/score/formulaHistory?id=' + this.state.table.listData[index].id);
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
                                    key: "id",
                                    value: obj.id,
                                    readOnly: true
                                }, {
                                    label: "公式名称",
                                    key: "ruleName",
                                    value: obj.ruleName,
                                    inputType: "normal"
                                }, {
                                    label: "公式详情",
                                    key: "ruleDescs",
                                    value: obj.ruleDescs,
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
                                useforId: id,
                                userforStatus: +!status,
                                message: `确定${message}这个公式么?`
                            });

                        }
                    },{
                        key: "删除",
                        func: (index) => {
                            this.setState({
                                deleteAlert: true,
                                useforId: this.state.table.listData[index].id,
                                message: "确定删除这个公式么?"
                            });
                        }
                    }
                ]
                },
            ]
        };
        this.state.deleteAlert = false;
        this.state.useforId = "";
        this.state.statusAlert = false;
        this.state.userforStatus = 0;
    }

    onQuery(p={}) {
        // const path = '/data/formulaList.json';
        const path = `/api/scoreRules/queryScoreRulesByCorpCode?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        hashHistory.push({
            ...this.props.location,
            query: p});
        requestByFetch(path, "GET").then((res) => {
            res.list.map((item)=>{
                item["statusAlias"] = ["有效","无效"][item.status]
            })
            this.setState({
                table: {
                    ...this.table,
                    listData: res.list,
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

                //    const paths = `/scoreRules/deleteRuleById?id=${this.state.useforId}`; // 真正接口
                // requestByFetch(path, 'GET').then((res) => {
                this.setState({
                    deleteAlert: false,
                    showConfirm: true,
                    message: "删除成功"
                });
                setTimeout(()=> {
                    this.setState({
                        showConfirm: false,
                        message: ""
                    });
                    this.onQuery();
                }, 700);
                // });
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
                //    const paths = `/scoreRules/updateStatusById?id=${this.state.deleteId}&=${this.state.userforStatus}`; // 真正接口
                // requestByFetch(path, 'GET').then((res) => {
                this.setState({
                    statusAlert: false,
                    showConfirm: true,
                    message: "操作成功"
                });
                setTimeout(()=> {
                    this.setState({
                        showConfirm: false,
                        message: ""
                    });
                    this.onQuery();
                }, 700);
                // });
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
                console.log(this.state.queryParams);
                const path = "../data/rankUpdate.json";
                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                data["corpCode"] = this.state.queryParams.corpCode;
                data["scoreRuleName"] = data.ruleName;
                data["scoreRuleDesc"] = data.ruleDesc;

                //const paths = `/scoreRules/updateScoreRuleById?${parseParamsGet(data)`; // 真正接口
                // requestByFetch(path, data).then((res) => {
                this.setState({
                    modifyModal: false,
                    showConfirm: true,
                    message: "修改成功!"
                });
                this.onQuery();
                // });
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
