// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios'); // axios 모듈을 추가합니다.

const app = express();
const PORT = 3001; // 포트를 지정합니다.

app.use(cors());

app.get('/api/hospitals', async (req, res) => {
    try {
        const response = await axios.get('http://apis.data.go.kr/B552657/ErmctInfoInqireService', {
            params: {
                ServiceKey: '%2FrilFVcyYLz5RJ%2F5Iof1ljmcMZLSKL8PN4KHwf7o1EwycSKZh2tt93oPUvQc8F1fySNO%2F0%2BpY6TedkID6WEO%2FA%3D%3D'
            },
        });
        res.set('Content-Type', 'text/xml');
        res.send(response.data); // 응답을 클라이언트에 보냅니다.
    } catch (error) {
        console.error(error); // 오류를 콘솔에 출력합니다.
        res.status(500).send(error.message);
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`프록시 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
