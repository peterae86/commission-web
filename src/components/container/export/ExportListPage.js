import * as React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import '../../../styles/export.scss'
import Button from "../../component/Button/Button";

class  ExportListPage extends React.Component{
    constructor(props){
        super();
        this.state = {
            table: {
                listData: [], //数据列表
                config: {
                    column: []
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
            queryParams:{
                region:'',
                store:'',
                realName:'',
                userCode:''
            },
            formData:{
                regionList:[],
                currentRegion:{}
            }
        }
    }

    onSelectRegion(x){
        // this.state.queryParams.realName=x;
        // this.setState(this.state.queryParams);
    }

    onSelectStore(x){
        // this.state.queryParams.realName=x;
        // this.setState(this.state.queryParams);
    }

    renderSearchInputs(){
        return <div className="title-right">
            <div className="right-company">
                <span>大区：</span>
                <Dropdown style={{height: "30px",lineHeight: "24px"}} onSelect={this.onSelectRegion} options={[]}
                          placeholder="请选择城市" value="" propsLabel="cityName" propsValue="cityCode"/>
            </div>
            <div className="right-company">
                <span>店面：</span>
                <Dropdown style={{height: "30px",lineHeight: "24px"}} onSelect={this.onSelectStore} options={[]}
                          placeholder="请选择公司" propsLabel="corpName" propsValue="corpCode" value=""/>
            </div>
            <div className="right-company">
                <span>姓名：</span>
                <Input inputStyle={{height:'30px',width:'150px'}} onChange={(x)=>{
                    this.state.queryParams.realName=x;
                    this.setState(this.state.queryParams);
                }}/>
            </div>
            <div className="right-company">
                <span>系统号：</span>
                <Input inputStyle={{height:'30px',width:'150px'}}  onChange={(x)=>{
                    this.state.queryParams.userCode=x;
                    this.setState(this.state.queryParams);
                }}/>
            </div>
        </div>
    }


    onSearch(){

    }

    onExport(){

    }

    render(){
        const {table, modifyModal} = this.state;
        return (
            <div className="rank-container">
                <div className="container-title">
                    <Crumbs names={this.props.pathNames}/>
                    {this.renderSearchInputs()}
                </div>
                <div className="container-button">
                    <Button value="查询" onClick={this.onSearch}/>
                    <Button value="导出" onClick={this.onExport}/>
                </div>
                <Table data={table.listData} config={table.config} pager={table.pager}/>
            </div>
        );
    }
}

export default ExportListPage