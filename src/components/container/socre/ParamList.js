import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
import ListPage from "../ListPage";
import {hashHistory} from "react-router";

class ParamList extends ListPage {
    constructor(props) {
        super(props);
        this.state.table.config = {
            column: [
                {name: "参数编码", key: "id", textAlign: "center", width: "20%"},
                {name: "参数名称", key: "scoreItemDesc", textAlign: "center", width: "20%"},
                {name: "是否可计算", key: "computeType", textAlign: "center", width: "20%"},
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
                        }
                    }
                ]
                },
            ]
        };
        this.state.table.pager = {}
    }

    componentWillMount() {
        this.onQuery({})
    }

    onQuery(p) {
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
            this.setState({
                table: {
                    ...this.table,
                    listData: res,
                }
            });
        });
    }

    render() {
        return super.render();
    }
}

export default ParamList;
