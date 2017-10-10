import * as React from "react";
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import Dropdown from "../../component/Dropdown/Dropdown";
import Input from "../../component/Input/Input";
import '../../../styles/export.scss'
import Button from "../../component/Button/Button";
import {parseParamsGet, requestByFetch} from "../../../utils/request";
import ModalAlert from "../../component/ModalAlert/ModalAlert";
import Modal from "../../component/Modal/Modal";

class QueryManagement extends React.Component {
    constructor(props) {
        super();
        let self = this;
        this.state = {
            showDetail: false,
            table: {
                listData: [{
                "corpCode": "yi_wu_corp_code",
                "corpName": "义乌分公司",
                "regionCode": "regionCode1",
                "regionName": "浙江大区1",
                "storeCode": "storeCode1",
                "storeName": "店面名字1",
                "userCode": "20182480",
                "userName": "关关",
                "onDutyTime": "2017-10-05 20:42:03",
                "currentDutyLevel": "A3",
                "currentFinalScore": 23123,
                "lastPeriodCommission": 8888.5,
                "dutyStatus": "OFF_DUTY"
            }], //数据列表
                config: {
                    column: [
                        {name: "公司", key: "corpName", textAlign: "center", width: "8%"},
                        {name: "大区编号", key: "regionCode", textAlign: "center", width: "8%"},
                        {name: "大区", key: "regionName", textAlign: "center", width: "8%"},
                        {name: "店面编号", key: "storeCode", textAlign: "center", width: "8%"},
                        {name: "店面", key: "storeName", textAlign: "center", width: "8%"},
                        {name: "姓名", key: "userName", textAlign: "center", width: "8%"},
                        {name: "入职时间", key: "onDutyTime", textAlign: "center", width: "10%"},
                        {name: "系统号", key: "userCode", textAlign: "center", width: "8%"},
                        {name: "当期级别", key: "currentDutyLevel", textAlign: "center", width: "8%"},
                        {name: "当期积分", key: "currentFinalScore", textAlign: "center", width: "8%"},
                        {name: "上期提佣", key: "lastPeriodCommission", textAlign: "center", width: "8%"},
                        {name: "状态", key: "dutyStatus", textAlign: "center", width: "10%"},
                        {
                            name: "操作", key: "opt", textAlign: "center", width: "10%", content: [
                            {
                                key: "状态调整",
                                func: (index) => {

                                }
                            },
                            {
                                key: "查看详情",
                                func: (index) => {
                                    this.setState({
                                        showDetail: true,
                                        userCode:this.state.table.listData[index].userCode,
                                    });
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
                dutyLevel: "",
                dutyStatus: "",
                onDutyTimeStart: moment(),
                onDutyTimeEnd: moment(),
                currentPage: 1,
                pageSize: 10
            },
            formData: {
                regionList: [],
                storeList: [],
                rankList: []
            },
            showConfirm: false
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
    }

    componentWillMount() {
        requestByFetch("/api/regionStore/queryRegionStoreList?type=REGION", "GET").then((res) => {
            this.state.formData.regionList = res;
            this.setState(this.state);
        });
        requestByFetch("/api/dutyLevelConfig/queryAllCityDutyLevels", "GET").then((res) => {
            this.state.formData.rankList = res;
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

    handleStartChange(value) {
        this.state.queryParams.onDutyTimeStart = value;
        this.setState(this.state);
    }

    handleEndChange (value) {
        this.state.queryParams.onDutyTimeEnd = value;
        this.setState(this.state);
    }

    renderSearchInputs() {
        return <div className="title-right">
            <div className="right-company">
                <span>大区：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectRegion}
                          options={this.state.formData.regionList}
                          placeholder="请选择大区" value="" propsLabel="regionName" propsValue="regionCode"/>
            </div>
            <div className="right-company">
                <span>店面：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} options={this.state.formData.storeList}
                          placeholder="请选择店面" propsLabel="storeName" propsValue="storeCode" value="" onSelect={(x) => {
                    this.state.queryParams.storeCode = x;
                    this.setState(this.state);
                }}/>
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
            <div className="right-company">
                <span>当前级别：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}}
                          options={this.state.rankList} placeholder="请选择级别" propsLabel="dutyLevelDesc"
                          propsValue="dutyLevelCode" value="" onSelect={(x) => {
                    this.state.queryParams.dutyLevel = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>状态列表：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectStore} options={[
                    {
                        desc: "BOTH_DUTY",
                        value: "全部"
                    },
                    {
                        desc: "ON_DUTY",
                        value: "在职"
                    },
                    {
                        desc: "OFF_DUTY",
                        value: "离职"
                    },
                ]} placeholder="请选择列表" propsLabel="desc" propsValue="value" value=""/>
            </div>
            <div className="right-company">
                <span>入职时间从：</span>
                <DatePicker
                   selected={this.state.queryParams.onDutyTimeStart}
                   onChange={this.handleStartChange}
                   dateFormat="YYYY-MM-DD"
               />
               <span>至：</span>
               <DatePicker
                  selected={this.state.queryParams.onDutyTimeEnd }
                  onChange={this.handleEndChange}
                  dateFormat="YYYY-MM-DD"
              />
            </div>
        </div>
    }


    onSearch(p) {
        const obj = {
            ...this.state.queryParams,
            ...p,
        };
        obj.onDutyTimeStart = obj.onDutyTimeStart.format("YYYY-MM-DD");
        obj.onDutyTimeEnd = obj.onDutyTimeEnd.format("YYYY-MM-DD");

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
        if (!obj.onDutyTimeStart) {
            this.setState({
                showConfirm: true,
                message: "请输入开始时间"
            });
            return;
        }
        if (!obj.onDutyTimeEnd) {
            this.setState({
                showConfirm: true,
                message: "请输入结束时间"
            });
            return;
        }
        if (!obj.dutyLevel) {
            this.setState({
                showConfirm: true,
                message: "请选择职级"
            });
            return;
        }
        if (!obj.dutyStatus) {
            this.setState({
                showConfirm: true,
                message: "请选择状态"
            });
            return;
        }

        const path = "/api/queryManage/showUserBaseInfo?" + parseParamsGet(p);
        requestByFetch(path, "GET").then((res) => {

            res.list.map((x)=>{
                if (x.dutyStatus === "OFF_DUTY") {
                    x.dutyStatus = "离职";
                } else {
                    x.dutyStatus = "在职";
                }
            });
            this.state.table.listData = res.list;
            this.state.pager = {
                ...this.state.pager,
                currentPage: p.currentPage,
                totalCount: res.totalCount
            };
            this.setState(this.state);
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

    onJumpTo (path) {
        this.setState({
            showDetail: false
        });
        this.props.onJump(path);
    }
    renderModify() {
        const modal = {
            show: this.state.modifyModal,
            formData: this.state.formData,
            title: "修改底薪",
            onCancel: () => {
                this.setState({modifyModal: false});
            },
            onConfirm: (queryData) => {
                let data = {};
                queryData.map((item) => {
                    if (item.key === "id" || item.key === "dutyLevel") {
                        data[item.key] = item.value;
                    } else {
                        data[item.key] = (item.value / 100).toFixed(2);
                    }
                });
                data["userCode"] = window.localStorage.getItem("userCode");
                if (data.baseSalaryModelRatio < 0 || data.doubleSalaryModelRatio < 0) {
                    this.setState({
                        showConfirm: true,
                        message: "系数不能为负数",
                    });
                    return;
                }
                // const path = "../data/rankUpdate.json";
                const path = `/api/dutyLevelCommission/updateById?${parseParamsGet(data)}`;
                requestByFetch(path, "GET").then((res) => {
                    this.setState({
                        modifyModal: false,
                        showConfirm: true,
                        message: "修改成功!"
                    });
                    this.onQuery(this.state.queryParams);
                });
            }
        };
        return <Modal {...modal} />
    }

    render() {
        const {table} = this.state;
        return (
            <div className="rank-container">
                {this.renderAlert()}
                <div className="container-title">
                    <Crumbs names={this.props.pathNames} style={{width:"200px"}}/>
                    {this.renderSearchInputs()}
                </div>
                <div className="container-button">
                    <Button styleName="btn-middle" value="查询" onClick={this.onSearch}/>
                </div>
                <Table data={table.listData} config={table.config} pager={table.pager}/>
                {
                    this.state.showDetail ? (
                        <div className="alert-container">
                            <div className="alert">
                                <div className="alert-title">请选择查看详情</div>
                                <div className="alert-content">
                                    <p onClick={this.onJumpTo.bind(this, "/query/baseScore?queryType=BASE_SCORE&userCode="+this.state.userCode)}>基础积分详情</p>
                                    <p onClick={this.onJumpTo.bind(this, "/query/yeji?queryType=HISTORY_YE_JI&userCode="+this.state.userCode)}>历史业绩详情</p>
                                    <p onClick={this.onJumpTo.bind(this, "/query/reward?queryType=HISTORY_REWARD_SCORE&userCode="+this.state.userCode)}>历史奖励详情</p>
                                    <p onClick={this.onJumpTo.bind(this, "/query/punish?queryType=HISTORY_PUNISH_SCORE&userCode="+this.state.userCode)}>历史惩罚详情</p>
                                    <p onClick={this.onJumpTo.bind(this, "/query/com?queryType=HISTORY_COMMISSION&userCode="+this.state.userCode)}>历史提佣详情</p>
                                    <p onClick={this.onJumpTo.bind(this, "/query/level?queryType=HISTORY_COMMISSION&userCode="+this.state.userCode)}>职级调整历史详情</p>
                                </div>
                                <div className="alert-button">
                                    <div className="button-content">
                                        <button type="button" className="btn middle full ">取消</button>
                                    </div>
                                </div>
                            </div>
                        </div>): null
                }
            </div>
        );
    }
}

export default QueryManagement
