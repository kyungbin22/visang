const cors = require('cors');
const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(cors());

// 재시도 요청을 위한 함수
async function fetchWithRetry(url, options, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(url, options);
            return response;
        } catch (error) {
            if (i < retries - 1) {
                console.log(`재시도 중... (${i + 1}/${retries})`);
                await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기 후 재시도
            } else {
                throw error;
            }
        }
    }
}

app.get('/api/hospitals', async (req, res) => {
    try {
        const url = 'https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire';
        const params = {
                //serviceKey: '%2FrilFVcyYLz5RJ%2F5Iof1ljmcMZLSKL8PN4KHwf7o1EwycSKZh2tt93oPUvQc8F1fySNO%2F0%2BpY6TedkID6WEO%2FA%3D%3D'; // 인코딩 인증키
                serviceKey: '/rilFVcyYLz5RJ/5Iof1ljmcMZLSKL8PN4KHwf7o1EwycSKZh2tt93oPUvQc8F1fySNO/0+pY6TedkID6WEO/A==', // 디코딩 인증키
                STAGE1: '서울특별시', // 서울특별시로 요청
        };

        // 타임아웃을 늘리고 재시도 함수 사용
        const response = await fetchWithRetry(url, { params, timeout: 10000 });
        const hospitals = response.data.response.body.items.item;

        console.log("추출된 병원 데이터:", hospitals); // 로그로 응답을 출력

        res.json(hospitals);
    } catch (error) {
        console.error("API 요청 에러:", error.message); // 에러 로그 출력
        res.status(500).send(error.message);
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`프록시 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
