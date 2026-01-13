document.addEventListener('DOMContentLoaded', loadRecords);

document.getElementById('accountingForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    
    if (!type || isNaN(amount) || amount <= 0) {
        alert('請選擇類型並輸入有效的金額。');
        return;
    }
    
    // 記錄當下的日期與時間
    const now = new Date();
    const timestamp = now.toISOString();
    
    const record = {
        type: type,
        amount: amount,
        timestamp: timestamp
    };
    
    saveRecord(record);
    displayRecord(record);
    document.getElementById('message').textContent = '記錄成功！';
    document.getElementById('accountingForm').reset();
});

function saveRecord(record) {
    let records = JSON.parse(localStorage.getItem('accountingRecords')) || [];
    records.push(record);
    localStorage.setItem('accountingRecords', JSON.stringify(records));
}

function loadRecords() {
    let records = JSON.parse(localStorage.getItem('accountingRecords')) || [];
    records.forEach(displayRecord);
}

function displayRecord(record) {
    const list = document.getElementById('recordsList');
    const li = document.createElement('li');
    const date = new Date(record.timestamp).toLocaleString('zh-TW');
    li.textContent = `${date} - ${record.type === 'income' ? '收入' : '支出'}: ${record.amount}`;
    list.appendChild(li);
}