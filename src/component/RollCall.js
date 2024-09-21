import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../css/RollCall.module.css';
import RollCallModal from "./Modal";


export default function RollCall() {
    const [currentDate, setCurrentDate] = useState(''); // 현재 날짜 저장
    const [showIncomplete, setShowIncomplete] = useState(false); // 체크박스 상태 저장
    const [modalData, setModalData] = useState(null); // 모달에 표시할 데이터
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 창 열림 여부
    const [rollcallList, setRollcallList] = useState([]); // 서버에서 받아올 데이터 저장

    // 현재 날짜 설정
    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
        const formattedDate = `${year}.${month}.${day} (${dayOfWeek})`;
        setCurrentDate(formattedDate);
    }, []);

    // 서버에서 데이터 가져오기
    useEffect(() => {
        const fetchRollCallData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/admin/clean_list'); // 서버에서 데이터를 GET 요청
                groupByRoom(response.data); // 데이터를 CROOM 기준으로 그룹화하여 처리

                
            } catch (err) {
                console.error("Error fetching roll call data:", err);
            }
        };

        fetchRollCallData(); // 서버 데이터 가져오기 실행
    }, []); // 빈 배열을 전달해 컴포넌트가 처음 렌더링될 때 한 번만 실행

    // CROOM 기준으로 데이터를 그룹화하는 함수
    const groupByRoom = (data) => {
        const groupedData = data.reduce((acc, student) => {
            const room = student.CROOM;
            if (!acc[room]) {
                acc[room] = [];
            }
            acc[room].push(student);
            return acc;
        }, {});
        
        // 각 호실의 인원수 및 상태를 계산
        const roomList = Object.keys(groupedData).map(room => ({
            roomNumber: room,
            personnel: groupedData[room].length,
            data : groupedData[room],
        }));

        setRollcallList(roomList); // 그룹화된 데이터를 상태로 저장
    };

    const handleCheckboxChange = (e) => {
        setShowIncomplete(e.target.checked); // 체크박스 상태 변경
    };

    const openModal = (data) => {
        setModalData(data); // 클릭된 행의 데이터를 설정
        setIsModalOpen(true); // 모달 창 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 창 닫기
        setModalData(null); // 모달 데이터 초기화
    };

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {  // 배경 클릭 시에만 모달 닫기
            closeModal();
        }
    };

    // 화면에 데이터 표시하는 함수
    const showRollcall = function () {
        return (
            <div className={styles.wrap}>
                {
                    rollcallList.map((user, i) => (
                        <div key={i} className={styles.Content}>
                            <div style={{ flex: 1 }}>{user.roomNumber}</div>
                            <div style={{ flex: 1 }}>{user.personnel}</div>
                            <div style={{ flex: 1 }}>{user.personnel === 4 ? '점호 완료' : '점호 중'}</div>
                            <div style={{ flex: 2 }}>
                                <button
                                    className={styles.detailButton}
                                    onClick={() => openModal(user)} // "자세히" 버튼 클릭 시 모달 열림
                                >
                                    자세히
                                </button>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    };

    return (
        <>
            <div className={styles.Container}>
                <h1 className={styles.Title}>점호</h1>

                <div className={styles.ContentContainer}>
                    <div className={styles.Content} style={{ paddingLeft: '3vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>{currentDate}</div>

                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '3vw', fontSize: '1rem' }}>
                            <input
                                type="checkbox"
                                id="incompleteCheckbox"
                                checked={showIncomplete}
                                onChange={handleCheckboxChange}
                                style={{ marginRight: '8px' }}
                            />
                            <label htmlFor="incompleteCheckbox" style={{ color: '#888' }}>
                                미완료된 호실만
                            </label>
                        </div>
                    </div>

                    <div className={styles.Content} style={{ backgroundColor: '#eee' }}>
                        <div style={{ flex: 1 }}>호수</div>
                        <div style={{ flex: 1 }}>점호인원</div>
                        <div style={{ flex: 1 }}>상태</div>
                        <div style={{ flex: 2 }}>상세</div>
                    </div>

                    {showRollcall()}
                </div>
            </div>

            {/* 모달 창 */}
            <RollCallModal
                modalData={modalData}
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                rollcallList={rollcallList[0]}
                date={currentDate}
            />
        </>
    );
}
