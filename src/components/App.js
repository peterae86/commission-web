'use strict';


import React from 'react';
import ReactDom from 'react-dom';
import Login from './container/Login';
import SideBar from './component/SideBar/SideBar'
import Rank from "./container/rank/Rank";
import './App.scss'
import logo from '../images/logo.png';

import {Router, Route, hashHistory} from 'react-router';
import RankHistory from "./container/rank/RankHistory";
import ParamList from "./container/socre/ParamList";
import FormulaList from "./container/socre/FormulaList";
import AddParam from "./container/socre/AddParam";
import ParamHistory from "./container/socre/ParamHistory";
import FormulaHistory from "./container/socre/FormulaHistory";
import RankRadioList from "./container/commission/RankRadioList";


class App extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
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
                                id: "rankHistory",
                                name: "操作历史",
                                path: "/rank/history",
                                hide: true,
                                children: []
                            }
                        ]
                    }, {
                        id: "score",
                        name: "积分管理",
                        path: "",
                        children: [
                            {
                                id: "paramList",
                                name: "参数管理",
                                path: "/score/paramList",
                                children: [
                                    {
                                        id: "addParam",
                                        name: "新增参数",
                                        path: "/score/addParam",
                                        hide: true,
                                        children: []
                                    },
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
                        children: [
                            {
                                id: "rankRadioList",
                                name: "本人提佣系数管理",
                                path: "/commission/rankRadioList",
                                children: []
                            }
                        ]
                    }, {
                        id: "4",
                        name: "薪资管理",
                        children: [
                            {
                                id: "41",
                                name: "保障薪资配置",
                                children: []
                            },
                            {
                                id: "42",
                                name: "底薪配置",
                                children: []
                            }
                        ]
                    }]
            },
            currentPage: Blank
        };
        this.state.pages = {
            'rank': Rank,
            'rankHistory': RankHistory,
            'paramList': ParamList,
            'paramHistory': ParamHistory,
            'formulaList': FormulaList,
            'addParam': AddParam,
            'formulaHistory': FormulaHistory,
            'rankRadioList': RankRadioList
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

    onJump(path) {
        hashHistory.push(path);
    }

    render() {
        const CurrentPage = this.state.currentPage;
        const pathNames = this.state.pathNames;
        const onJump = this.onJump;

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
                        CurrentPage ? <CurrentPage pathNames={pathNames} location={this.state.location}
                                                   onJump={onJump}/> : null
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
