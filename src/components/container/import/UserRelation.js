import ImportListPage from "./ImportListPage";
class UserRelation extends ImportListPage{
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "公司编码", key: "corpCode", textAlign: "center", width: "10%"},
                {name: "经纪人姓名", key: "userName", textAlign: "center", width: "13%"},
                {name: "经纪人系统号", key: "userCode", textAlign: "center", width: "13%"},
                {name: "师傅姓名", key: "masterUserName", textAlign: "center", width: "10%"},
                {name: "师傅系统号", key: "masterUserCode", textAlign: "center", width: "10%"},
                {name: "作战组长姓名", key: "teamLeaderUserName", textAlign: "center", width: "11%"},
                {name: "组长系统号", key: "teamLeaderUserCode", textAlign: "center", width: "11%"},
                {name: "担保方式", key: "guaranteeType", textAlign: "center", width: "10%"},
                {name: "导入时间", key: "createTsAlia", textAlign: "center", width: "12%"}
            ]
        };
        this.state.queryParams.importType = 'USER_RELATIONSHIP_IMPORT';
    }
}

export default UserRelation
