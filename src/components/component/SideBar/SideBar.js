import React from 'react';
import './SideBar.scss'
import {browserHistory} from 'react-router';


class SideBar extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        this.state = {};
        this.state.buttonTreeNode = this.createButtons(props.buttons, 0, []);
        this.renderButton.bind(this);
        this.onButtonClick.bind(this)
    }

    componentWillMount() {
        this.selectByPath(this.state.buttonTreeNode, this.props.path || this.props.location.pathname);
    }

    createButtons(x, depth, pathNames) {
        let hasChild = x.children && x.children.length > 0 || false;
        let res = {
            hasChild: hasChild,
            selected: false,
            depth: depth,
            pathNames: [...pathNames, x.name],
            ...x
        };
        if (res.hasChild) {
            res.children = [];
            x.children.forEach((c) => {
                res.children.push(this.createButtons(c, depth + 1, res.pathNames));
            });
        }
        return res;
    }

    selectByPath(x, path) {
        if (x.hasChild) {
            for (let i = 0; i < x.children.length; i++) {
                if (this.selectByPath(x.children[i], path)) {
                    x.selected = true;
                    return true;
                }
            }
        } else if (x.path === path) {
            x.selected = true;
            if (this.props.onSelected) {
                this.props.onSelected(x.id, x.pathNames, x.path);
            }
            return true;
        }
        x.selected = false;
        return false;
    }


    onButtonClick(item) {
        this.state.buttonTreeNode.children.forEach(x => {
            let selected = false;
            x.hasChild && x.children.forEach((c) => {
                c.selected = (c.id === item.id);
                if (c.selected) {
                    selected = true;
                }
            });
            x.selected = selected || x.id === item.id;
        });

        if (this.props.onSelected) {
            this.props.onSelected(item.id, item.pathNames, item.path);
        }
        this.setState(this.state);
    }

    renderButton(item, index) {
        return <li key={index}>
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
        </li>
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