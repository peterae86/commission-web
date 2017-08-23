## Toast 逻辑

#### Toast容器位置在React页面APP.js中:
```
<div id="toast-wrapper" className="toast-wrapper" />
```

#### 暴漏方法：  
hide()    判断是否存在toast div，如果有隐藏并调用unmountComponentAtNode移除react元素    
show()    判断是否存在toast div和toast内容，渲染toast内容   
status()  判断是否存在toast div和toast内容   

#### ISSUE:   
1、Toast.show调用时会不断闪现   
初步判断：怀疑有两个定时器不断充值opacity     
解决办法：
1. componentWillUnmount时移除定时器
2. 每次show之前调用hide方法，销毁toast div内部元素
