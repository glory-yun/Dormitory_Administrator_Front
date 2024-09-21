import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../css/User.module.css';

export default function User() {
    const [userdata, setUserdata] = useState([]); // 전체 사용자 데이터
    const [searchTerm, setSearchTerm] = useState(''); // 검색어 저장
    const [filteredData, setFilteredData] = useState([]); // 필터링된 데이터

    useEffect(() => {
        // 데이터를 불러오는 비동기 함수
        const fetchUserRequests = async () => {
            try {
                const response = await axios.get('/admin/students'); // 서버에서 데이터 가져오기
                setUserdata(response.data.students); // 전체 데이터를 상태에 저장
                setFilteredData(response.data.students); // 초기에는 전체 데이터를 필터링 데이터로 설정
                console.log(response.data.students);
            } catch (err) {
                console.error('Error fetching student data:', err);
            }
        };
        fetchUserRequests();
    }, []);

    // 입력값이 변경될 때마다 필터링된 데이터를 업데이트하는 함수
    const handleSearch = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term === '') {
            setFilteredData(userdata); // 검색어가 없으면 전체 데이터 표시
        } else {
            const filtered = userdata.filter(user =>
                user.NAME.toLowerCase().includes(term.toLowerCase()) // 이름 필터링 (대소문자 구분 없음)
            );
            setFilteredData(filtered);
        }
    };

    // 필터링된 데이터 또는 전체 데이터를 화면에 보여주는 함수
    const showUser = () => {
        return (
            <div className={styles.wrap}>
                {
                    filteredData.map((user, i) => {
                        return (
                            <div key={i} className={styles.Content}>
                                <div style={{ flex: 1 }}>{user.STNUM}</div>
                                <div style={{ flex: 1 }}>{user.DEPARTMENT}</div>
                                <div style={{ flex: 1 }}>{user.NAME}</div>
                                <div style={{ flex: 1 }}>{user.SEX === 1 ? '여' : '남'}</div>
                                <div style={{ flex: 2 }}>{user.PHONE}</div>
                                <div style={{ flex: 1 }}>{user.ROOM}</div>
                                <div style={{ flex: 1 }}>{user.SEATNUM}</div>
                                <div style={{ flex: 1 }}>{user.away_count}</div>
                                <div style={{ flex: 1 }}>{user.SLEEPCOUNT}</div>
                            </div>
                        );
                    })
                }
            </div>
        );
    };

    return (
        <>
            <div className={styles.Container}>

                {/* Title */}
                <h1 className={styles.Title}>입실자 정보</h1>

                {/* 전체내용 보여주기 */}
                <div className={styles.ContentContainer}>
                    <div className={styles.Content}>
                        {/* 왼쪽에 총 명수 */}
                        <div>총 {filteredData.length}명</div>

                        {/* 오른쪽에 이름 검색 입력란 */}
                        <input
                            type="text"
                            placeholder="이름으로 검색"
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ padding: '5px' }}
                        />
                    </div>




                    {/* 테이블 헤더 */}
                    <div className={styles.Content} style={{ backgroundColor: '#eee' }}>
                        <div style={{ flex: 1 }}>학번</div>
                        <div style={{ flex: 1 }}>학과</div>
                        <div style={{ flex: 1 }}>이름</div>
                        <div style={{ flex: 1 }}>성별</div>
                        <div style={{ flex: 2 }}>연락처</div>
                        <div style={{ flex: 1 }}>호수</div>
                        <div style={{ flex: 1 }}>자리번호</div>
                        <div style={{ flex: 1 }}>점호 미참여</div>
                        <div style={{ flex: 1 }}>외박 신청</div>
                    </div>

                    {/* 필터링된 사용자 데이터를 보여주는 부분 */}
                    {showUser()}
                </div>
            </div>
        </>
    );
}
