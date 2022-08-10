// 拡張機能がインストールされたときの処理
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({'code1': "未"}, function(){});
    chrome.storage.sync.set({'code2': "取得"}, function(){});



    //親メニューの追加
  const parent = chrome.contextMenus.create({
    type: "normal",
    id: "parent",
    title: "SlickClickPasteでクラウドデータと同期",
    contexts: ["all"]
  });

  //子メニューを追加（１つ目）
  const child1 = chrome.contextMenus.create({
    type: "normal",
    id: "child1",
    parentId: "parent",
    title: "クリップボードのデータをクラウドへアップロード",
    contexts: ["page"]
  });
  //子メニューを追加（２つ目）
  const child2 = chrome.contextMenus.create({
    type: "normal",
    id: "child2",
    parentId: "parent",
    title: "クラウドのデータをクリップボードにダウンロード",
    contexts: ["page"]
  });

  //子メニューを追加（１aつ目）
  const child1a = chrome.contextMenus.create({
    type: "normal",
    id: "child1a",
    parentId: "parent",
    title: "クラウドにコピー",
    contexts: ["selection"]
  });

  //子メニューを追加（２aつ目）
  const child2a = chrome.contextMenus.create({
    type: "normal",
    id: "child2a",
    parentId: "parent",
    title: "クラウドのデータを貼り付け",
    contexts: ["selection"]
  });

  //子メニューを追加（３つ目）
  const child3 = chrome.contextMenus.create({
    type: "separator",
    id: "child3",
    parentId: "parent",
    contexts: ["all"]
  });




  //子メニューを追加（４つ目）
  const child4 = chrome.contextMenus.create({
    type: "checkbox",
    id: "child4",
    parentId: "parent",
    title: "クラウドのデータ変更時、クリップボードに自動ダウンロード",
    contexts: ["all"]
  });

  
  });







sync();









chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['popup.js']
    });
  });


async function sync() {

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
    const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await _sleep(7000);
    sync();
}