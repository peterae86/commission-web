import 'whatwg-fetch';

// 登录前的用户请求使用，只携带设备信息
export function parseParamsByJson(jsonBody) {
  return Object.keys(jsonBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(jsonBody[key])}`).join('&');
}

export function parseParamsGet(params) {
    let paramsArray = [];
    Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]));
    return paramsArray.join('&')  ;
}

export function requestByFetch(path, methodOrJsonBody = {}) {
  return new Promise((resolve, reject) => {
    let hearderBody = { method: 'POST' };
    if (typeof methodOrJsonBody === 'string' && methodOrJsonBody.toUpperCase() === 'GET') {
      hearderBody = { method: 'GET' };
    } else {
        let param = {
            ...methodOrJsonBody,
            userCode: "123"
        };
      hearderBody = {
        method: 'POST',
        body: JSON.stringify(param),
      };
    }
    const headerOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      ...hearderBody,
    };
    const requestPath = path;
    fetch(requestPath, headerOptions).then(response => response.json().then(json => ({
        json,
        response,
      })), error => {
        if(error != null) {
          return {
            error
          };
        }
      }).then(({
        json,
        response,
        error
      }) => {
        //当请求不靠谱的时候, 包装一个伪返回
        if(error != null) {
          notify.show({mess:"网络请求出错"});
          return resolve({
            code: "000",
            message: "网络请求出错"
          });
        }
        if (response.status === 200) {
            if (json.code === 0) {
                return resolve(json.data);
            }

        } else if (/^5/.test(response.status)){
          return resolve({
            code: "000",
            message: "网络请求出错"
          });
        }
        return reject(json);
      })
      .catch(
        (locationHref) => {
            console.log(locationHref);
      });
  });
}
