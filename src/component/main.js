import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./nav";
import styles from '../css/Main.module.css'
import { useEffect, useState } from "react";
import axios from "axios";
import RollCall from "./RollCall";
import Sleepover from "./Sleepover";
import User from "./User";


function Main() {
    let [select, setSelect] = useState('RollCall');


    return (
        <>
            <div className={styles.Container}>
                <Navbar select={select} setSelect={setSelect} />
                <div className={styles.MainContainer}>
                    {select === 'RollCall' && (<RollCall />)}
                    {select === 'Sleepover' && (<Sleepover />)}
                    {select === 'User' && (<User/>)}
                </div>


            </div>
        </>
    )
}


export default Main;