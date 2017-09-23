import History from '../History';

class RankHistory extends History {
    constructor(props) {
        super(props);
        // this.state.queryUrl = '/data/rankHistory.json';
        this.state.queryUrl = '/api/operateRecord/queryByPage';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryType = 'ZHI_JI_GUAN_LI';
    }
}

export default RankHistory;
