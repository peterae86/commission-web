import React from 'react';
import './SideBar.scss'
import {hashHistory} from 'react-router';
window.roleAuthMap = JSON.parse(window.localStorage.getItem("roleAuthMap"));
class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.buttonTreeNode = this.createButtons(props.buttons, 0, []);
        this.state.selectedPath = '';
        this.renderButton.bind(this);
        this.onButtonClick.bind(this);
    }

    componentWillMount() {
        this.selectByPath(this.state.buttonTreeNode, this.props.path || this.props.location.pathname);
    }

    createButtons(x, depth, pathNames) {
        let res = {
            hasChild: false,
            selected: false,
            depth: depth,
            pathNames: [...pathNames, x.name],
            children: [],
            id: x.id,
            roleName: x.roleName,
            name: x.name,
            path: x.path,
            hide: x.hide
        };
        x.children.forEach((c) => {
            res.children.push(this.createButtons(c, depth + 1, res.pathNames));
            if (!c.hide) {
                res.hasChild = true
            }
        });
        return res;
    }

    componentWillReceiveProps(props) {
        if (this.state.selectedPath !== props.location.pathname) {
            this.selectByPath(this.state.buttonTreeNode, props.location.pathname);
            this.setState({
                selectedPath: props.location.pathname
            });
        }
    }

    selectByPath(x, path) {
        let res = false;
        if (x.path === path) {
            if (this.props.onSelectedChange) {
                this.props.onSelectedChange(x.id, x.pathNames, x.path);
            }
            res = true;
        }
        if (x.children.length > 0) {
            for (let i = 0; i < x.children.length; i++) {
                if (this.selectByPath(x.children[i], path)) {
                    res = true;
                }
            }
        }

        return x.selected = res;
    }


    onButtonClick(item) {
        this.state.buttonTreeNode.children.forEach(x => {
            let selected = false;
            x.children.forEach((c) => {
                c.selected = (c.id === item.id);
                if (c.selected) {
                    selected = true;
                }
            });
            x.selected = selected || x.id === item.id;
        });

        if (this.props.onSelectedChange) {
            this.props.onSelectedChange(item.id, item.pathNames, item.path);
        }
        this.setState(this.state);
    }

    renderButton(item, index) {
        if(item.hide){
            return null;
        }
        let flag = true;
        if(item.depth === 1){
            const roleNameArray = [];
            for ( var key in window.roleAuthMap ){
                roleNameArray.push(key);
            }
            flag = roleNameArray.indexOf(item.roleName) !== -1;
        }

        const str = flag ? (<li key={index} >
            <div
                className={(item.selected ? "sidebar-item-selected " : "") + "sidebar-item-" + item.depth}
                onClick={this.onButtonClick.bind(this, item)}>
                {item.name}
            </div>
            {item.hasChild && item.depth === 1 && item.selected ?
                <div className="sidebar-child sidebar ">
                    <ul>{
                        item.children.map(this.renderButton.bind(this))
                    }</ul>
                </div> : null}
        </li>) : null;
        return str;
    }

    render() {
        const {buttonTreeNode} = this.state;
        return <div className="sidebar">
            <ul>
                {
                    buttonTreeNode.children.map(this.renderButton.bind(this))
                }
            </ul>
        </div>;
    }
}


function lazyFunction(f) {
    return function () {
        return f.apply(this, arguments);
    };
}

let lazyTreeType = lazyFunction(function () {
    return buttonTreeNodeType;
});

let buttonTreeNodeType = React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    children: React.PropTypes.arrayOf(lazyTreeType)
});

SideBar.propTypes = {
    'buttons': buttonTreeNodeType,
    'onSelected': React.PropTypes.func,
    'path': React.PropTypes.string
};

export default SideBar;
