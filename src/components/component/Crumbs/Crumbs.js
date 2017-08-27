import React from 'react';
import './Crumbs.scss';

class Crumbs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {separator} = this.props;
        let names = this.props.names;
        if (typeof names === 'string') {
            names = [names];
        }
        names.unshift('当前位置');
        return <span className="crumbs">
            {
                names.map((item, index) => {
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
