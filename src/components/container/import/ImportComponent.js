import React from "react";
import Upload from 'rc-upload';
import Table from '../../component/Table/Table';
import Crumbs from '../../component/Crumbs/Crumbs';
import ModalAlert from '../../component/ModalAlert/ModalAlert';
import Modal from '../../component/Modal/Modal';
import {requestByFetch} from '../../../utils/request.js';
class  ImportComponent extends React.Component{
    constructor(props){
        super();
        this.state = {
            pathNames: props.pathNames,
            listData: [],
            importType: "",
            showImportant: false,
            showConfirm: false,
            message: "", // alert message
            config: {
                column: [
                    {name: "导入信息项", key: "name", textAlign: "center", width: "50%"},
                    {
                        name: "操作", key: "opt", textAlign: "center", width: "50%", content: [
                            {
                                key: "操作历史",
                                func: (index) => {
                                    this.props.onJump('/import/history');
                                }
                            },
                            {
                                key: "修改",
                                func: (index) => {

                                }
                            },
                            {
                                key: "导入",
                                func: (index) => {
                                    this.setState({
                                        showImportant: true,
                                        importType: this.state.listData[index].importType
                                    });
                                }
                            }
                    ]}
                ]
            }
        }
        const that = this;
        this.uploaderProps = {
             self: that,
             action: '/upload.do', // 请求地址
             data: { importType: this.state.importType},
            //  headers: {
            //    Authorization: 'xxxxxxx',
            //  },
             multiple: false, // 能否一次上传多个
             beforeUpload (file) {
                 const strRegex = "(.xls|.xlsx)$"; //用于验证表格扩展名的正则表达式
                 const re=new RegExp(strRegex);
                 if (!re.test(file.name.toLowerCase())){
                   this.self.checkError("导入文件格式仅支持.xls与xlsx");
                   return false;
                 }
             },
             onStart: (file) => {
               console.log('onStart', file.name);
               // this.refs.inner.abort(file);
             },
             onSuccess(file) {
               console.log('onSuccess', file);
             },
             onProgress(step, file) {
               console.log('onProgress', Math.round(step.percent), file.name);
             },
             onError(err) {
               this.self.checkError("发生未知错误,请稍后再试");
             }
        };
        this.checkError = this.checkError.bind(this);
    }

    componentWillMount() {
        this.getList();
    }
    // 渲染碳层
    renderAlert() {
        const modalProps = {
            show: this.state.showConfirm,
            message: this.state.message,
            type: 'alert',
            onCancel: () => {
                this.setState({showConfirm: false});
            },
        };
        return <ModalAlert {...modalProps} />
    }
    getList() {
        const path = "../data/ImportantList.json?";

        requestByFetch(path, "GET").then((res) => {
            this.setState({
                listData: res
            });
        });
    }

    checkError (mess) {
        this.setState({
            showConfirm: true,
            message: mess
        });
    }

    render(){

        const {listData, config, pathNames ,showImportant} = this.state;
        return (
            <div className="import-container">
                <Crumbs names={pathNames}/>
                <div className="import-table">
                    <Table data={listData} config={config} />
                </div>
                <div className="import-tips">
                    <p>说明:</p>
                    <p>1.Excel中的内容完全按照页面表格展示顺序</p>
                    <p>2.每个字段均为必填</p>
                    <p>3.日期格式: yyyy年mm月dd日</p>
                    <p>4.导入文件格式: .xls与xlsx</p>
                </div>
                {this.renderAlert()}
                {
                    showImportant ?
                    (<Upload {...this.uploaderProps} ref="inner">导入</Upload>) :
                    null
                }

            </div>

        )
    }
}

export default ImportComponent;
