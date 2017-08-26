
window.events = {};
// 发布事件
const trigger = (event, ...data) => {
    const fns = events[event];
    // 如果没有对应方法
    if (!fns || fns.length === 0) {
        console.info('缺少监听事件');
        return false;
    }
    // 如果存在对应方法，依次执行
    for ( let i = 0; i <= fns.length - 1; i++) {
        fns[i](...data);
    }
};
// 监听事件
const on = (event, fn) => {
    // 如果尚没有该事件，创建一个数组来存储对应的方法
    if (!events[event]) {
        events[event] = [];
    }
    events[event].push(fn);
};
// 取消监听事件
const off = (event, fn) => {
    const fns = events[event];
    // 如果不存在事件集合
    if (!fns) {
        return false;
    }
    // 如果不存在事件
    if (!fn && fns) {
        fns.length = 0;
    }
    // 取消指定事件
    else {
        for (let i = fns.length - 1; i >= 0; i--) {
            if (fn === fns[i]) {
                fns.splice(i, 1);
            }
        }
    }
};
const PubSub = {
    on: on,
    off: off,
    trigger: trigger
};
export default PubSub;