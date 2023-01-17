import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { skipSentence } from "../actions/UserAction";

const Line = () => {

    const [line, setLine] = useState(null)
    const [type, setType] = useState(null)
    const [skippedShort, setskippedShort] = useState(0)
    const [skippedLong, setskippedLong] = useState(0)
    const [skippedMedium, setskippedMedium] = useState(0)
    const [shortRecorded, setshortRecorded] = useState(0)
    const [mediumRecorded, setmediumRecorded] = useState(0)
    const [longRecorded, setlongRecorded] = useState(0)
    const updateloading = useSelector((state) => state.authReducer.updateLoading);
    const user = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch();

    const handleSkip = () => {

        if (type === null) {
            alert('No Data')
            return;
        }
        if (skippedShort <= 0 || skippedMedium <= 0 || skippedLong <= 0) {
            alert('Skipped Limit Reached')
            return;
        }
        if (type !== 'words') {
            dispatch(skipSentence(user._id));
        }
        else {
            alert('Cannot Skip these sentences')
            return;
        }
    }
    useEffect(() => {

        if (user) {

            setskippedShort(50 - user['skipped']['short'].length)
            setskippedMedium(50 - user['skipped']['medium'].length)
            setskippedLong(50 - user['skipped']['long'].length)

            setshortRecorded(Object.keys(user['recorded']['short']).length)
            setmediumRecorded(Object.keys(user['recorded']['medium']).length)
            setlongRecorded(Object.keys(user['recorded']['long']).length)

            if (user['sentences']['short'].length > 0) {
                setLine(user['sentences']['short'][0]);
                setType('short')
            }
            else if (user['sentences']['medium'].length > 0) {
                setLine(user['sentences']['medium'][0]);
                setType('medium')
            }
            else if (user['sentences']['long'].length > 0) {
                setLine(user['sentences']['long'][0]);
                setType('long')
            }
            else if (user['sentences']['words'].length > 0) {
                setLine(user['sentences']['words'][0]);
                setType('words')
            }
            else {
                setLine(null);
                setType(null);
            }
        }
    }, [user]);

    return (
        <div>
            <div className="Webname">
                <h3>Sentence type: {type === null ? <></> : type}</h3>
                <h1>{line === null ? "No Data" : line}</h1>
            </div>
            <div>
                <button className="button infoButton" onClick={handleSkip} disabled={updateloading} >{updateloading ? "Updating..." : "Skip"}</button>
                <div className="Webname">
                    <div>
                        <h6> Short Recorded : {shortRecorded} </h6>
                        <h6> Short Skips Remaining : {skippedShort} </h6>
                    </div>
                </div>
                <div className="Webname">
                    <div>
                        <h6> Medium Recorded : {mediumRecorded} </h6>
                        <h6> Medium Skips Remainig : {skippedMedium} </h6>
                    </div>
                </div>
                <div className="Webname">
                    <div>
                        <h6> Long Recorded : {longRecorded} </h6>
                        <h6> Long Skips Remaining : {skippedLong} </h6>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Line;