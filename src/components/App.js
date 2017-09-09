'use strict';


import React from 'react';
import ReactDom from 'react-dom';
import Login from './container/Login';
import SideBar from './component/SideBar/SideBar'
import Rank from "./container/Rank";
import './App.scss'
import logo from '../images/logo.png';

import {Router, Route, hashHistory} from 'react-router';
import RankHistory from "./container/RankHistory";


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
                        id: "2",
                        name: "积分管理",
                        children: []
                    }, {
                        id: "3",
                        name: "提佣管理",
                        children: []
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
            'rankHistory': RankHistory
        };
        this.onSelectedChange = this.onSelectedChange.bind(this);
    }

    onSelectedChange(key, pathNames, path) {
        debugger
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
        debugger
        this.setState({
            location: props.location
        })
    }

    onJump(path) {
        hashHistory.push(path);
    }

    render() {
        debugger
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
                    <SideBar buttons={this.state.buttons} onSelectedChange={this.onSelectedChange} location={this.state.location}/>
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
