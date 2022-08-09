// 拡張機能がインストールされたときの処理
chrome.runtime.onInstalled.addListener(function(){
    chrome.storage.sync.set({'code1': "未"}, function(){});
    chrome.storage.sync.set({'code2': "取得"}, function(){});
  });



chrome.storage.sync.get(['code1'], function (value){document.getElementById("code1").textContent = JSON.stringify(value.code1).replace('"', '').replace('"', '');});
chrome.storage.sync.get(['code2'], function (value){document.getElementById("code2").textContent = JSON.stringify(value.code2).replace('"', '').replace('"', '');});


document.getElementById("btnnew").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: onRun,
    });
  });



  document.getElementById("btnadd").addEventListener("click", async () => {
    document.getElementById("entercode").style.display = 'flex';
  });



  document.getElementById("codeok").addEventListener("click", async () => {
    var code1 = document.getElementById("codeform1").value;
    var code2 = document.getElementById("codeform2").value;
    document.getElementById("code1").textContent = code1;
    document.getElementById("code2").textContent = code2;
    chrome.storage.sync.set({'code1': code1}, function(){});
    chrome.storage.sync.set({'code2': code2}, function(){});
    document.getElementById("entercode").style.display = 'none';
  });



  document.getElementById("copybtn").addEventListener("click", async () => {
    // コピー対象をJavaScript上で変数として定義する
    var copyTarget = document.getElementById("txt");
    // コピー対象のテキストを選択する
    copyTarget.select();
    // 選択しているテキストをクリップボードにコピーする
    document.execCommand("Copy");
  });







  
  function onRun() {
    
    const data = 
      {
        "email": "test7@example.com",
        "password": "password"
      };

    fetch('http://127.0.0.1:3000/v1/auth', {
      method: 'POST', // or 'PUT'
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(response => {
        let access_token = response.headers.get('access-token');
        let client = response.headers.get('client');
        let expiry = response.headers.get('expiry');
        console.log('access_token:', access_token);
        console.log('client:', client);
        console.log('expiry:', expiry);
      })
    .then(data => {
      console.log('Success:', data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }