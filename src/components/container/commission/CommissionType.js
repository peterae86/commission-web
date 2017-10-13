import React from "react";
import Crumbs from "../../component/Crumbs/Crumbs";
import Table from "../../component/Table/Table";
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import Dropdown from "../../component/Dropdown/Dropdown";
import ModalAlert from "../../component/ModalAlert/ModalAlert";
import Button from "../../component/Button/Button";

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
            canModify: false,
            lastUpdateTime: '',
            userCode:window.localStorage.getItem("userCode"), // todo 使用lcoalstory
            onConfirm: () => {
            }
        };
        this.onSelectType = this.onSelectType.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentWillMount() {
        const path = `/api/dutyLevelCommission/queryCommissionTypeByUserCode?userCode=${this.state.userCode}`;
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                userCode: res[0].userCode,
                table: {
                    ...this.table,
                    listData: res
                }
            });
        });
        const paths = `/api/dutyLevelCommission/queryCommissionTypeEditableByUserCode?userCode=${this.state.userCode}`;
        requestByFetch(paths, "GET").then((res) => {
            this.setState({
                canModify: res.editable,
                lastUpdateTime: res.lastUpdateTime
            });
        });
    }

    onSelectType(x) {
        this.setState({
            showConfirm:true,
            onConfirm:()=>{
                this.setState({
                    selectedType: x,
                    showConfirm: false
                })
            }
        })
    }

    onSubmit(){
        if (!this.state.canModify) {
            this.setState({
                showConfirm: true,
                message: `公司规定：本人提佣模式(每三个月)只能变更一次，您上次变更时间为${this.state.lastUpdateTime},距今不到三个月。`
            });
            return false;
        }
        if(this.state.userCode && this.state.selectedType) {
            const par = {
                userCode: this.state.userCode,
                commissionMode: this.state.selectedType
            };
            let path = `/api/dutyLevelCommission/changeCommissionMode?${parseParamsGet(par)}`;
            requestByFetch(path, "GET").then((res) => {
                this.setState({
                    showConfirm: true,
                    message: "修改成功"
                });
                setTimeout(()=>{
                    this.props.onJump('/commission');
                },700);

            });
        }else{
            this.props.onJump('/commission');
        }
    }

    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'confirm',
            onCancel: () => {
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
                              placeholder="请选择" value={selectedType} propsLabel="desc"/>
                </div>
                <div className="form commission-form">
                    <Button  onClick={this.onSubmit} styleName="btn-small"  className="btn-back" value="提交"/>
                    <Button  onClick={()=>{
                        this.props.onJump('/commission');
                    }} styleName="btn-small-gray"  className="btn-back" value="返回"/>
                </div>
            </div>
        </div>
    }
}

export default CommissionType
