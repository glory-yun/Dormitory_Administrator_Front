import React, { useState } from 'react';
import styles from '../css/Modal.module.css'; // 모달에 대한 CSS 파일 불러오기

export default function RollCallModal({ modalData, isModalOpen, closeModal, rollcallList, date }) {
    const [activeTab, setActiveTab] = useState(1); // 현재 활성화된 사람(탭)

    const handleTabClick = (tabNumber) => {
        setActiveTab(tabNumber); // 선택된 탭(사람)으로 변경
    };

    if (!isModalOpen) {
        return null; // 모달이 열려있지 않으면 아무것도 렌더링하지 않음
    }



    return (
        <div className={styles.modalBackground} onClick={closeModal}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <h2 className={styles.modalTitle}>점호 상세</h2>
                <div className={styles.modalInfo}>
                    <p>일시 | {date}</p>
                    <p>호수 | {rollcallList.roomNumber}호</p>
                </div>

                {/* 사람 선택 탭 - 객체의 값들을 사용해서 보여주기 */}
                <div className={styles.tabContainer}>
                    {/* rollcallList.data가 배열이 아닐 경우 직접 값에 접근 */}
                    {rollcallList.data && Array.isArray(rollcallList.data)
                        ? rollcallList.data.map((tab, index) => (
                            <button
                                key={index}
                                className={`${styles.tabButton} ${activeTab === tab ? styles.activeTab : ''}`}
                                onClick={() => handleTabClick(tab)} // 선택된 사람(탭) 클릭 시 변경
                            >
                                
                                {tab.SEATNUM} {tab.NAME} {/* 이름을 표시 */}
                            </button>
                        ))
                        : Object.keys(rollcallList).map((key, index) => (
                            <button
                                key={index}
                                className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
                                onClick={() => handleTabClick(index)} // 탭 인덱스를 기준으로 변경
                            >
                                {rollcallList[key].NAME || '이름 없음'} {/* 이름 속성 없을 경우 기본값 */}
                            </button>
                        ))
                    }
                </div>

                {/* 사진 부분 */}
                <div className={styles.imageContainer}>
                    {Array(6).fill(0).map((_, index) => (
                        <div key={index} className={styles.imageWrapper}>
                            <img src={`/images/room${index + 1}.jpg`} alt={`Room ${index + 1}`} className={styles.roomImage} />
                        </div>
                    ))}
                </div>

                {/* 닫기 버튼 */}
                <button className={styles.closeButton} onClick={closeModal}>닫기</button>
            </div>
        </div>
    );
}
