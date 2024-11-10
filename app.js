const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// مسار ملف الرسائل
const messagesFilePath = path.join(__dirname, 'messages.json');

// التأكد من وجود ملف messages.json وتنسيقه بشكل صحيح
if (!fs.existsSync(messagesFilePath)) {
  fs.writeFileSync(messagesFilePath, JSON.stringify({ messages: [] }, null, 2));
}

// API لاستقبال الرسالة
app.get('/message', (req, res) => {
  const message = req.query.message;

  if (message) {
    // قراءة محتويات ملف messages.json
    fs.readFile(messagesFilePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading messages file');
      }

      // تحويل المحتوى إلى JSON
      let messagesData = JSON.parse(data);

      // إضافة الرسالة الجديدة
      messagesData.messages.push({ message, timestamp: new Date() });

      // كتابة البيانات مرة أخرى في ملف messages.json
      fs.writeFile(messagesFilePath, JSON.stringify(messagesData, null, 2), (err) => {
        if (err) {
          return res.status(500).send('Error writing to messages file');
        }
        res.send('Message saved successfully');
      });
    });
  } else {
    res.status(400).send('Message parameter is required');
  }
});

// تشغيل السيرفر
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});