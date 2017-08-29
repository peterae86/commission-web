import React from 'react';
import './Crumbs.scss';

class Crumbs extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.state = {
            names : this.props.names
        };
        if (typeof this.state.names === 'string') {
            this.state.names = [names];
        }
        //names.unshift('当前位置');
    }

    render() {
        const {separator} = this.props;
        return <span className="crumbs">
            {
                this.state.names.map((item, index) => {
                    return <span
                        key={index}
                    >
                        {index > 0 ? <span className="crumb-separator">{separator}</span> : null}
                        <span className='crumb-name'>{item}</span>
                    </span>
                })
            }
        </span>
    }
}

Crumbs.propTypes = {
    names: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.array]
    )
};

Crumbs.defaultProps = {
    names: [],
    separator: '>'
};

export default Crumbs
