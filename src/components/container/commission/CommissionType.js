import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import {requestByFetch} from "../../../utils/request";
import Dropdown from "../../component/Dropdown/Dropdown";
import ModalAlert from "../../component/ModalAlert/ModalAlert";

class CommissionType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //面包屑
            pathNames: props.pathNames,
            //表格配置
            table: {
                listData: [], //数据列表
                config: {
                    column: [
                        {name: "本人提佣方式", key: "commissionMode", textAlign: "center", width: "50%"},
                        {name: "状态", key: "statusDesc", textAlign: "center", width: "50%"}
                    ]
                }
            },
            showConfirm: false,
            modifyModal: false,
            message: "请确认：是否对提用方式进行修改！", // alert message
            formData: [],
            selectedType:'',
            onConfirm: () => {
            }
        };
        this.onSelectType = this.onSelectType.bind(this);
    }

    componentWillMount() {
        const path = '/data/commissiontype.json';
        //const path = '/dutyLevelCommission/queryCommissionTypeByUserCode';
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res
                }
            });
        });
    }

    onSelectType(x) {
        this.setState({
            showConfirm:true,
            onConfirm:()=>{
                debugger
                this.setState({
                    selectedType: x,
                    showConfirm: false
                })
            }
        })
    }

    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'confirm',
            onCancel: () => {
                debugger
                this.setState({showConfirm: false});
            },
            onConfirm: this.state.onConfirm
        };
        return <ModalAlert {...modalProps} />
    }

    render() {
        const options = [{
            value: "BASE_SALARY",
            desc: "底薪"
        }, {
            value: "DOUBLE_SALARY",
            desc: "双薪"
        }];
        const {table, pathNames, selectedType} = this.state;
        return <div className="rank-container">
            {this.renderAlert()}
            <div className="container-title">
                <Crumbs names={pathNames}/>
            </div>
            <Table data={table.listData} config={table.config} pager={table.pager}/>
            <div className="container-bottom">
                <div className="form">
                    <span>提佣方式选择：</span>
                    <Dropdown onSelect={this.onSelectType} options={options}
                              placeholder="请选择" value={selectedType} defaultOption={options[1]} propsLabel="desc"/>
                </div>
            </div>
        </div>
    }
}

export default CommissionType