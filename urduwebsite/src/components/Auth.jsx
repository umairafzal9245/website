import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { logIn, signUp } from "../actions/AuthAction";
import { useEffect } from "react";

const Auth = () => {
    const dispatch = useDispatch();
    const loading = useSelector((state) => state.authReducer.loading)
    var pass = useSelector((state) => state.authReducer.password)
    var dpuser = useSelector((state) => state.authReducer.duplicate)
    var notfound = useSelector((state) => state.authReducer.notfound)
    const [isSignUp, setIsSignUp] = useState(false);
    const [data, setData] = useState({ firstname: "", lastname: "", password: "", confirmpass: "", email: "", gender: "" });
    const [confirmPass, setConfirmPass] = useState(true);


    useEffect(() => {
        dispatch({ type: "CLEAR" });
    }, [])

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmPass(true);

        if (isSignUp) {
            if (data.firstname === "" || data.lastname === "" || data.password === "" || data.confirmpass === "" || data.email === "") {
                alert("Please fill all the fields");
                return;
            }
            // data.password === data.confirmpass ? dispatch(signUp(data)) : setConfirmPass(false);
            data.password === data.confirmpass ? alert('not allowed') : setConfirmPass(false)
        } else {
            if (data.password === "" || data.email === "") {
                alert("Please fill all the fields");
                return;
            }
            dispatch(logIn(data));
        }
    };

    const resetForm = () => {
        setConfirmPass(true);
        setData({ firstname: "", lastname: "", password: "", confirmpass: "", email: "", gender: "" });
    };

    return (
        <div className="Auth">
            {/* left side */}
            <div className="a-left">
                <div className="Webname">
                    <h1>Urdu Annotations</h1>
                    <h6>Annotate Urdu Sentences Easily</h6>
                </div>
            </div>
            {/* right side */}
            <div className="a-right">
                <form className="infoForm authForm" onSubmit={handleSubmit}>
                    <h3>{isSignUp ? "Sign up" : "Log In"}</h3>
                    {isSignUp && (
                        <div>
                            <input
                                type="text"
                                placeholder="First Name"
                                className="infoInput"
                                name="firstname"
                                onChange={handleChange}
                                value={data.firstname}
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                className="infoInput"
                                name="lastname"
                                onChange={handleChange}
                                value={data.lastname}
                            />
                        </div>
                    )}

                    <div>
                        <input
                            type="text"
                            className="infoInput"
                            name="email"
                            placeholder="Nu Email"
                            onChange={handleChange}
                            value={data.email}
                        />
                        {isSignUp && (
                            <input
                                type="text"
                                placeholder="Male/Female"
                                className="infoInput"
                                name="gender"
                                onChange={handleChange}
                                value={data.gender}
                            />)}
                    </div>

                    <div>
                        <input
                            type="password"
                            className="infoInput"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={data.password}
                        />
                        {isSignUp && (
                            <input
                                type="password"
                                className="infoInput"
                                name="confirmpass"
                                placeholder="Confirm Password"
                                onChange={handleChange}
                                value={data.confirmpass}
                            />
                        )}
                    </div>
                    <span style={{ display: confirmPass ? "none" : "block", color: 'red', fontSize: "12px", alignSelf: "flex-end", margin: "5px" }}>
                        * Confirm password must be same as password
                    </span>
                    <span style={{ display: pass ? "block" : "none", color: 'red', fontSize: "12px", alignSelf: "flex-end", margin: "5px" }}>
                        * Incorrect Password
                    </span>
                    <span style={{ display: dpuser ? "block" : "none", color: 'red', fontSize: "12px", alignSelf: "flex-end", margin: "5px" }}>
                        * User already exists
                    </span>
                    <span style={{ display: notfound ? "block" : "none", color: 'red', fontSize: "12px", alignSelf: "flex-end", margin: "5px" }}>
                        * User not found
                    </span>
                    <div>
                        <span style={{ fontSize: '12px', cursor: "pointer" }} onClick={() => { setIsSignUp((prev) => !prev); resetForm(); dispatch({ type: "CLEAR" }); }}>{isSignUp ? "Already have an account. Login!" : "Dont have an account. Signup!"}</span>
                    </div>
                    <button className="button infoButton" type="submit" disabled={loading}>
                        {loading ? "Loading...." : isSignUp ? "Signup" : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth;