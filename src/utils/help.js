
export function formateTime(times) {
    const time = new Date(times);
  return time.getFullYear() + "年" + (time.getMonth() + 1) + "月" + time.getDate() + "日 " + time.getHours() + "点" + time.getMinutes() + "分" + time.getSeconds() + "秒";
}
