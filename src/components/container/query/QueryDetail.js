import * as React from "react";
import {parseParamsGet, requestByFetch} from "../../../utils/request";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";

class QueryDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            table: {
                listData: [], //数据列表
                config: {},
                pager: {
                    pageSize: 10,
                    clickPager: function (index) {
                        let p = {
                            ...self.queryParams,
                            currentPage: index,
                            pageSize: 10,
                        };
                        self.onSearch(p);
                    }
                }
            },
            queryParams: {
                userCode: props.location.query.userCode,
                queryType: props.location.query.queryType,
            },
        };
        this.onSearch = this.onSearch.bind(this);
    }

    componentWillMount() {
        let p = {
            ...self.queryParams,
            currentPage: 1,
            pageSize: 10,
        };
        this.onSearch(p);
    }

    onSearch(p) {
        const path = "/api/queryManage/showUserDetailInfoByTyp?" + parseParamsGet(p);
        requestByFetch(path, "GET").then((res) => {
            this.state.table.listData = res.list;
            this.state.pager = {
                ...this.state.pager,
                currentPage: p.currentPage,
                totalCount: res.totalCount
            };
            this.setState(this.state);
        });
    }

    render(){
        const {table} = this.state;
        return (
            <div className="rank-container">
                <div className="container-title">
                    <Crumbs names={this.props.pathNames}/>
                </div>
                <Table data={table.listData} config={table.config} pager={table.pager}/>
            </div>
        );
    }

}

export default QueryDetail