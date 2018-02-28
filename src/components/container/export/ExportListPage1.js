import * as React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import '../../../styles/export.scss'
import Button from "../../component/Button/Button";
import {parseParamsGet, requestByFetch} from "../../../utils/request";
import ModalAlert from "../../component/ModalAlert/ModalAlert";
import {formateTimeSimple} from "../../../utils/help";
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
            },
            queryParams: {
                regionCode: '',
                storeCode: '',
                userName: '',
                userCode: '',
                currentPeriod: '', // 账期
                currentPage: 0,
                pageSize: 10
            },
            formData: {
                regionList: [],
                storeList: []

            },
            showConfirm: false,
            canExport: false
        }
        this.onSearch = this.onSearch.bind(this);
        this.onSelectRegion = this.onSelectRegion.bind(this);
        this.onSelectStore = this.onSelectStore.bind(this);
        this.onExport = this.onExport.bind(this);
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
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectRegion}
                          options={this.state.formData.regionList}
                          placeholder="请选择大区" value={this.state.queryParams.regionCode} propsLabel="regionName" propsValue="regionCode"/>
            </div>
            <div className="right-company">
                <span>店面：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectStore}
                          options={this.state.formData.storeList}
                          placeholder="请选择店面" propsLabel="storeName" propsValue="storeCode" value={this.state.queryParams.storeCode}/>
            </div>
            <div className="right-company">
                <span>姓名：</span>
                <Input inputStyle={{height: '30px', width: '110px',padding:"0 10px"}} value={this.state.queryParams.userName} placeholder="请输入姓名" onChange={(x) => {
                    this.state.queryParams.userName = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>系统号：</span>
                <Input inputStyle={{height: '30px', width: '130px',padding:"0 10px"}}  placeholder="请输入系统号" value={this.state.queryParams.userCode} onChange={(x) => {
                    this.state.queryParams.userCode = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>账期：</span>
                <Input inputStyle={{height: '30px', width: '130px',padding:"0 10px"}} placeholder="请输入账期yyyymm" value={this.state.queryParams.currentPeriod } onChange={(x) => {
                    this.state.queryParams.currentPeriod  = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
        </div>
    }


    onSearch(p) {
        const obj = {
            ...this.state.queryParams,
            ...p,
        };
        if (!obj.regionCode) {
            this.setState({
                showConfirm: true,
                message: "请选择大区"
            });
            return;
        }
        if (!obj.storeCode) {
            this.setState({
                showConfirm: true,
                message: "请选择店面"
            });
            return;
        }
        if (/^\d{6}$/.test(obj.currentPeriod)) {
            this.setState({
                showConfirm: true,
                message: "请正确输入账期"
            });
            return false;
        }
        const path = "/api/config/export/infoQuery/listByType";
        requestByFetch(path, obj, true).then((res) => {
            res.exportList.map((item, index)=> {
                if (item.onDutyTime) {
                    item["onDutyTimeAlia"] = formateTimeSimple(item.onDutyTime);
                }
            });

            this.state.table.listData = res.exportList;
            this.state.pager = {
                ...this.state.pager,
                currentPage: obj.currentPage,
                totalCount: res.totalCount,
                pageSize: 10
            };
            this.state.canExport = res.exportList.length !== 0;
            this.setState(this.state);
        });
    }

    onExport() {
        const path = "/api/config/export2Excel/byType?" + parseParamsGet({
            ...this.state.queryParams,
            operateUserCode: window.localStorage.getItem("userCode")
        });
        window.open(path)
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
        const {table, modifyModal, pager, canExport} = this.state;
        return (
            <div className="rank-container">
                {this.renderAlert()}
                <div className="container-title export">
                    <Crumbs names={this.props.pathNames}/>
                    {this.renderSearchInputs()}
                </div>
                <div className="export-container-button">
                    <div  className="export-button-left"></div>
                    <div className="container-button">
                        <Button styleName="btn-small" value="查询" onClick={this.onSearch}/>
                        <Button styleName="btn-small" disabled={!canExport} value="导出" onClick={this.onExport}/>
                    </div>
                </div>

                <Table data={table.listData} config={table.config} pager={pager}/>
            </div>
        );
    }
}

export default ExportListPage
