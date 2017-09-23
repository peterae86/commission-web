import History from '../History';

class ComHistory extends History {
    constructor(props) {
        super(props);
        // this.state.queryUrl = '../data/rankHistory.json';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryUrl = '/api/operateRecord/queryByPage'
        this.state.queryType = 'TI_YONG_XI_SHU';
    }
}

export default ComHistory;
