'use strict';


import React from 'react';
import ReactDom from 'react-dom';
import Login from './container/Login';
import SideBar from './component/SideBar/SideBar'
import Rank from "./container/Rank";
import './App.scss'
import logo from '../images/logo.png';

import {Router,Route,hashHistory } from 'react-router';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pathNames:[],
            buttons:[{
                id: "rank",
                name: "职级管理",
            },{
                id: "2",
                name: "积分管理"
            },{
                id: "3",
                name: "提佣管理"
            },{
                id: "4",
                name: "薪资管理",
                children: [{
                    id: "41",
                    name: "保障薪资配置"
                },
                {
                    id: "42",
                    name: "底薪配置"
                }
                ]
            }],
            currentPage:Blank
        };
        this.state.pages={
            'rank':Rank
        },
        this.onSelected = this.onSelected.bind(this);
    }

    onSelected (key, pathNames) {
        this.setState({
            currentPage: this.state.pages[key]||Blank,
            pathNames: ['当前位置',...pathNames]
        });
    }

    render(){
        const CurrentPage = this.state.currentPage;
        const pathNames= this.state.pathNames;
        return  <div className="app-body">
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
                <SideBar buttons={this.state.buttons} onSelected={this.onSelected}/>
                </div>
                <div className="app-page">
                    <CurrentPage pathNames={pathNames}/>
                </div>
            </div>
        </div>
    }
}

class Blank extends React.Component{
    render(){
        return <Rank />
    }
}

//最终渲染
ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}></Route>
        <Route path='/login' component={Login} />
    </Router>
), document.getElementById('app'));
