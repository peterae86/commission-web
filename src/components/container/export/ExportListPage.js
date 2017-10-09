import * as React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import '../../../styles/export.scss'
import Button from "../../component/Button/Button";
import {parseParamsGet, requestByFetch} from "../../../utils/request";
import ModalAlert from "../../component/ModalAlert/ModalAlert";

class ExportListPage extends React.Component {
    constructor(props) {
        super();
        let self = this;
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
                            currentPage: index,
                            pageSize: 10,
                        };
                        self.onSearch(p);
                    }
                }
            },
            queryParams: {
                regionCode: '',
                storeCode: '',
                userName: '',
                userCode: '',
                currentPage: 1,
                pageSize: 10
            },
            formData: {
                regionList: [],
                storeList: []

            },
            showConfirm: false
        }
    }

    componentWillMount() {
        const path = "/api/regionStore/queryRegionStoreList?type=REGION";
        requestByFetch(path, "GET").then((res) => {
            this.state.formData.regionList = res;
            this.setState(this.state);
        });
    }

    onSelectRegion(x) {
        const path = "/api/regionStore/queryRegionStoreList?type=STORE&regionCode=" + x;
        requestByFetch(path, "GET").then((res) => {
            this.state.formData.storeList = res;
            this.state.queryParams.regionCode = x;
            this.setState(this.state);
        });
    }

    onSelectStore(x) {
        this.state.queryParams.storeCode = x;
        this.setState(this.state);
    }

    renderSearchInputs() {
        return <div className="title-right">
            <div className="right-company">
                <span>大区：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectRegion} options={[]}
                          placeholder="请选择城市" value="" propsLabel="cityName" propsValue="cityCode"/>
            </div>
            <div className="right-company">
                <span>店面：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectStore} options={[]}
                          placeholder="请选择公司" propsLabel="corpName" propsValue="corpCode" value=""/>
            </div>
            <div className="right-company">
                <span>姓名：</span>
                <Input inputStyle={{height: '30px', width: '150px'}} onChange={(x) => {
                    this.state.queryParams.userName = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>系统号：</span>
                <Input inputStyle={{height: '30px', width: '150px'}} onChange={(x) => {
                    this.state.queryParams.userCode = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
        </div>
    }


    onSearch(p) {
        if(!this.state.queryParams.regionCode){
            this.setState({
                showConfirm: true,
                message: "请选择大区"
            });
            return;
        }
        if(!this.state.queryParams.storeCode){
            this.setState({
                showConfirm: true,
                message: "请选择店面"
            });
            return;
        }
        const path = "/api/config/export/infoQuery/listByType?" + parseParamsGet(p);
        requestByFetch(path, "GET").then((res) => {
            this.state.table.listData = res.exportList;
            this.state.pager = {
                ...this.state.pager,
                currentPage: p.currentPage,
                totalCount: res.totalCount
            };
            this.setState(this.state);
        });
    }

    onExport() {
        const path = "/api/config/export2Excel/byType?"+parseParamsGet({
            ...this.state.queryParams,
            operateUserCode:"a"
        });
    }

    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'alert',
            onCancel: () => {
                this.setState({showConfirm: false});
            },
        };
        return <ModalAlert {...modalProps} />
    }

    render() {
        const {table, modifyModal} = this.state;
        return (
            <div className="rank-container">
                {this.renderAlert()}
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