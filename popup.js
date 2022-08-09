document.getElementById("btnnew").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: onRun,
    });
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