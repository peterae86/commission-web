import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
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
                            this.props.onJump('/score/paramHistory?id=' + this.state.table.listData[index].id);
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
                                    value: obj.scoreItemName
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

    componentWillMount() {
        this.onQuery()
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
                const path = "../data/rankUpdate.json";
                let data = {};
                queryData.map((item) => {
                    data[item.key] = item.value;
                });
                data["computable"] = !(+data.compute) ? "NON_COMPUTABLE" : "COMPUTABLE";
                data["corpCode"] =  this.state.corpCode;
                this.setState({
                    modifyModal: false,
                    showConfirm: true,
                    message: "修改成功!"
                });
                const param = {
                    corpCode: this.state.corpCode,
                    currentPage: this.state.currentPage
                };
                this.onQuery(param);

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

    onQuery(p={}) {
        const path = '/data/paramList.json';
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        hashHistory.push({
            ...this.props.location,
            query: p
        });
        requestByFetch(path, "GET").then((res) => {
            res.map((item)=> {
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
                    listData: res,
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
