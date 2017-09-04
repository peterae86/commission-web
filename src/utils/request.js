import 'whatwg-fetch';

// 登录前的用户请求使用，只携带设备信息
export function parseParamsByJson(jsonBody) {
  return Object.keys(jsonBody).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(jsonBody[key])}`).join('&');
}

export function requestByFetch(path, methodOrJsonBody = {}) {
  return new Promise((resolve, reject) => {
    let hearderBody = { method: 'POST' };
    if (typeof methodOrJsonBody === 'string' && methodOrJsonBody.toUpperCase() === 'GET') {
      hearderBody = { method: 'GET' };
    } else {
      hearderBody = {
        method: 'POST',
        body: parseParamsByJson(methodOrJsonBody),
      };
    }
    const headerOptions = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      ...hearderBody,
    };
    const requestPath = `${REQUEST_BASE_PATH}/api`+path;
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
          json.data = typeof json.data === "string" ?
          (() => {
            try{
              return JSON.parse(json.data);
            }catch(e){
              return json.data;
            }
          })() : json.data;
           json.data;
          if (json.code === 7010) {

          } else if(json.code === 3000) { //目前只有这两种错误跳转到500错误页面
            throw "/statics/errorRequest";
        }
        } else if (/^5/.test(response.status)){
          redirectTo("/statics/errorRequest");
          return resolve({
            code: "000",
            message: "网络请求出错"
          });
        }
        return reject(json);
      })
      .catch(
        (locationHref) => {
          redirectTo(locationHref, "replace");
      });
  });
}

  // option包含 cacheTime：缓存失效时间， method：GET或POST
export function requestByCache(path, option) {
  return new Promise((resolve) => {
    const loginId = userCookie.getCookie('loginId') || '';
    const storage = window.localStorage;
    let expiry = BETA_TIME * 60; // 默认缓存时效
    let reqMethod = 'GET';       // 默认request方式
    if (option && typeof option.cacheTime === 'number') {
      expiry = option.cacheTime;
    }
    if (option && typeof option.method === 'string') {
      reqMethod = option.method;
    }

    // 在localstorage取缓存，在有效期内就返回，过期就清楚相关localstorage
    let cacheKey = `${path}/${loginId}`;
    let cached = storage.getItem(cacheKey) || "";
    let whenCached = storage.getItem(cacheKey + ':ts');

    if (!cached && !whenCached) {
      let age = (Date.now() - whenCached) / 1000;
      if (age < expiry) {
        return resolve(JSON.parse(cached));
      } else {
       // 清除旧值
        storage.removeItem(cacheKey);
        storage.removeItem(cacheKey + ':ts');
      }
    }

  });
}



//使用方法 可直接获取到getuserinfo中data的数据,无需在做response.code判断
// getUserInfo().then((data) => {
//   return null;
// });

export function getUserInfo() {
  return new Promise((resolve, reject) => {
    const requestPath = '/v2/user/getUserInfo';
    requestByFetch(requestPath, "GET").then((response) => {
      const data = typeof response.data === 'string' ?
      (() => {
        try{
          return JSON.parse(response.data);
        }catch(e){
          return response.data;
        }
      })() : response.data;
      if (response.code === 2000) {
        return resolve(data);
      } else {
        return reject(response);
      }
    });
  });
}

/**
1、判断是否璇玑风险评测， testStatus   1 未测试 2 已测试
2、判断是否首单   0 未首单   1 首单中(据说已废弃)  2 首单已完成
3、其他跳转到Home页。
**/

const USER_PROCESS_PAGE = {
  QUESTION_TESTING: 'evaluation?testType=minsheg', // 重新评测
  QUESTION_RESULT:'evaluationResult?from=first', // 评测等级
  QUESTION_START: 'evaluation',
  QUESTION_START_BEFOR: 'protocol/ability', // 测评前一个页面
  INVITATION: 'initInvestment?from=login',
  HOME: 'home',
};

function forwardPage(userInfo) { // firstLogin true  第一次登陆

  if (userInfo.msTestStatus === 0 ) {
    // 无测评 无论是否是第一次登陆,一旦无测评 就去评测
    // return USER_PROCESS_PAGE.QUESTION_START;
    return USER_PROCESS_PAGE.QUESTION_START_BEFOR;
  }

  //msTestStatus  0:未测评  1:测评未过期  2:测评已过期
  if (userInfo.msTestStatus === 2) {
    // 测评过期   无论是否是第一次登陆,一旦过期就是重新测评
    return USER_PROCESS_PAGE.QUESTION_TESTING;
  }


  if (userInfo.firstLogin && userInfo.msTestStatus === 1) {
    //第一次登陆且测评没过期 因为过期的情况已经在上面过滤掉了,所以此处剩下的都是第一次登陆且测评没过期的
    return USER_PROCESS_PAGE.QUESTION_RESULT;
  }
  if (userInfo.testStatus === 1 ) {
    // testStatus 1未测评 2 已测评
    return USER_PROCESS_PAGE.QUESTION_START_BEFOR;
  }

  if (userInfo.firstStatus === 0) {
    // 非第一次登陆的用户依次来判断 首单和home
    return USER_PROCESS_PAGE.INVITATION;
  } else {  // 其他情况均跳转首页
    return USER_PROCESS_PAGE.HOME;
  }

}

export function loginForward(flag) {
  //flag 为object 或者 undifind
  const param = typeof flag !== "object" ? {} : flag;
  return new Promise((resolve, reject) => {
    getUserInfo(param).then((data) => {
        if (data === null) {
          return reject('error');
        }
        let forwardParam = {
          ...data,
          ...flag
        };
      return resolve(forwardPage(forwardParam));
    });
  });
}

// 退出登录
export function logOut() {
  return new Promise((resolve, reject) => {
    const reqPath = '/v2/login/logout';
    requestByFetch(reqPath, "GET").then((response) => {
      if (response.code == 2000) {
        return resolve(response);
      }
      return reject(response);
    });
  });
}
