import React from 'react';

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};

        function createButtons(x) {
            let res = {
                hasChild: x.children && x.children.length > 0,
                opened: false,
                selected: false,
                ...x
            };
            if (res.hasChild) {
                res.children.map(createButtons)
            }
        }

        state.buttons = props.buttons.map(createButtons);
    }

    render() {
    }
}


function lazyFunction(f) {
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