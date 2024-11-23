require('dotenv').config(); // .env 파일 로드
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/hospitals', async (req, res) => {
    try {
        const url = 'https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEmrrmRltmUsefulSckbdInfoInqire';
        const params = {
            serviceKey: process.env.API_SERVICE_KEY, // 환경 변수 사용
            STAGE1: '서울특별시'
        };
        
        const response = await axios.get(url, { params, timeout: 10000 });
        const hospitals = response.data?.response?.body?.items?.item;

        if (!hospitals) {
            console.error("API 응답 데이터에 items가 없습니다:", response.data);
            return res.status(500).send("API 응답에 오류가 있습니다.");
        }

        console.log("추출된 병원 데이터:", hospitals);
        res.json(hospitals); // JSON 형식으로 응답
    } catch (error) {
        console.error("API 요청 에러:", error.message);
        res.status(500).send("서버 오류가 발생했습니다.");
    }
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`프록시 서버가 포트 ${PORT}에서 실행 중입니다`);
});
