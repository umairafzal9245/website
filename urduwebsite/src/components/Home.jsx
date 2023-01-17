import React from "react";
import Line from './Line'
import Recorder from "./recorder";
import { logOut } from "../actions/AuthAction";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import Recordings from "./recordings";

const Home = () => {

    const update = useSelector((state) => state.authReducer.updateLoading);

    const dispatch = useDispatch()

    const handleLogout = () => {
        dispatch(logOut())
    }

    return (
        <div>
            <button className="button infoButton" onClick={handleLogout} disabled={update}>Logout</button>
            <Line />
            <Recorder />
            <Recordings />
        </div>
    );
}

export default Home;