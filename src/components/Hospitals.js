import React, { useEffect, useState } from 'react';

const HospitalList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/api/hospitals') // XML 형식으로 데이터를 가져오는 URL
            .then(response => {
                if (!response.ok) {
                    throw new Error(`서버 응답 에러: ${response.status}`);
                }
                return response.text(); // XML 형식으로 응답받기
            })
            .then(xmlText => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

                // 예를 들어, <item> 태그를 찾고 필요한 정보를 추출합니다.
                const items = xmlDoc.getElementsByTagName('item');
                const hospitalsArray = Array.from(items).map(item => ({
                    name: item.getElementsByTagName('name')[0].textContent,
                    location: item.getElementsByTagName('location')[0].textContent,
                    // 필요한 다른 필드 추가
                }));

                setHospitals(hospitalsArray);
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
                    {hospital.name} - {hospital.location}
                </li>
            ))}
        </ul>
    );
};

export default HospitalList;
