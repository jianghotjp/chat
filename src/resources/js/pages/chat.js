var page = new Vue({
  el: '.wrap',
  data: {
    url: urlParas(window.location.href.split('#')[0]),
    msg: [],
    listLength: 0,
    isRoom: false,
    roomId: '',
    myId: local.get('loginInfo').userName,
    speakerId: ''
  },
  created: function() {
    //vue初始化完成后执行的函数
    // this.checkIsRoom();

  },
  methods: {
    scrollToBtm: function() {
      // vue追加元素比计算高度慢，增加延时
      setTimeout(function() {
        var msgWrap = document.getElementById('msg_wrap');
        var msgListHeight = document.getElementById('msg_list').offsetHeight;
        msgWrap.scrollTop = msgListHeight;
      }, 0);
    },
    checkIsRoom: function() {

    }

  },
  watch: {
    msg: {
      deep: true,
      handler: function(val, oldVal) {
        if (oldVal.length == val.length) {
          this.scrollToBtm();
        }
      }
    }
  }
});

var ref = new Wilddog('https://lovechating.wilddogio.com/'),
  // roomRoot = ref.child('room/' + page.roomId + '/message'),
  roomRoot = ref.child('room'),
  record;

if ('string' == typeof page.url.get('roomId') && page.url.get('roomId')) {
  // 从房间列表进入
  page.roomId = page.url.get('roomId');

  getSpeakerId(page.roomId);
  page.isRoom = true;

} else if ('string' == typeof page.url.get('speakerId') && page.url.get('speakerId')) {
  // 从用户列表进入
  page.speakerId = page.url.get('speakerId');

  openkRoom(page.myId, page.speakerId);
  page.isRoom = true;
}



if (page.isRoom) {
  record = ref.child('room/' + page.roomId + '/message');
} else {
  record = ref.child('message');
}

var discussContentInput = document.getElementById('send_content');
var submitBtn = document.getElementById('send_btn');
// var msgWrap = document.getElementById('msg_wrap');
// var msgList = document.getElementById('msg_list');

record.on('child_added', function(snap) {
  var val = snap.val();
  createDisscus(val.content, val.presenter, val.time);
});

//submit listener
submitBtn.addEventListener('click', function() {
  submitDisscus();
});

// 发表消息

function submitDisscus() {
  var content = discussContentInput.value;
  // var presenter = discussPresenterInput.value;

  var presenter = page.myId;
  var date = new Date();
  var time = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  if (!content || !presenter) {
    return false;
  } else {
    // push() 方法可以写入数据。更多写入方式请参考文档。
    record.push({
      content: content,
      presenter: presenter,
      time: time
    });

    discussContentInput.value = '';
  }
}

//添加新消息进页面
function createDisscus(content, presenter, time) {
  page.msg.push({ 'content': content, 'presenter': presenter, 'time': time });
  page.scrollToBtm();
}

//开房间
function openkRoom(myId, speakerId) {
  roomRoot.once('value', function(snap) {
    var val = snap.val();
    var len = Object.getOwnPropertyNames(val).length;
    // page.roomId = len + 1;
    roomRoot.push({
      roomNum: len + 1,
      users: {
        user1: myId,
        user2: speakerId
      },
      message: {}
    });

    getRoomId(myId, speakerId);
  });
}

// 取房间id
function getRoomId(myId, speakerId) {
  roomRoot.once('value', function(snap) {
    var val = snap.val();
    snap.forEach(function(snapChild) {
      var users = snapChild.val().users;
      if (users.user1 == myId && users.user2 == speakerId || users.user2 == myId && users.user1 == speakerId) {
        page.roomId = snapChild.key();
      }

    });

  });
}

// 取已知房间的用户
function getSpeakerId(roomId) {
  roomRoot.once('value', function(snap) {
    var val = snap.val();
    snap.forEach(function(snapChild) {
      var id = snapChild.key();
      if (id == roomId) {
        if (page.myId == snapChild.val().users.user1) {
          page.speakerId = snapChild.val().users.user2;
        } else {
          page.speakerId = snapChild.val().users.user1;
        }
      }

    });

  });
}