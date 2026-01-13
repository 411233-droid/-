# 計帳程式

這是一個簡單的計帳程式，前端使用 HTML5 和 JavaScript。本地版本使用瀏覽器的 localStorage 存儲記錄，可升級為使用 Google Sheets 和 GAS。

## 功能

- 選擇收入或支出
- 輸入金額
- 自動記錄記帳當下的日期與時間
- 本地存儲和顯示記錄

## 本地測試

直接打開 `index.html` 在瀏覽器中測試。記錄將存儲在瀏覽器的 localStorage 中。

## 升級到 Google Sheets 和 GAS

如果要將記錄發送到後端，請按照以下步驟。

### 1. 創建 Google Sheet

1. 前往 [Google Sheets](https://sheets.google.com)。
2. 創建一個新試算表。
3. 命名第一個工作表為 "Records"。
4. 在第一行添加標題：A1: Timestamp, B1: Type, C1: Amount。

### 2. 創建 Google Apps Script

1. 在試算表中，點擊 "Extensions" > "Apps Script"。
2. 刪除預設代碼，並貼上以下代碼：

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Records');
    sheet.appendRow([data.timestamp, data.type, data.amount]);
    return ContentService
      .createTextOutput(JSON.stringify({status: 'success'}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({status: 'error', message: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

3. 保存腳本。

### 3. 部署 Web App

1. 點擊 "Deploy" > "New deployment"。
2. 選擇類型為 "Web app"。
3. 設定描述，執行為 "Me"，誰可以存取為 "Anyone"。
4. 點擊 "Deploy"，複製生成的 URL。

### 4. 更新前端代碼

1. 在 `js/app.js` 中，將本地存儲邏輯替換為 fetch 請求：

```javascript
// 替換 saveRecord 和 displayRecord 調用為：
const gasUrl = 'YOUR_GAS_WEB_APP_URL'; // 替換為您的 URL

fetch(gasUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(record)
})
.then(response => response.json())
.then(data => {
    document.getElementById('message').textContent = '記錄成功！';
    document.getElementById('accountingForm').reset();
})
.catch(error => {
    console.error('Error:', error);
    document.getElementById('message').textContent = '記錄失敗，請重試。';
    document.getElementById('message').style.color = 'red';
});
```

### 5. 部署到 GitHub Pages

1. 將此專案上傳到 GitHub 倉庫。
2. 在倉庫設定中，啟用 GitHub Pages，選擇來源為 "main" 分支。
3. 訪問生成的 URL 即可使用。

## 使用方法

1. 打開網頁。
2. 選擇收入或支出。
3. 輸入金額。
4. 點擊提交。
5. 記錄將顯示在下方列表中，並存儲在本地。