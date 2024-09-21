import axios from "axios";
import { useEffect, useState } from "react";
import styles from '../css/Sleepover.module.css';

export default function Sleepover() {
    const [ing, setIng] = useState('wait');
    const [sleepoverList, setSleepoverList] = useState([]);
    const [waitlist, setWaitlist] = useState([]);  // check가 0인 리스트
    const [finishlist, setFinishlist] = useState([]);  // check가 1인 리스트
    const [decideList, setDecideList] = useState([]);

    // 데이터를 다시 불러오기 위한 함수
    const fetchSleepoverRequests = async () => {
        try {
            const response = await axios.get('/admin/sleepover_requests');
            setSleepoverList(response.data.requests);
            const wait = response.data.requests.filter(user => user.CHECK === 0);
            const finish = response.data.requests.filter(user => user.CHECK === 1);

            setWaitlist(wait);
            setFinishlist(finish);

            // 결정 상태 초기화 (모든 사용자는 처음에 null 상태)
            setDecideList(Array(response.data.requests.length).fill(null));
        } catch (err) {
            console.error('Error fetching sleepover requests:', err);
        }
    };

    // 날짜 형식을 변환하는 함수
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}.${month}.${day}`;
    };

    // 데이터 처음 불러오기
    useEffect(() => {
        fetchSleepoverRequests();
    }, []);

    // 수락 버튼 클릭 처리 함수 (서버에 POST 요청 후 재랜더링)
    const handleAccept = async (index, sid) => {
        try {
            // 서버로 POST 요청 보내기
            await axios.post('/admin/sleepover_approve', {
                sid: sid, // 서버로 보낼 데이터
            });

            // 수락 후 해당 인덱스의 결정 상태를 'accept'로 변경
            let copy = [...decideList];
            copy[index] = 'accept';
            setDecideList(copy);

            // 데이터 다시 불러옴
            await fetchSleepoverRequests();

        } catch (error) {
            console.error('데이터 전송 중 오류 발생:', error);
        }
    };

    // 거절 버튼 클릭 처리 함수
    const handleReject = async (index, sid) => {
        try {
            // 서버로 POST 요청 보내기
            await axios.post('/admin/sleepover_reject', {
                sid: sid, // 서버로 보낼 데이터
            });

            
            // 데이터 다시 불러옴
            await fetchSleepoverRequests();

        } catch (error) {
            console.error('거절 요청 중 오류 발생:', error);
            // 거절 후 해당 인덱스의 결정 상태를 'reject'로 변경
            let copy = [...decideList];
            copy[index] = 'reject';
            setDecideList(copy);

        }
    };

    // 대기중인 사람 목록 보여주기
    const showWaitUser = function () {
        return (
            <div className={styles.ContentContainer}>
                <div className={styles.Content} style={{ paddingLeft: '4vw' }}>
                    총 {waitlist.length}개
                </div>
                <div className={styles.Content} style={{ backgroundColor: '#eee' }}>
                    <div style={{ flex: 1 }}>이름</div>
                    <div style={{ flex: 1 }}>학번</div>
                    <div style={{ flex: 1 }}>호수</div>
                    <div style={{ flex: 1 }}>신청일시</div>
                    <div style={{ flex: 2 }}>수락</div>
                </div>

                <div className={styles.wrap}>
                    {
                        waitlist.map((user, i) => {
                            return (
                                <div key={i} className={styles.Content}>
                                    <div style={{ flex: 1 }}>{user.NAME}</div>
                                    <div style={{ flex: 1 }}>{user.SSTNUM}</div>
                                    <div style={{ flex: 1 }}>{user.ROOM}</div>
                                    <div style={{ flex: 1 }}>{formatDate(user.STARTDATE)}</div>
                                    <div style={{ flex: 2 }}>
                                        {decideList[i] === 'reject' ? (
                                            <div>거절됨</div>
                                        ) : decideList[i] === 'accept' ? (
                                            <div>수락됨</div>
                                        ) : (
                                            <>
                                                <div className={styles.Reject} onClick={() => handleReject(i, user.SID)}>
                                                    <div>❌</div>
                                                    <div>거절</div>
                                                </div>
                                                <div className={styles.Accept} onClick={() => handleAccept(i, user.SID)}>
                                                    <div>✔️</div>
                                                    <div>수락</div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div >
            </div>
        );
    };

    // 외박 신청 완료된 사람 목록 보여주기
    const showFinishUser = function () {
        return (
            <div className={styles.ContentContainer}>
                <div className={styles.Content} style={{ paddingLeft: '4vw' }}>
                    총 {finishlist.length}개
                </div>
                <div className={styles.Content} style={{ backgroundColor: '#eee' }}>
                    <div style={{ flex: 1 }}>이름</div>
                    <div style={{ flex: 1 }}>학번</div>
                    <div style={{ flex: 1 }}>호수</div>
                    <div style={{ flex: 1 }}>신청일시</div>
                    <div style={{ flex: 2 }}>수락</div>
                </div>

                <div className={styles.wrap}>
                    {
                        finishlist.map((user, i) => {
                            return (
                                <div key={i} className={styles.Content}>
                                    <div style={{ flex: 1 }}>{user.NAME}</div>
                                    <div style={{ flex: 1 }}>{user.SSTNUM}</div>
                                    <div style={{ flex: 1 }}>{user.ROOM}</div>
                                    <div style={{ flex: 1 }}>{formatDate(user.STARTDATE)}</div>
                                    <div style={{ flex: 2 }}>
                                        {formatDate(user.AT)}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div >
            </div>
        );
    };

    return (
        <>
            <div className={styles.Container}>
                {/* Title */}
                <h1 className={styles.Title}>외박</h1>

                {/* 대기중/완료 선택 */}
                <span
                    className={ing === 'wait' ? styles.Active : styles.Inactive}
                    onClick={() => setIng('wait')}>
                    대기 중
                </span>
                <span
                    className={ing === 'finish' ? styles.Active : styles.Inactive}
                    onClick={() => setIng('finish')}>
                    완료됨
                </span>

                {/* 목록 표시 */}
                {ing === 'wait' ? showWaitUser() : showFinishUser()}
            </div>
        </>
    );
}
