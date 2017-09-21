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
import ParamList from "./container/socre/ParamList";
import AddParam from "./container/socre/AddParam";
import AddFormula from "./container/socre/AddFormula";
import FormulaList from "./container/socre/FormulaList";
import ParamHistory from "./container/socre/ParamHistory";
import FormulaHistory from "./container/socre/FormulaHistory";
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
import ImportComponent from "./container/import/ImportComponent";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pathNames: [],
            location: this.props.location,
            buttons: {
                id: "root",
                name: "当前位置",
                path: "/",
                children: [
                    {
                        id: "rank",
                        name: "职级管理",
                        path: "/rank",
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
                        children: []
                    },{
                        id: "export",
                        name: "导出管理",
                        path: "/export",
                        children: []
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
            'import': ImportComponent
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
        const path = "../data/cityAndCorp.json?";
        //const path = " /cityconfig/queryCityCorpsByStatus?status=0"; // 真正接口
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
        const {location, cities} = this.state;

        return <div className="app-body">
            <div className="app-header">
                <div className="app-header-left">
                    <img src={logo}/>
                </div>
                <div className="app-header-right">
                    <div className="app-title">积分提佣系统</div>
                    <div className="welcome">您好，<span>xxx</span></div>
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
        return <div/>
    }
}

//最终渲染
ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/login' component={Login}/>
        <Route path='/**' component={App}/>
    </Router>
), document.getElementById('app'));
