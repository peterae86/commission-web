import ListPage from "../ListPage";
import {hashHistory} from "react-router";
import {requestByFetch} from "../../../utils/request";

class ImportListPage extends ListPage{
    constructor(props){
        super(props);
        this.state.table.config={

        }
    }

    onQuery(){
        const path = this.state.queryUrl + "?" + parseParamsGet(p);//"../data/rankList.json?";
        //    const paths = `/dutyLevelConfig/queryConfigsByCorpCode?${parseParamsGet(param)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        hashHistory.push({
            ...this.props.location,
            query: p
        });
        requestByFetch(path, "GET").then((res) => {
            this.setState({
                table: {
                    ...this.table,
                    listData: res.importList,
                    pager: {
                        ...this.state.table.pager,
                        currentPage: p.currentPage,
                        totalCount: res.totalCount
                    }
                }
            });
        });
    }
}

export default ImportListPage