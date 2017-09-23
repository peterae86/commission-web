import {Component} from "react";
import Table from "../../component/Table/Table";
import * as React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";

class CommissionManagement extends Component{
    constructor(props){
        super(props)
        const self = this;
        this.state = {
            //面包屑
            pathNames: props.pathNames,
            //表格配置
            table: {
                listData: [{
                    a:'本人',
                    b:'本人提佣业绩*本人提佣系数'
                }], //数据列表
                config: {
                    column: [
                        {name: "提佣类型", key: "a", textAlign: "center", width: "25%"},
                        {name: "计算公式", key: "b", textAlign: "center", width: "35%"},
                        {
                            name: "操作", key: "opt", textAlign: "center", width: "40%", content: [
                            {
                                key: "提佣方式配置",
                                func: (index) => {
                                    this.props.onJump('/commission/type');
                                }
                            },
                            {
                                key: "提佣系数管理",
                                func: (index) => {
                                    this.props.onJump('/commission/rankRadioList');
                                }
                            }
                        ]
                        },
                    ]
                }
            },
            showConfirm: false,
            modifyModal: false,
            message: "", // alert message
            formData: [],
        };
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

export default CommissionManagement
