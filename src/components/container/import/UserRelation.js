import ImportListPage from "./ImportListPage";
class UserRelation extends ImportListPage{
    constructor(props){
        super(props);
        this.state.table.config={
            column: [
                {name: "公司编码", key: "corpCode", textAlign: "center", width: "10%"},
                {name: "经纪人姓名", key: "corpCode", textAlign: "center", width: "13%"},
                {name: "经纪人系统号", key: "corpName", textAlign: "center", width: "13%"},
                {name: "师傅姓名", key: "regionCode", textAlign: "center", width: "10%"},
                {name: "师傅系统号", key: "regionName", textAlign: "center", width: "10%"},
                {name: "作战组长姓名", key: "storeCode", textAlign: "center", width: "11%"},
                {name: "组长系统号", key: "storeName", textAlign: "center", width: "11%"},
                {name: "担保方式", key: "userCode", textAlign: "center", width: "10%"},
                {name: "导入时间", key: "createTsAlia", textAlign: "center", width: "12%"}
            ]
        };
        this.state.queryParams.importType = 'USER_RELATIONSHIP_IMPORT';
    }
}

export default UserRelation
