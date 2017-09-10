import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Dropdown from "../../component/Dropdown/Dropdown";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";

class ParamList extends React.Component {
    constructor(props) {
        super();
        const self = this;
        this.state = {
            pathNames: props.pathNames,
            query: {
                pageSize: props.location.query.pageSize || 10,
                corpCode: props.location.query.corpCode
            },
            config: {
                column: [
                    {name: "参数编码", key: "id", textAlign: "center", width: "20%"},
                    {name: "参数名称", key: "scoreItemDesc", textAlign: "center", width: "20%"},
                    {name: "是否可计算", key: "computeType", textAlign: "center", width: "20%"},
                    {name: "操作", key: "operateDesc", textAlign: "center", width: "20%"},
                ]
            },
            listData: []
        };
    }

    componentWillMount(){
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

export default ParamList;

