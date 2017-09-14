import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";
import Modal from "../../component/Modal/Modal";

class RankRadioList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "20%"},
                {name: "提佣系数（底薪）", key: "baseSalaryModelRatio", textAlign: "center", width: "20%"},
                {name: "提佣系数（双薪提成）", key: "doubleSalaryModelRatio", textAlign: "center", width: "20%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "20%", content: [
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
                                    label: "职级",
                                    key: "dutyLevel",
                                    value: obj.dutyLevel,
                                    readOnly: true
                                }, {
                                    label: "提佣系数（底薪）",
                                    key: "baseSalaryModelRatio",
                                    value: obj.baseSalaryModelRatio,
                                }, {
                                    label: "提佣系数（双薪提成）",
                                    key: "doubleSalaryModelRatio",
                                    value: obj.doubleSalaryModelRatio,
                                }]
                            });
                        }
                    }
                ]
                },
            ]
        }
    }

    componentWillMount() {
        this.onQuery({})
    }

    onQuery(p) {
        const path = '/data/commission.json';
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        hashHistory.push({
            ...this.props.location,
            query: p});
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res.commissionRatioVoList,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: p.currentPage,
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

export default RankRadioList;
