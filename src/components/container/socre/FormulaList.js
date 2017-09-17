import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import {requestByFetch} from "../../../utils/request";
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
                        }
                    },
                    {
                        key: "启/停用",
                        func: (index) => {
                        }
                    },{
                        key: "删除",
                        func: (index) => {
                            this.setState({
                                deleteAlert: true,
                                deleteId: this.state.table.listData[index].id,
                                message: "确定删除这个公式么"
                            });
                        }
                    }
                ]
                },
            ]
        };
        this.state.deleteAlert = false;
        this.state.deleteId = "";
    }

    componentWillMount() {
        this.onQuery()
    }

    onQuery(p={corpCode:this.state.corpCode, currentPage: this.state.currentPage, pageSize: this.state.pageSize}) {
        const path = '/data/formulaList.json';
        //    const paths = `/scoreRules/queryScoreRulesByCorpCode`; // 真正接口
        this.setState({
            queryParams: p
        });
        console.log(this.state.queryParams);
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
                        currentPage: p.currentPage || 0,
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
                this.setState({showConfirm: false});
            },
            onConfirm: () => {
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
            },
        };
        return <ModalAlert {...modalProps} />
    }

    render() {
        return (
            <div>
            {this.deleteRender()}
            {super.render()}
            </div>
        )
    }
}

export default FormulaList;
