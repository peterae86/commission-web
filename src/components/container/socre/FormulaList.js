import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";

class FormulaList extends React.Component {
    constructor(props) {
        super();
        const self = this;
        this.state = {
            pathNames: props.pathNames,
            query: {
                id: props.location.query.id,
                pageSize: props.location.query.pageSize || 10,
                corpCode: props.location.query.corpCode
            },
            config: {
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
                                this.props.onJump('/score/formulaHistory?id=' + this.state.listData[index].id);
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
            },
            listData: []
        };
    }

    componentWillMount() {
        this.onQuery({})
    }

    onSelectCity(value, dd) {

    }

    onSelectCompany(value, dd) {

    }

    onQuery(p) {
        const param = {
            ...p
        };
        const path = "../data/paramList.json?";

        //    const paths = `/scoreItemConfig/queryByCorpCode?${parseParamsGet(param)}`; // 真正接口
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                listData: res,
            });
        });
    }

    render() {
        const {listData, config, corpCode, cityCode, cityData, companyData, pager} = this.state;
        return (
            <div className="rank-container">
                <div className="container-title">
                    <Crumbs names={this.state.pathNames}/>
                    <div className="title-right">
                        <div className="right-company">
                            <span>城市：</span>
                            <Dropdown onSelect={this.onSelectCity} options={cityData} propsValue="cityCode"
                                      placeholder="请选择城市" value={cityCode} propsLabel="cityName"/>
                        </div>
                        <div className="right-company">
                            <span>公司：</span>
                            <Dropdown onSelect={this.onSelectCompany} options={companyData} propsValue="corpCode"
                                      placeholder="请选择公司" propsLabel="corpName" value={corpCode}/>
                        </div>
                    </div>
                </div>

                <Table data={listData} config={config} pager={pager}/>
            </div>
        );
    }
}

export default FormulaList;

