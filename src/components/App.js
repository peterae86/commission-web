'use strict';


import React from 'react';
import ReactDom from 'react-dom';
import Login from './container/Login';
import SideBar from './component/SideBar/SideBar'
import './App.scss'
import logo from '../images/logo.png';

import {Router, Route, hashHistory} from 'react-router';

import Rank from "./container/rank/Rank";
import AddRank from "./container/rank/AddRank";
import RankHistory from "./container/rank/RankHistory";
import ParamList from "./container/score/ParamList";
import AddParam from "./container/score/AddParam";
import AddFormula from "./container/score/AddFormula";
import FormulaList from "./container/score/FormulaList";
import ParamHistory from "./container/score/ParamHistory";
import FormulaHistory from "./container/score/FormulaHistory";
import RankRadioList from "./container/commission/RankRadioList";
import {requestByFetch} from "../utils/request";
import GuaranteeSalaryList from "./container/salary/GuaranteeSalaryList";
import GuaranteeSalaryHistory from "./container/salary/GuaranteeSalaryHistory";
import BaseSalaryList from "./container/salary/BaseSalaryList";
import BaseSalaryHistory from "./container/salary/BaseSalaryHistory";
import CommissionManagement from "./container/commission/CommissionManagement";
import ComHistory from "./container/commission/ComHistory";
import CommissionType from "./container/commission/CommissionType";
import ExportManagement from "./container/export/ExportManagement";
import ScoreExport from "./container/export/ScoreExport";
import ImportComponent from "./container/import/ImportComponent";
import ImportHistory from "./container/import/ImportHistory";
import InitDutyLevel from "./container/import/InitDutyLevel";
import InitScore from "./container/import/InitScore";
import Status from "./container/import/Status";
import Yeji from "./container/import/Yeji";
import ScoreCorrect from "./container/import/ScoreCorrect";
import UserRelation from "./container/import/UserRelation";
import BaseModal from "./container/import/BaseModal";
import CommissionExport from "./container/export/CommissionExport";
import BaseSalaryExport from "./container/export/BaseSalaryExport";
import GuaranteeSalaryExport from "./container/export/GuaranteeSalaryExport";
import ExportHistory from "./container/export/ExportHistory";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: [],
            location: this.props.location,
            userName: window.localStorage.getItem("userName") || "admin",
            buttons: {
                id: "root",
                name: "当前位置",
                path: "/",
                children: [
                    {
                        id: "rank",
                        name: "职级管理",
                        path: "/rank",
                        roleName: "ADMIN",
                        children: [
                            {
                                id: "rank",
                                name: "职级列表",
                                path: "/rank",
                                children: []
                            },
                            {
                                id: "addRank",
                                name: "新增职级",
                                path: "/rank/addRank",
                                children: []
                            },
                            {
                                id: "rankHistory",
                                name: "操作历史",
                                path: "/rank/history",
                                hide: true,
                                children: []
                            }
                        ]
                    }, {
                        id: "paramList",
                        name: "积分管理",
                        path: "/score/paramList",
                        roleName: "ADMIN",
                        children: [
                            {
                                id: "paramList",
                                name: "参数管理",
                                path: "/score/paramList",
                                children: [
                                    {
                                        id: "paramHistory",
                                        name: "参数修改历史",
                                        path: "/score/paramHistory",
                                        hide: true,
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: "addParam",
                                name: "新增参数",
                                path: "/score/addParam",
                                children: []
                            },
                            {
                                id: "addFormula",
                                name: "新增计算公式",
                                path: "/score/addFormula",
                                children: []
                            },
                            {
                                id: "formulaList",
                                name: "积分计算管理",
                                path: "/score/formulaList",
                                children: [{
                                    id: "formulaHistory",
                                    name: "公式修改历史",
                                    path: "/score/formulaHistory",
                                    hide: true,
                                    children: []
                                }]
                            }
                        ]
                    }, {
                        id: "commission",
                        name: "提佣管理",
                        path: "/commission",
                        roleName: "ADMIN",
                        children: [
                            {
                                id: "rankRadioList",
                                name: "本人提佣系数管理",
                                path: "/commission/rankRadioList",
                                children: [
                                    {
                                        id: "comHistory",
                                        name: "提佣系数修改历史",
                                        path: "/commission/history",
                                        hide: true,
                                        children: []
                                    }
                                ]
                            },
                            {
                                id: "commissionType",
                                name: "提佣方式配置",
                                path: "/commission/type",
                                children: []

                            }
                        ]
                    }, {
                        id: "salary",
                        name: "薪资管理",
                        roleName: "ADMIN",
                        children: [
                            {
                                id: "guaranteeSalaryList",
                                name: "保障薪资管理",
                                path: "/salary/guaranteeSalaryList",
                                children: [{
                                    id: "guaranteeSalaryHistory",
                                    name: "保障薪资修改历史",
                                    path: "/salary/guaranteeSalaryHistory",
                                    hide: true,
                                    children: []
                                }]
                            },
                            {
                                id: "baseSalaryList",
                                name: "底薪管理",
                                path: "/salary/baseSalaryList",
                                children: [{
                                    id: "baseSalaryHistory",
                                    name: "公式修改历史",
                                    path: "/salary/baseSalaryHistory",
                                    hide: true,
                                    children: []
                                }]
                            }
                        ]
                    },  {
                        id: "import",
                        name: "导入管理",
                        path: "/import",
                        roleName: "ADMIN",
                        children: [
                            {
                                id: "importHistory",
                                name: "导入操作历史",
                                path: "/import/history",
                                hide: true,
                                children: [

                                ]
                            },
                            {
                                id: "initLevel",
                                name: "初始职级列表",
                                path: "/import/initLevel",
                                children: [

                                ]
                            },
                            {
                                id: "initScore",
                                name: "初始积分列表",
                                path: "/import/initScore",
                                children: [

                                ]
                            },
                            {
                                id: "yeji",
                                name: "每期业绩列表",
                                path: "/import/yeji",
                                children: []
                            },
                            {
                                id: "scoreCorrect",
                                name: "积分修订列表",
                                path: "/import/scoreCorrect",
                                children: []
                            },
                            {
                                id: "status",
                                name: "状态调整列表",
                                path: "/import/status",
                                children: [

                                ]
                            },{
                                id: "baseModal",
                                name: "双薪模式底薪",
                                path: "/import/baseModal",
                                children: [

                                ]
                            },{
                                id: "userRelation",
                                name: "员工关系列表",
                                path: "/import/userRelation",
                                children: [

                                ]
                            }
                        ]
                    },{
                        id: "export",
                        name: "导出管理",
                        roleName: "ADMIN",
                        //roleName: "JING_JI_REN",
                        path: "/export",
                        children: [
                            {
                                id: "exportScore",
                                name: "积分明细列表",
                                path: "/export/score",
                                children: []
                            },
                            {
                                id: "exportCommission",
                                name: "提佣明细列表",
                                path: "/export/commission",
                                children: []
                            },
                            {
                                id: "exportBase",
                                name: "底薪列表",
                                path: "/export/base",
                                children: []
                            },
                            {
                                id: "exportGuarantee",
                                name: "保障薪资列表",
                                path: "/export/guarantee",
                                children: []
                            },
                            {
                                id: "exportHistory",
                                name: "导出操作历史",
                                path: "/export/history",
                                hide: true,
                                children: [

                                ]
                            }
                        ]
                    }
                    ]
            },
            currentPage: Blank
        };
        this.state.pages = {
            'rank': Rank,
            'addRank': AddRank,
            'rankHistory': RankHistory,
            'paramList': ParamList,
            'paramHistory': ParamHistory,
            'formulaList': FormulaList,
            'addParam': AddParam,
            'addFormula': AddFormula,
            'formulaHistory': FormulaHistory,
            'rankRadioList': RankRadioList,
            'guaranteeSalaryList': GuaranteeSalaryList,
            'guaranteeSalaryHistory': GuaranteeSalaryHistory,
            'baseSalaryList': BaseSalaryList,
            'baseSalaryHistory': BaseSalaryHistory,
            'commission':CommissionManagement,
            'comHistory':ComHistory,
            'commissionType':CommissionType,
            'export':ExportManagement,
            'exportScore':ScoreExport,
            'exportCommission':CommissionExport,
            'exportBase':BaseSalaryExport,
            'exportGuarantee':GuaranteeSalaryExport,
            'exportHistory':ExportHistory,
            'import': ImportComponent,
            'importHistory': ImportHistory,
            'initLevel':InitDutyLevel,
            'initScore':InitScore,
            'status':Status,
            'yeji':Yeji,
            "scoreCorrect": ScoreCorrect,
            "baseModal": BaseModal,
            "userRelation": UserRelation
        };
        this.onSelectedChange = this.onSelectedChange.bind(this);
    }

    onSelectedChange(key, pathNames, path) {
        if (this.state.pages[key]) {
            this.setState({
                currentPage: this.state.pages[key],
                pathNames: [...pathNames]
            });
            if (path != this.state.location.pathname) {
                hashHistory.push({
                    pathname: path
                });
            }
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            location: props.location
        })
    }

    componentWillMount() {
        this.getCityAndCorp();
    }

    getCityAndCorp() {
        // const path = "../data/cityAndCorp.json?";
        const path = "/api/cityconfig/queryCityCorpsByStatus?status=0"; // 真正接口
        requestByFetch(path, "GET").then((res) => {
            for (let i = 0; i < res.cities.length; i++) {
                res.cities[i].corps = res.corps[res.cities[i].cityCode] || [];
            }
            this.setState({
                cities: res.cities,
            });
        });
    }

    static onJump(path) {
        hashHistory.push(path);
    }

    render() {
        const CurrentPage = this.state.currentPage;
        const pathNames = this.state.pathNames;
        const onJump = App.onJump;
        const {location, cities, userName} = this.state;

        return <div className="app-body">
            <div className="app-header">
                <div className="app-header-left">
                    <img src={logo}/>
                </div>
                <div className="app-header-right">
                    <div className="app-title">积分提佣系统</div>
                    <div className="welcome">您好，<span>{userName}</span></div>
                </div>
            </div>
            <div className="app-container">
                <div className="app-sidebar">
                    <SideBar buttons={this.state.buttons} onSelectedChange={this.onSelectedChange}
                             location={this.state.location}/>
                </div>
                <div className="app-page">
                    {
                        CurrentPage ? <CurrentPage pathNames={pathNames} location={location}
                                                   onJump={onJump} cities={cities}/> : null
                    }
                </div>
            </div>
        </div>
    }
}

class Blank extends React.Component {
    render() {
        return (<div style={{color: "#666",padding:"30px 0 0 22px"}}>
            欢迎使用积分提佣系统
            </div>)
    }
}

//最终渲染
ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/login' component={Login}/>
        <Route path='/**' component={App}/>
    </Router>
), document.getElementById('app'));
