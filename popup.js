syncGet();


var S="abcdefghijklmnopqrstuvwxyz0123456789"
chrome.storage.sync.get(['code1'], function (value){document.getElementById("code1").textContent = JSON.stringify(value.code1).replace('"', '').replace('"', '');});
chrome.storage.sync.get(['code2'], function (value){document.getElementById("code2").textContent = JSON.stringify(value.code2).replace('"', '').replace('"', '');});

chrome.storage.sync.get(['status'], function (value){ 
    if (JSON.stringify(value.status).replace('"', '').replace('"', '') == "OK") {
        document.getElementById("sync_status").textContent = "同期中";
        document.getElementById("sync_status").style.color = "#008b8b";
    } else {
        document.getElementById("sync_status").textContent = "同期エラー";
        document.getElementById("sync_status").style.color = "#da0b00";
    }

});

chrome.storage.sync.get(['clipboard'], function (value){ 
    document.getElementById("txt").textContent = JSON.stringify(value.clipboard).replace('"', '').replace('"', '');

});



























document.getElementById("btnnew").addEventListener("click", async () => {

    document.getElementById("sync_status").textContent = "  読み込み中...";
    document.getElementById("sync_status").style.color = "#bfefdf";

    var code1 = Array.from(crypto.getRandomValues(new Uint8Array(3))).map((n)=>S[n%S.length]).join('');
    var code2 = Array.from(crypto.getRandomValues(new Uint8Array(3))).map((n)=>S[n%S.length]).join('');
    document.getElementById("code1").textContent = code1;
    document.getElementById("code2").textContent = code2;
    chrome.storage.sync.set({'code1': code1}, function(){});
    chrome.storage.sync.set({'code2': code2}, function(){});


    // sign_up
    const data = 
      {
        "email": "easy_access@" + code1 + code2 +".com",
        "password": "password"
      };

    fetch('http://127.0.0.1:3000/v1/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
        if(response.status!==200)
       {
          throw new Error(response.status)
       }
        var access_token = response.headers.get('access-token');
        var client = response.headers.get('client');
        var expiry = response.headers.get('expiry');
        document.getElementById("sync_status").textContent = "新規取得成功";
        document.getElementById("sync_status").style.color = "#008b8b";
        chrome.storage.sync.set({'status': "OK"}, function(){});
        document.getElementById("txt").textContent = "Welcome to SlickQuickPaste!";
        syncGet();
      })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById("sync_status").textContent = "新規取得失敗";
      document.getElementById("sync_status").style.color = "#da0b00";
      chrome.storage.sync.set({'status': "NG"}, function(){});
    });
  });












  document.getElementById("btnadd").addEventListener("click", async () => {
    document.getElementById("entercode").style.display = 'flex';
  });













  document.getElementById("codeok").addEventListener("click", async () => {
    document.getElementById("sync_status").textContent = "  読み込み中...";
    document.getElementById("sync_status").style.color = "#bfefdf";
    var code1 = document.getElementById("codeform1").value;
    var code2 = document.getElementById("codeform2").value;
    document.getElementById("code1").textContent = code1;
    document.getElementById("code2").textContent = code2;
    chrome.storage.sync.set({'code1': code1}, function(){});
    chrome.storage.sync.set({'code2': code2}, function(){});
    document.getElementById("entercode").style.display = 'none';

    // sign_in
    const data = 
      {
        "email": "easy_access@" + code1 + code2 +".com",
        "password": "password"
      };

    fetch('http://127.0.0.1:3000/v1/auth/sign_in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
        if(response.status!==200)
       {
          throw new Error(response.status)
       }
        var access_token = response.headers.get('access-token');
        var client = response.headers.get('client');
        var expiry = response.headers.get('expiry');
        document.getElementById("sync_status").textContent = "コード保存成功";
        document.getElementById("sync_status").style.color = "#008b8b";
        chrome.storage.sync.set({'status': "OK"}, function(){});
        document.getElementById("txt").textContent = "クラウドと同期中です。数秒後再度SlickQuickPasteを開いてください。";
        syncGet();
      })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
      document.getElementById("sync_status").textContent = "コードが違います";
      document.getElementById("sync_status").style.color = "#da0b00";
      chrome.storage.sync.set({'status': "NG"}, function(){});
    });
  });



  document.getElementById("copybtn").addEventListener("click", async () => {
    // コピー対象をJavaScript上で変数として定義する
    var copyTarget = document.getElementById("txt");
    // コピー対象のテキストを選択する
    copyTarget.select();
    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");
  });







  





















  




async function syncGet() {

  chrome.storage.sync.get(['code1'], function (value){
      var code1 = JSON.stringify(value.code1).replace('"', '').replace('"', '');
      chrome.storage.sync.get(['code2'], function (value){
          var code2 = JSON.stringify(value.code2).replace('"', '').replace('"', '');


          // sign_in
          const data = 
          {
          "email": "easy_access@" + code1 + code2 +".com",
          "password": "password"
          };

          fetch('http://127.0.0.1:3000/v1/auth/sign_in', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          })
          .then(response => {
          if(response.status!==200)
          {
              throw new Error(response.status)
          }
              var access_token = response.headers.get('access-token');
              var client = response.headers.get('client');
              var expiry = response.headers.get('expiry');


              fetch('http://127.0.0.1:3000/v1/users/get', {
                          method: 'GET',
                          headers: {
                          'Accept': 'application/json',
                          'Content-Type': 'application/json',
                          'access-token': access_token,
                          'uid': "easy_access@" + code1 + code2 +".com",
                          'client': client,
                          'expiry': expiry,
                          'token-type': 'Bearer',
                          }
                          })
                          .then(response => {
                              response.json().then(data => {
                                  var clipboard = data.clipboard.text;
                                  chrome.storage.sync.set({'clipboard': clipboard}, function(){});
                              })
                              chrome.storage.sync.set({'status': "OK"}, function(){});
                          })
                          .then(data => {
                              console.log('Success:', data);
                          })
                          
                          .catch((error) => {
                          
                          });


          })
          .then(data => {
          console.log('Success:', data);
          })
          .catch((error) => {
          chrome.storage.sync.set({'status': "NG"}, function(){});
          });
          
          

      });
  });
/*    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await _sleep(7000);
  sync();
*/
}





async function syncPost(send_text) {

chrome.storage.sync.get(['code1'], function (value){
    var code1 = JSON.stringify(value.code1).replace('"', '').replace('"', '');
    chrome.storage.sync.get(['code2'], function (value){
        var code2 = JSON.stringify(value.code2).replace('"', '').replace('"', '');


        // sign_in
        const data = 
        {
        "email": "easy_access@" + code1 + code2 +".com",
        "password": "password"
        };
        const data2 = 
        {
          "insert_text": send_text
        }

        fetch('http://127.0.0.1:3000/v1/auth/sign_in', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => {
        if(response.status!==200)
        {
            throw new Error(response.status)
        }
            var access_token = response.headers.get('access-token');
            var client = response.headers.get('client');
            var expiry = response.headers.get('expiry');


            fetch('http://127.0.0.1:3000/v1/users/edit', {
                        method: 'POST',
                        headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'access-token': access_token,
                        'uid': "easy_access@" + code1 + code2 +".com",
                        'client': client,
                        'expiry': expiry,
                        'token-type': 'Bearer',
                        },
                        body: JSON.stringify(data2),
                        })
                        .then(response => {
                            response.json().then(data => {
                                var clipboard = data.clipboard.text;
                                chrome.storage.sync.set({'clipboard': clipboard}, function(){});
                            })
                            chrome.storage.sync.set({'status': "OK"}, function(){});
                        })
                        .then(data => {
                            console.log('Success:', data);
                        })
                        
                        .catch((error) => {
                        
                        });


        })
        .then(data => {
        console.log('Success:', data);
        })
        .catch((error) => {
        chrome.storage.sync.set({'status': "NG"}, function(){});
        });
        
        

    });
});
/*    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
await _sleep(7000);
sync();
*/
}