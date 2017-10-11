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
import {formateTimeSimple} from "../../../utils/help";

class QueryManagement extends React.Component {
    constructor(props) {
        super();
        let self = this;
        this.state = {
            showDetail: false,
            showModify: false,
            table: {
                listData: [{}], //数据列表
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
                        {name: "状态", key: "dutyStatusAlia", textAlign: "center", width: "10%"},
                        {
                            name: "操作", key: "opt", textAlign: "center", width: "10%", content: [
                            {
                                key: "状态调整",
                                func: (index) => {
                                    this.state.formData.changeStatusList=[];
                                    this.state.showModify=true;
                                    let statusList = [{
                                        value: "ON_DUTY",
                                            desc: "在职"
                                    },
                                    {
                                        value: "OFF_DUTY",
                                            desc: "离职"
                                    },
                                    {
                                        value: "SHI_YONG",
                                            desc: "试用期"
                                    },
                                    {
                                        value: "DAN_BAO",
                                            desc: "担保期"
                                    }];
                                    statusList.forEach((x)=>{
                                        if(x.value!==this.state.table.listData[index].dutyStatus){
                                            this.state.formData.changeStatusList.push(x);
                                        }
                                    });
                                    this.state.changeStatusParams.userCode=this.state.table.listData[index].userCode;
                                    this.setState(this.state);
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
            changeStatusParams:{
                userCode: '',
                newStatus:''
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
                currentPage: 0,
                pageSize: 10
            },
            formData: {
                regionList: [],
                storeList: [],
                rankList: [],
                changeStatusList:[]
            },
            showConfirm: false
        };
        this.onSearch = this.onSearch.bind(this);
        this.handleEndChange = this.handleEndChange.bind(this);
        this.handleStartChange = this.handleStartChange.bind(this);
        this.onSelectRegion = this.onSelectRegion.bind(this);
        this.onSelectStore = this.onSelectStore.bind(this);
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

    onSelectStore(x) {
        this.state.queryParams.dutyStatus = x;
        this.setState(this.state);
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
                          value={this.state.queryParams.regionCode}
                          placeholder="请选择大区" propsLabel="regionName" propsValue="regionCode"/>
            </div>
            <div className="right-company">
                <span>店面：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} options={this.state.formData.storeList}
                          placeholder="请选择店面" propsLabel="storeName" propsValue="storeCode" value={this.state.queryParams.storeCode} onSelect={(x) => {
                    this.state.queryParams.storeCode = x;
                    this.setState(this.state);
                }}/>
            </div>
            <div className="right-company">
                <span>姓名：</span>
                <Input inputStyle={{height: '30px', width: '150px'}} value={this.state.queryParams.userName} onChange={(x) => {
                    this.state.queryParams.userName = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>系统号：</span>
                <Input inputStyle={{height: '30px', width: '150px'}} value={this.state.queryParams.userCode} onChange={(x) => {
                    this.state.queryParams.userCode = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>当前级别：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}}
                          options={this.state.formData.rankList} placeholder="请选择级别" propsLabel="dutyLevelDesc"
                          propsValue="dutyLevelCode" value={this.state.queryParams.dutyLevel} onSelect={(x) => {
                    this.state.queryParams.dutyLevel = x;
                    this.setState({queryParams: this.state.queryParams});
                }}/>
            </div>
            <div className="right-company">
                <span>状态列表：</span>
                <Dropdown style={{height: "30px", lineHeight: "24px"}} onSelect={this.onSelectStore} options={[
                    {
                        value: "ALL_DUTY",
                        desc: "全部"
                    },
                    {
                        value: "ON_DUTY",
                        desc: "在职"
                    },
                    {
                        value: "OFF_DUTY",
                        desc: "离职"
                    },
                    {
                        value: "SHI_YONG",
                        desc: "试用期"
                    },
                    {
                        value: "DAN_BAO",
                        desc: "担保期"
                    }
                ]} placeholder="请选择列表" propsLabel="desc" propsValue="value" value={this.state.queryParams.dutyStatus}/>
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

        const path = "/api/queryManage/showUserBaseInfo";
        requestByFetch(path, obj, true).then((res) => {

            res.list.map((x)=>{

                x["dutyStatusAlia"] = {
                     "ON_DUTY": "在职",
                     "OFF_DUTY":"离职",
                     "SHI_YONG":"试用期",
                     "DAN_BAO":"担保期",
                 }[x.dutyStatus];
                x.onDutyTime = formateTimeSimple(x.onDutyTime);
            });

            this.state.table.listData = res.list;
            this.state.pager = {
                ...this.state.pager,
                currentPage: obj.currentPage,
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
                    <Crumbs names={this.props.pathNames} style={{width:"250px"}}/>
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
                                        <Button className="btn-middle-full" value="取消" onClick={()=>{
                                            this.setState({
                                                showDetail:false
                                            })
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </div>): null
                }
                {
                    this.state.showModify ? (
                        <div  className="m-modal">
                            <div className="m-mask">
                                <div className="modal-container">
                                    <ul className="modal-body">
                                        <li key="0" className="body-list">
                                            <span className="list-label">请选择状态：</span>
                                            <Dropdown style={{height: "30px", lineHeight: "24px"}}
                                                      options={this.state.formData.changeStatusList} placeholder="请选择状态" propsLabel="desc"
                                                      propsValue="value" value={this.state.changeStatusParams.newStatus?this.state.changeStatusParams.newStatus:this.state.formData.changeStatusList[0].value} onSelect={(x) => {
                                                this.state.changeStatusParams.newStatus = x;
                                                this.setState({queryParams: this.state.queryParams});
                                            }}/>
                                        </li>
                                    </ul>
                                    <div className="modal-button">
                                        <Button styleName="btn-middle"  value="确认" onClick={()=>{
                                            let path="/api/userInfo/changeOnDutyStatusByUserCode?"+parseParamsGet({
                                                userCode:this.state.changeStatusParams.userCode,
                                                onDutyStatus:this.state.changeStatusParams.newStatus,
                                                operUserCode:window.localStorage.getItem("userCode")
                                            });
                                            requestByFetch(path, "GET").then((res) => {
                                                this.setState({
                                                    showModify: false,
                                                    showConfirm: true,
                                                    message: "修改成功!"
                                                });
                                                this.onQuery(this.state.queryParams);
                                            });
                                        }}/>
                                        <Button styleName="btn-middle-gray"  value="取消" onClick={()=>{
                                            this.setState({
                                                showDetail:false
                                            })
                                        }}/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ):null
                }
            </div>
        );
    }
}

export default QueryManagement
