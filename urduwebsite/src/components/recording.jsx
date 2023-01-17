import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getRecording, deleteRecording } from '../actions/UserAction';
import { useDispatch } from 'react-redux';
const Recording = ({ recording }) => {

    const [audio, setAudio] = useState(null);
    const [playing, setPlaying] = useState(false);
    const [recordingname, setRecordingname] = useState('')
    const [sentencename, setSentencename] = useState('')
    const fetch = useSelector((state) => state.authReducer.fetching);
    const deletee = useSelector((state) => state.authReducer.deleting);
    const user = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch()

    useEffect(() => {
        setRecordingname(Object.keys(recording)[0])
        setSentencename(Object.values(recording)[0])
    }, [recording]);

    const playRecording = () => {

        if (playing) {
            audio?.pause();
            setPlaying(false)
        }
        else {
            const data = dispatch(getRecording(recordingname));
            data.then((response) => {
                const blob = new Blob([response], { type: 'audio/wav' });
                console.log(blob)
                const audioUrl = URL.createObjectURL(blob);
                var audioo = new Audio(audioUrl);
                audioo.onended = () => setPlaying(false);
                audioo.play();
                setAudio(audioo);
                setPlaying(true);
            }).catch((error) => {
                console.log(error);
            });
        }
    };

    const deleteRecordingg = () => {
        if (playing) {
            audio?.pause();
            setPlaying(false)
        } else {
            dispatch(deleteRecording(user._id, recordingname));
        }
    };

    return (
        <li>
            <h3>{sentencename}</h3>
            <div>
                <button className="button infoButton" onClick={playRecording} disabled={fetch || deletee} >{fetch ? "Loading..." : playing ? "Stop" : "Play"}</button>
                <button className="button infoButton" onClick={deleteRecordingg} disabled={deletee || fetch}>{deletee ? "Deleting" : "Delete"}</button>
            </div>
        </li>
    );
};

export default Recording;