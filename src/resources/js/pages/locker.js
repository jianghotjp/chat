var page = new Vue({
  el: '.wrap',
  data: {
    isLocked: false

  },
  created: function () {
    //vue初始化完成后执行的函数
    this.canIuse();
    this.reset();
    this.lock();
  },
  methods: {
    lock: function () {
      // 判断是否设置过
      if (!!window.localStorage) {
        if (!isEmptyObject(local.get('lockPoints')) && 'string' == typeof local.get('lockPoints')) {
          this.isLocked = true;
        }
      }
    },
    canIuse: function () {
      if (!!window.localStorage) {

      } else {
        mui.alert('您的手机不支持该功能');
        setTimeout(function () {
          mui.back();
        }, 1000);
      }
    },
    reset: function () {
      if ('string' == typeof page.url.get('reset') && page.url.get('reset')) {
        // this.isLocked = false;
        local.set('lockPoints');
      }
    }
  }
});


mui.init();
//处理事件
var holder = document.querySelector('#holder'),
  alert = document.querySelector('#alert'),
  record = [];
holder.addEventListener('done', function (event) {
  var rs = event.detail;

  if (page.isLocked) {
    //   解锁
    if (rs.points.join('') == local.get('lockPoints')) {
      mui.toast('解锁成功');
    } else {
      mui.toast('密码输入错误');
    }
    rs.sender.clear();

  } else {
    // 设置手势

    if (rs.points.length < 4) {
      alert.innerText = '设定的手势太简单了';
      record = [];
      rs.sender.clear();
      return;
    }
    //   console.log(rs.points.join(''));
    record.push(rs.points.join(''));
    if (record.length >= 2) {
      if (record[0] == record[1]) {
        alert.innerText = '手势设定完成';
        //保存手势
        if (!!window.localStorage) {
          local.set('lockPoints', record[1]);
        }
        setTimeout(function () {
          mui.back();
        }, 500);
      } else {
        alert.innerText = '两次手势设定不一致';
      }
      rs.sender.clear();
    } else {
      alert.innerText = '请确认手势设定';
      rs.sender.clear();
    }
  }
});