import styles from '../css/Navbar.module.css'
import { FaHome, FaMapMarkerAlt, FaTh, FaUser, FaList, FaCog, FaQuestionCircle } from 'react-icons/fa';


export default function Navbar({ select, setSelect }) {
    return (
        <>
            <div className={styles.SideContainer}>
                <div className={styles.NavList}>
                    <ul className={styles.List}>
                        <li onClick={() => {
                            setSelect('RollCall');
                        }}><FaHome /></li>
                        <li onClick={() => {
                            setSelect('Sleepover');
                        }}><FaTh /></li>
                        <li onClick={()=>{
                            setSelect('User');
                        }}><FaUser /></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
