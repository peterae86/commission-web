'use strict';


import React from 'react';
import ReactDom from 'react-dom';
import Login from './container/Login';
import SideBar from './component/SideBar/SideBar'
import Rank from "./container/Rank";
import './App.scss'

import {Router,Route,hashHistory } from 'react-router';


class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            pathNames:[],
            buttons:[{
                id: "1111",
                name: "2222",
                children: [{
                    id: "1111",
                    name: "dasd"
                },
                    {
                        id: "rank",
                        name: "333"
                    },{
                        id: "1111",
                        name: "2fdds222"
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
        return  <div>
            <div className="">dasdada</div>
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
        return <div/>
    }
}

//最终渲染
ReactDom.render((
    <Router history={hashHistory}>
        <Route path='/' component={App}></Route>
        <Route path='/login' component={Login} />
    </Router>
), document.getElementById('app'));
