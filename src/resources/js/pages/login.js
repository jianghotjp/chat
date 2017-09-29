var page = new Vue({
  el: '.wrap',
  data: {
    isLogin: true,
    userName: '',
    userPwd: '',
    regName: '',
    regPwd1: '',
    regPwd2: ''
  },
  created: function () {
    //vue初始化完成后执行的函数
    this.getLoginInfo();
  },
  methods: {
    toggleLogin: function () {

      return this.isLogin = this.isLogin ? false : true;
    },
    saveLoginInfo: function () {
      if (!!window.localStorage) {
        // console.log(this.userName);
        var loginInfo = {
          userName: this.userName,
          userPwd: this.userPwd
        };
        local.set('loginInfo', loginInfo, 7 * 24);
      }
      doLogin(page.userName, page.userPwd);
      // toNewPage('index.html', true);
    },
    getLoginInfo: function () {
      if (!!window.localStorage) {
        if (!isEmptyObject(local.get('loginInfo'))) {
          this.userName = local.get('loginInfo').userName;
          this.userPwd = local.get('loginInfo').userPwd;
        }
      }
    },
    register: function () {
      // var msgWrap = document.getElementById('regName2');
      var regName = this.regName;
      var regPwd1 = this.regPwd1;
      var regPwd2 = this.regPwd2;
      if (!regName) {
        mui.toast('请输入用户名');
        return
      }
      if (!regPwd1 || !regPwd2) {
        mui.toast('请输入密码');
        return
      }
      if (regPwd1 != regPwd2) {
        mui.toast('两次输入密码不一致');
        return
      }
      doRregister(regName, regPwd2)
    }
  }
});

var ref = new Wilddog('https://lovechating.wilddogio.com/'),
  record = ref.child('user');

function doRregister(regName, regPwd) {
  // push() 方法可以写入数据。更多写入方式请参考文档。
  record.once('value', function (snap) {
    var val = snap.val();
    var date = new Date();
    var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();

    // snap.forEach(function (snapChild) {
    //   console.log("the", snapChild.key(), "of Bejing is:", snapChild.val());
    // });

    for (users in val) {
      if (val[users].userName == regName) {
        mui.toast('该用户名已被注册')
        return
      }

    }

    record.push({
      userName: regName,
      userPwd: regPwd,
      isLogin: false,
      time: time
    });
    mui.toast('注册成功')
    this.isLogin = true;

  });

}

function doLogin(userName, userPwd) {
  // push() 方法可以写入数据。更多写入方式请参考文档。
  record.once('value', function (snap) {
    var val = snap.val();
    for (users in val) {
      if (val[users].userName == userName) {
        if (val[users].userPwd == userPwd) {
          mui.toast('登录成功');
          // 登录状态置为true
          // TODO 暂时无法置为false
          val[users].isLogin = true;
          // snap.forEach(function (snapChild) {
          //   record.child(snapChild.key()).update({
          //     isLogin: true
          //   })
          // });
          location.replace('index.html');
        } else {
          mui.toast('密码错误');
        }
      }
    }

  });

}