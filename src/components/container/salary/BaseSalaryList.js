import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";
import Modal from "../../component/Modal/Modal";

class BaseSalaryList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "20%"},
                {name: "底薪", key: "baseSalaryAmount", textAlign: "center", width: "20%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "20%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            this.props.onJump('/salary/baseSalaryHistory?id=' + this.state.table.listData[index].id);
                            console.log(index);
                        }
                    },
                    {
                        key: "修改",
                        func: (index) => {
                            this.setState({
                                modifyModal: true,
                                formData: [{
                                    label: "职级 ",
                                    value: "333"
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
        const path = '/data/BaseSalary.json';
        //    const paths = `/dutyLevelRelatedInfo/queryDutyLevelBaseSalaryByCorpCode?${parseParamsGet(param)}`; // 真正接口
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
                    listData: res.baseSalaryConfigs,
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
            formData: this.state.formData
        };
        return <Modal {...modal} />
    }

    render() {
        return super.render();
    }
}

export default BaseSalaryList;

