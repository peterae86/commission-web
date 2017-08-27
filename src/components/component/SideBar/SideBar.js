import React from 'react';
import './SideBar.scss'

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        let depth=0;
        let pathNames=[];
        function createButtons(x) {
            let res = {
                hasChild: x.children && x.children.length > 0,
                opened: 0,
                selected: 0,
                depth:depth,
                pathNames:[...pathNames,x.name],
                ...x
            };
            if (res.hasChild) {
                depth++;
                let tmp=pathNames;
                pathNames=res.pathNames;
                res.children=res.children.map(createButtons);
                pathNames=tmp;
                depth--;
            }
            return res;
        }
        this.state.buttons = props.buttons.map(createButtons);
        this.state.openedMark = 1;
        this.state.selectedMark = 1;
    }
    onButtonClick(item) {

        if(item.hasChild){
            if(item.opened===this.state.openedMark){
                //this.state.openedMark++;
            }else{
                this.state.openedMark++;
                item.opened=this.state.openedMark;
            }
        } else {
            if (item.depth === 0) {
                this.state.openedMark++;
            }
            if (item.selected !== this.state.selectedMark) {
                this.state.selectedMark++;
                item.selected = this.state.selectedMark;
                if (this.props.onSelected) {
                    this.props.onSelected(item.id, item.pathNames);
                }
            }
        }
        this.setState(this.state);
    }
     renderButton (item,index) {
        const {openedMark,selectedMark} = this.state;
        return <li key={index}>
            <div className={(item.opened===openedMark?"sidebar-item-opened":"")+(item.selected===selectedMark?"sidebar-item-selected":"")+" sidebar-item "+(item.depth>0?"sidebar-item-child ":"sidebar-item-top ")} onClick={this.onButtonClick.bind(this,item)}>
                {item.name}
                </div>
            {item.hasChild&&item.opened===openedMark?<div className="sidebar-child sidebar "><ul>{item.children.map(this.renderButton.bind(this))}</ul></div>:null}
        </li>
    }
    render() {
        const {buttons} = this.state;
        return <div className="sidebar">
            <ul>
                {
                    buttons.map(this.renderButton.bind(this))
                }
            </ul>
        </div>;
    }
}


function lazyFunction(f){
    return function () {
        return f.apply(this, arguments);
    };
}

let lazyTreeType = lazyFunction(function () {
    return buttonTreeType;
});

let buttonTreeType = React.PropTypes.shape({
    id: React.PropTypes.string,
    name: React.PropTypes.string,
    children: React.PropTypes.arrayOf(lazyTreeType)
});

SideBar.propTypes = {
    'buttons': React.PropTypes.arrayOf(buttonTreeType),
    'onSelected': React.PropTypes.func
};

export default SideBar;