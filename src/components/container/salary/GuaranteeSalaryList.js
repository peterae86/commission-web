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
                {name: "公式编码", key: "userCode", textAlign: "center", width: "20%"},
                {name: "公式名称", key: "userName", textAlign: "center", width: "20%"},
                {name: "公式详情", key: "operateType", textAlign: "center", width: "20%"},
                {name: "状态", key: "userName", textAlign: "center", width: "20%"},
                {name: "备注（公式描述）", key: "operateType", textAlign: "center", width: "20%"},
                {
                    name: "操作", key: "opt", textAlign: "center", width: "20%", content: [
                    {
                        key: "操作历史",

                        func: (index) => {
                            this.props.onJump('/score/formulaHistory?id=' + this.state.table.listData[index].id);
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
        const path = '/data/formulaList.json';
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

    render() {
        return super.render();
    }
}

export default GuaranteeSalaryList;

