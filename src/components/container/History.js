import React from 'react';
import Table from '../component/Table/Table';
import Crumbs from '../component/Crumbs/Crumbs';
import {requestByFetch} from "../../utils/request";
import {hashHistory} from "react-router";
import Button from "../component/Button/Button";

class History extends React.Component {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            pathNames: props.pathNames,
            query: {
                id: props.location.query.id,
                pageSize: props.location.query.pageSize || 10
            },
            config: {
                column: [
                    {name: "操作人系统号", key: "userCode", textAlign: "center", width: "20%"},
                    {name: "操作人姓名", key: "userName", textAlign: "center", width: "20%"},
                    {name: "操作类型", key: "operateType", textAlign: "center", width: "20%"},
                    {name: "操作简要描述", key: "operateDesc", textAlign: "center", width: "20%"},
                    {name: "操作时间", key: "operateDate", textAlign: "center", width: "20%"},
                ]
            },
            pager: {
                pageSize: props.location.query.pageSize || 10,
                clickPager: function (index) {
                    self.onQuery({
                        ...self.state.query,
                        currentPage: index
                    })
                }
            },
            listData: []
        };
    }

    componentWillMount() {
        this.state.pager.clickPager(this.props.location.query.currentPage || 0);
    }

    onQuery(p) {
        const param = {
            ...p,
            queryType: this.state.queryType
        };
        const path = this.state.queryUrl;
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                listData: res.operateRecordList,
                pager: {
                    ...this.state.pager,
                    currentPage: p.currentPage,
                    totalCount: res.totalCount
                }
            });
        });
    }

    onBack(){
        hashHistory.goBack();
    }

    render() {
        const {listData, config, corpCode, cityCode, cityData, companyData, pager} = this.state;
        return (
            <div className="rank-container">
                <div className="container-title">
                    <Crumbs names={this.state.pathNames}/>
                    <Button onClick={this.onBack} styleName="btn-middle-gray"  className="btn-back" value="返回"/>
                </div>
                <Table data={listData} config={config} pager={pager}/>
            </div>
        );
    }
}

export default History;