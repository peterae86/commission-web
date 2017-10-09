import * as React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";

class ExportManagement extends React.Component{
    constructor(props){
        super();
        this.state = {
            //表格配置
            table: {
                listData: [
                    {name:'积分明细',path:'/export/score'},
                    {name:'提佣明细',path:'/export/commission'},
                    {name:'底薪',path:'/export/base'},
                    {name:'保障薪资',path:'/export/guarantee'},
                ], //数据列表
                config: {
                    column: [
                        {name: "导出信息项", key: "name", textAlign: "center", width: "50%"},
                        {
                            name: "操作", key: "opt", textAlign: "center", width: "50%", content: [
                            {
                                key: "查看",
                                func: (index) => {
                                    this.props.onJump(this.state.table.listData[index].path);
                                }
                            },
                            {
                                key: "操作历史",
                                func: (index) => {
                                    this.props.onJump('/export/history');
                                }
                            }
                        ]
                        },
                    ]
                },
                pager: {
                    pageSize: 10,
                    clickPager: function (index) {
                        let p = {
                            ...self.queryParams,
                            currentPage: index
                        };

                        self.onQuery(p);
                    }
                }
            },
        }
    }

    render(){
        const {table} = this.state;
        const {pathNames} = this.props;
        return <div className="rank-container">
            <div className="container-title">
                <Crumbs names={pathNames}/>
            </div>
            <Table data={table.listData} config={table.config} pager={table.pager}/>
        </div>
    }
}

export default  ExportManagement