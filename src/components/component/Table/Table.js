import React from 'react';

require('./Table.scss');

class Tabel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            data: props.data,
            pager: props.pager || {
                pageSize: 0,
                clickPager: function () {

                }
            }
        };
        this.onClickFunc = this.onClickFunc.bind(this);
        this.jumpToBefor = this.jumpToBefor.bind(this);
        this.jumpToNext = this.jumpToNext.bind(this);
        this.jumpTo = this.jumpTo.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const {pager, data} = newProps;
        this.setState({
            pager: pager || {
                pageSize: 0,
                clickPager: function () {

                }
            },
            data: data
        });
    }


    onClickFunc(index, func) {
        if (typeof func === "function") {
            func(index);
        }
    }

    dealOpt(index, name, func) {
        const id = `${name}${index}`;
        return <div className="opt-list" key={id} onClick={this.onClickFunc.bind(this, index, func)}>{name}</div>
    }

    renderPager() {
        let list = [];
        const {totalCount, currentPage, pageSize} = this.state.pager;
        const lenght = Math.ceil(totalCount / pageSize);
        let flag = true;
        for (let i = 0; i < lenght; i++) {

            if (lenght > 5) {
                if (i === 0 || i === (lenght - 1) || i === currentPage) {
                    list.push(<li key={i} className={currentPage === i ? "active" : ""}
                                  onClick={this.jumpToNumber.bind(this, i)}>{i + 1}</li>);
                    flag = true;
                } else if (i > currentPage - 3 && i < currentPage + 3) {
                    list.push(<li key={i} className={currentPage === i ? "active" : ""}
                                  onClick={this.jumpToNumber.bind(this, i)}>{i + 1}</li>);
                    flag = true;
                } else if (flag) {
                    list.push(<li key={i}>...</li>);
                    flag = false;
                } else {
                    continue;
                }
            }
            else {
                list.push(<li key={i} className={currentPage === i ? "active" : ""}
                              onClick={this.jumpToNumber.bind(this, i)}>{i + 1}</li>);
            }

        }
        return list;
    }

    jumpToBefor() {
        this.jumpTo(this.state.pager.currentPage - 1);
    }

    jumpToNext() {
        this.jumpTo(this.state.pager.currentPage + 1);
    }

    jumpTo(index) {
        this.state.pager.clickPager(index);
    }

    jumpToNumber(index) {
        this.jumpTo(index);
    }

    render() {
        const {data, config, pager} = this.state;
        return (
            <div>
                <ul className="table-container">
                    <li className="container-header">
                        {
                            config.column.map((items, indexs) => {
                                const style = {
                                    width: items.width,
                                    textAlign: items.textAlign
                                };
                                return <div className="header-item" key={indexs} style={style}>{items.name}</div>
                            })
                        }
                    </li>
                    {
                        data.length > 0 ? data.map((item, index) => {
                            const row = config.column.map((cof, indexs) => {
                                const style = {
                                    width: cof.width,
                                    textAlign: cof.textAlign
                                };
                                let renderStr = "";

                                if (cof.key === "opt") {
                                    renderStr = cof.content.map((cons, indexOpt) => {
                                        return this.dealOpt(index, cons.key, cons.func)
                                    });

                                } else {
                                    renderStr = item[cof.key];
                                }

                                return <div key={indexs} className="list-item" style={style}>{renderStr}</div>
                            });
                            return <li className="container-list " key={index}>{row}</li>
                        }) : (<p className="table-empty">暂无数据</p>)
                    }
                </ul>
                <ul className="pager-container">
                    {
                        (pager.currentPage !== 0 && Math.ceil(pager.totalCount / pager.pageSize) > 1) ? (
                            <li className="upstairs" onClick={this.jumpToBefor}>上一页</li>) : null
                    }
                    {
                        this.renderPager()
                    }
                    {
                        pager.currentPage < Math.floor(pager.totalCount / pager.pageSize) ? (
                            <li className="upstairs" onClick={this.jumpToNext}>下一页</li>) : null
                    }
                </ul>
            </div>
        );
    }
}

Tabel.propTypes = {
    data: React.PropTypes.array,
    config: React.PropTypes.object
};

Tabel.defaultProps = {
    data: [],
    config: {}
};
export default Tabel;
