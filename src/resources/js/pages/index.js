var page = new Vue({
  el: '.wrap',
  data: {
    myId: local.get('loginInfo').userName,
    menus: [{
      link: 'chat.html',
      icon: '',
      name: '大厅'
    }, {
      link: '',
      icon: '',
      name: '私聊'
    }, {
      link: '',
      icon: '',
      name: 'bbs'
    }, {
      link: '',
      icon: '',
      name: '游戏'
    }, {
      link: '',
      icon: '',
      name: '换肤'
    }, {
      link: '',
      icon: '',
      name: '选项'
    }],
    roomList: []

  },
  created: function () {
    //vue初始化完成后执行的函数


  },
  methods: {

  }
});

var ref = new Wilddog('https://lovechating.wilddogio.com/'),
  roomRoot = ref.child('room'),
  record;

roomRoot.once('value', function (snap) {
  var val = snap.val();
  var len = Object.getOwnPropertyNames(val).length;
  var i = 0;
  snap.forEach(function (snapChild) {
    if (i < 10 || i < len) {
      // var roomid = snapChild.key()
      msgRef = ref.child('room/' + snapChild.key() + '/message');
      var roomItem = {};
      roomItem.message = {};
      // roomItem.roomId = snapChild.val().roomId;
      // roomItem.href = 'chat.html?roomId=' + snapChild.val().roomId;
      roomItem.roomId = snapChild.key();
      roomItem.href = 'chat.html?roomId=' + snapChild.key();
      if(snapChild.val().users){
        if(page.myId == snapChild.val().users.user1){
          roomItem.speaker = snapChild.val().users.user2;
        }else if(page.myId == snapChild.val().users.user2){
          roomItem.speaker = snapChild.val().users.user1;
        }else{
          roomItem.speaker = '';
        }
        if(roomItem.speaker){
          msgRef.limitToLast(1).once('value', function (lastMessage) {
            for (var i in lastMessage.val()) {
              for (var b in lastMessage.val()[i]) {
                roomItem.message[b] = lastMessage.val()[i][b];
              }
            }
            page.roomList.push(roomItem);
          });
        }
        
      }

    } else {
      return;
    }
    i++;
  });

});