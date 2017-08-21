const fs = require('fs');
const process = require('child_process');
// 先将上次修改的variables.scss 恢复
process.exec('git checkout "src/variables.scss"', function(e, stdout, stderr) {
  if(!e) {
  　　console.log(stdout);
  　　console.log(stderr);
  }

  // 同步获取node_module同级目录下的variables.scss 以此来追加到组件中并生成新的样式
  fs.exists("../../variables.scss", function(exists) {
    if (exists) {
      var data = fs.readFileSync('../../variables.scss');
      fs.appendFile('./src/variables.scss',data,'utf8',function(err){
          if(err){
            console.log(err);
          }
      });
    }
  });
});
