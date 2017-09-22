import React from "react";
import Upload from 'rc-upload';
import Table from '../../component/Table/Table';
import Button from '../../component/Button/Button';
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
            uploadTips: "请选择需要导入的文件",
            onUploading: false,
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
                                        alertTitle: this.state.listData[index].name,
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
             name: "productFile",
             action: '/config/import/informationImport', // 请求地址
             data: { importType: this.state.importType},
            //  headers: {
            //    Authorization: 'xxxxxxx',
            //  },
            style: {
                background: "#2085F8",
                color: "#fff",
                padding: "5px 20px",
                borderRadius: "20px"
            },
             multiple: false, // 能否一次上传多个
             beforeUpload (file) {
                 const strRegex = "(.xls|.xlsx)$"; //用于验证表格扩展名的正则表达式
                 const re=new RegExp(strRegex);
                 if (!re.test(file.name.toLowerCase())){
                   that.checkError("导入文件格式仅支持.xls与xlsx");
                   return false;
                 }
             },
             onStart (file) {
                 that.setState({
                     onUploading: true,
                     uploadTips: "开始上传，请勿离开当前页面"
                 });
             },
             onSuccess(file) {
                 that.setState({
                     uploadTips: "导入成功",
                     onUploading: false,
                 });
             },
             onProgress(step, file) {
               console.log('onProgress', Math.round(step.percent), file.name);
             },
             onError(err) {
               this.self.checkError("发生未知错误,请稍后再试");
             }
        };
        this.checkError = this.checkError.bind(this);
        this.comfirmFunc = this.comfirmFunc.bind(this);
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
            message: mess,
            uploadTips: "请选择需要导入的文件",
            onUploading: false,
        });
    }

    comfirmFunc() {
        if (this.state.onUploading) {
            this.setState({
                showConfirm: true,
                message: "正在上传，请稍后"
            });
            return false;
        }
        this.setState({
            alertTitle: "",
            showImportant: false,
            message: ""
        });
    }

    render(){

        const {listData, config, pathNames ,showImportant, alertTitle,uploadTips} = this.state;
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
                    (
                        <div className="upload-alert">
                            <div className="upload">
                                <div className="upload-title">{alertTitle}</div>
                                <div className="upload-body">
                                    <p className="upload-tips">{uploadTips}</p>
                                    <Upload {...this.uploaderProps} ref="inner">导入</Upload>
                                </div>

                                <div className="upload-btn">
                                    <Button value="确定" styleName="btn-middle" onClick={this.comfirmFunc}/>
                                    <Button value="取消" styleName="btn-middle-gray" onClick={this.comfirmFunc}/>
                                </div>
                            </div>
                        </div>

                    ) :
                    null
                }

            </div>

        )
    }
}

export default ImportComponent;
