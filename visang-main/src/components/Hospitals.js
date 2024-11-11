/* global naver */
import React, { useEffect, useRef } from 'react';

const EmergencyHospitalMap = () => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);

    // 현재 위치 가져오기
    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation을 지원하지 않는 브라우저입니다.");
        }
    };

    // 위치 정보 성공적으로 가져온 경우
    const showPosition = (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const location = new naver.maps.LatLng(latitude, longitude);

        if (!mapRef.current) {
            mapRef.current = new naver.maps.Map('map', {
                center: location,
                zoom: 15
            });
        }

        if (!markerRef.current) {
            markerRef.current = new naver.maps.Marker({
                position: location,
                map: mapRef.current,
                title: "현재 위치"
            });
        } else {
            markerRef.current.setPosition(location);
        }

        mapRef.current.setCenter(location);

        // 현재 위치를 API 요청에 반영하여 병원 데이터 가져오기
        getHospitalData(latitude, longitude);
    };

    // 위치 정보를 가져오는 중 에러 발생 시 처리
    const showError = (error) => {
        switch(error.code) {
            case error.PERMISSION_DENIED:
                alert("사용자가 위치 정보 제공을 거부했습니다.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("위치 정보를 사용할 수 없습니다.");
                break;
            case error.TIMEOUT:
                alert("위치 정보를 가져오는 데 시간이 초과되었습니다.");
                break;
            case error.UNKNOWN_ERROR:
                alert("알 수 없는 오류가 발생했습니다.");
                break;
            default:
                break;
        }
    };

    // 병원 데이터 가져오기
    const getHospitalData = (latitude, longitude) => {
        const apiUrl = `http://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytLcinfoInqire?serviceKey=ABFtCvcDAGqJVnVeX9v0ajxRpRfRq5Yyb%2B8wPnZ0zYWKNfy8VVGudOCd8QYzvRYW%2BRuwv5mEZ9GixK6Cep6nXw%3D%3D&WGS84_LON=${longitude}&WGS84_LAT=${latitude}&pageNo=1&numOfRows=10`;
    
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text(); // XML 응답이므로 text()로 변환
            })
            .then(data => {
                console.log("API 응답 데이터:", data);
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "text/xml");
    
                // XML에서 병원 정보를 가져오기
                const hospitals = xmlDoc.getElementsByTagName("item");
    
                if (hospitals.length > 0) {
                    Array.from(hospitals).forEach(hospital => {
                        const lat = hospital.getElementsByTagName("latitude")[0].textContent;
                        const lon = hospital.getElementsByTagName("longitude")[0].textContent;
                        const name = hospital.getElementsByTagName("dutyName")[0].textContent;
    
                        const marker = new naver.maps.Marker({
                            position: new naver.maps.LatLng(lat, lon),
                            map: mapRef.current,
                            title: name
                        });
    
                        // 병원 마커 클릭 시 이름 표시
                        naver.maps.Event.addListener(marker, 'click', () => {
                            alert(name);
                        });
                    });
                } else {
                    alert("주변에 병원 데이터가 없습니다.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("API 호출에 실패했습니다: " + error.message);
            });
    };
    
    // 초기화
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=y800ba3o9m";
        script.onload = getLocation;
        document.head.appendChild(script);
    }, []);

    return (
        <div>
            <h1>전국 응급의료기관 정보</h1>
            <div id="map" style={{ width: '100%', height: '500px' }}></div>
        </div>
    );
};

export default EmergencyHospitalMap;