import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";

class CommissionType extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            //面包屑
            pathNames: props.pathNames,
            //表格配置
            table: {
                listData: [], //数据列表
                config: {
                    column: [
                        {name: "本人提佣方式", key: "commissionMode", textAlign: "center", width: "50%"},
                        {name: "状态", key: "statusDesc", textAlign: "center", width: "50%"}
                    ]
                }
            },
            showConfirm: false,
            modifyModal: false,
            message: "", // alert message
            formData: [],
        };
    }

    componentWillMount() {
        const path = '/data/commissiontype.json';
        //const path = '/dutyLevelCommission/queryCommissionTypeByUserCode';
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res
                }
            });
        });
    }

    render(){
        const {table, pathNames} = this.state;
        return <div className="rank-container">
            <div className="container-title">
                <Crumbs names={pathNames}/>
            </div>
            <Table data={table.listData} config={table.config} pager={table.pager}/>
        </div>
    }
}

export default CommissionType