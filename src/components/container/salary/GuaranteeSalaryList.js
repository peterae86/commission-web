import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";

class GuaranteeSalaryList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "职级", key: "dutyLevel", textAlign: "center", width: "20%"},
                {name: "保障标准", key: "guaranteeStanderAmount", textAlign: "center", width: "20%"},
                {name: "担保0%保障上限", key: "guarantee0Amount", textAlign: "center", width: "20%"},
                {name: "担保50%保障上限", key: "guarantee50Amount", textAlign: "center", width: "20%"},
                {name: "担保100%保障上限", key: "guarantee100Amount", textAlign: "center", width: "20%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "20%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            this.props.onJump('/salary/guaranteeSalaryHistory?id=' + this.state.table.listData[index].id);
                            console.log(index);
                        }
                    },
                    {
                        key: "修改",
                        func: (index) => {
                            console.log(index);
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
            this.setState({
                table: {
                    ...this.table,
                    listData: res.guaranteeConfigList,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: p.currentPage,
                        totalCount: res.totalCount
                    }
                }
            });
        });
    }

    render() {
        return super.render();
    }
}

export default GuaranteeSalaryList;

