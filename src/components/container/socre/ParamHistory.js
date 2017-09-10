import History from '../History';

class ParamHistory extends History {
    constructor(props) {
        super(props);
        this.state.queryUrl = '../data/rankHistory.json';//'/dutyLevelConfig/queryConfigsByCorpCode';
        this.state.queryType = 'JI_FEN_CAN_SHU';
    }
}

export default ParamHistory;