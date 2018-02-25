import ListPage from "../ListPage";
import {hashHistory} from "react-router";
import {requestByFetch, parseParamsGet} from "../../../utils/request";
import {formateTimeSimple, formateTimeMonth} from "../../../utils/help";


class ImportListPage extends ListPage{
    constructor(props){
        super(props);
        this.state.queryParams = {
            cityCode: "",
            corpCode: "",
            pageSize: 10, // 默认分页
            currentPage: 0, // 当前页码
            ...props.location.query
        },
        this.state.table.config={

            pager: {
                pageSize: 10,
                clickPager: function (index) {
                    let p = {
                        ...self.queryParams,
                        currentPage: index
                    };

                    self.onQuery(p);
                }
            }
        }
    }

    onQuery(p){
        const path = `/api/config/import/infoQuery/listByType?${parseParamsGet(p)}`; // 真正接口
        this.setState({
            queryParams: p
        });
        requestByFetch(path, "GET").then((res) => {
            res.importList.map((item, index)=>{
                if (item.onDutyTime) {
                    item["onDutyTimeAlia"] = formateTimeSimple(item.onDutyTime);
                }
                if (item.createTs) {
                    item["createTsAlia"] = formateTimeSimple(item.createTs);
                }
                if (item.isJjr) {
                    item["isJjrAlia"] = !item.isJjr ? "否": "是";
                }
                if (item.throwBaseScore) {
                    item["throwBaseScoreAlia"] = !item.throwBaseScore ? "否": "减";
                }
            });
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
