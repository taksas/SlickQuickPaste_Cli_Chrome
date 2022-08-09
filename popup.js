document.getElementById("btnnew").addEventListener("click", async () => {
    document.getElementById("code1").textContent = "123";
    document.getElementById("code2").textContent = "456";
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: onRun,
    });
  });


  document.getElementById("btnadd").addEventListener("click", async () => {
    document.getElementById("entercode").style.display = 'flex';
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