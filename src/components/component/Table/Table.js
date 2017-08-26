import React from 'react';
require('./Table.scss');

class Tabel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: props.config,
      data: props.data
    };
    this.onClickFunc = this.onClickFunc.bind(this);
   }
   onClickFunc (index, func) {
    if( typeof func === "function") {
      func(index);
    }
   }

    dealOpt (index, name, func){
     const id = `${name}${index}`;
     return <div className="opt-list" key={id}  onClick={this.onClickFunc.bind(this, index, func )}>{name}</div>
    }

  render() {
    const {data, config} = this.state;
    return (
      <ul className="table-container">
        <li className="container-header">
          {
            config.colum.map((items, indexs)=> {
              const style={
                width: items.width,
                textAlign: items.textAlign
              };
              return <div className="header-item" key={indexs} style={style}>{items.name}</div>
            })
          }
        </li>
        {
        data.map((item, index)=> {
          const row = config.colum.map((cof, indexs)=> {
            const style={
                width: cof.width,
                textAlign: cof.textAlign
            };
            let renderStr = "";

            if (cof.key === "opt"){
              renderStr = cof.content.map((cons, indexOpt)=> {
                return this.dealOpt(index, cons.key, cons.func)
              });

            } else {
              renderStr = item[cof.key];
            }

            return <div key = {indexs} className="list-item" style={style}>{renderStr}</div>
          });
                           
          return  <li className="container-list " key={index}>{row}</li> 
        })
      }              
    </ul>          
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
