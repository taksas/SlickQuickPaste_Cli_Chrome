// 拡張機能がインストールされたときの処理
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({'code1': "未"}, function(){});
    chrome.storage.sync.set({'code2': "取得"}, function(){});
    chrome.storage.sync.set({'clipboard': "Slick Quick Pasteへようこそ！　　　　　　　　　　　　　　　　同期の為に必要な「同期コード」を新規取得するか、他の端末で使用しているコードを入力してください。"}, function(){});






  //メニューを追加（１aつ目）
  const child1a = chrome.contextMenus.create({
    type: "normal",
    id: "child1a",
    title: "クラウドにコピー (S.Q.Paste)",
    contexts: ["selection"]
  });

  //メニューを追加（２aつ目）
  const child2a = chrome.contextMenus.create({
    type: "normal",
    id: "child2a",
    title: "クラウドのデータを貼り付け (S.Q.Paste)",
    contexts: ["editable"]
  });






  
  });

/* コンテキストメニューがクリックされた時の処理 */
chrome.contextMenus.onClicked.addListener((info, tab) => {
    switch (info.menuItemId) {

      case "child1a":
        var selection_text = info.selectionText;
        syncPost(selection_text);
        break;
  
      case "child2a":
        syncGet();
        chrome.storage.sync.get(['clipboard'], function (value){
          var clipboardContent = JSON.stringify(value.clipboard).replace('"', '').replace('"', '');
          sendPasteToContentScript(clipboardContent);
        });
        break;
    }
        
 
});








/* 通常処理ここまで */


















function sendPasteToContentScript(toBePasted) {
  // We first need to find the active tab and window and then send the data
  // along. This is based on:
  // https://developer.chrome.com/extensions/messaging
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {data: toBePasted}, function(response){
        console.log(response);
      });
  });
}









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