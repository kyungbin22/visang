// HospitalList.js
import React, { useEffect, useState } from 'react';

const HospitalList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/hospitals')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`서버 응답 에러: ${response.status}`);
                }
                return response.json(); // JSON 형식으로 응답받기
            })
            .then(data => {
                setHospitals(data);
            })
            .catch(error => setError(error.message));
    }, []);

    if (error) {
        return <div>데이터를 불러오는 중 오류가 발생했습니다: {error}</div>;
    }

    return (
        <ul>
            {hospitals.map((hospital, index) => (
                <li key={index}>
                    {hospital.dutyName} - 전화번호: {hospital.dutyTel3}
                </li>
            ))}
        </ul>
    );
};

export default HospitalList;
