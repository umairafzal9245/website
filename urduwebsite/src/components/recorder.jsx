// import React from 'react';
// import { useState } from 'react';
// import fixWebmDuration from 'webm-duration-fix'
// import { ReactMic } from 'react-mic';
// import { useSelector, useDispatch } from 'react-redux';
// import { uploadRecording } from '../actions/UserAction';

// const Recorder = () => {

//     const [audioUrl, setAudioUrl] = useState('');
//     const [recordingstate, setRecordingState] = useState(false);
//     const [blob, setBlob] = useState(null);
//     const update = useSelector((state) => state.authReducer.updateLoading);
//     const user = useSelector((state) => state.authReducer.authData);
//     const dispatch = useDispatch()

//     const StoppedRecording = (data) => {
//         fixWebmDuration(data.blob).then(blobfixed => {
//             var audioUrl = URL.createObjectURL(blobfixed);
//             setAudioUrl(audioUrl);
//             setBlob(blobfixed);
//         });
//     }

//     const uploaddRecording = () => {

//         if (blob !== null) {
//             const formdata = new FormData();
//             const time = new Date().getTime();
//             const filename = `${user.email}_${time}.weba`;
//             const blobb = new Blob([blob], { type: 'audio/webm' });
//             formdata.append('audio', blobb, filename);
//             setBlob(null)
//             setAudioUrl('')
//             dispatch(uploadRecording(user._id, formdata))
//         }
//         else {
//             alert('record the sentence first')
//         }
//     }

//     const onOffRecording = () => {
//         setRecordingState(prev => !prev)
//     }

//     return (
//         <div>
//             <ReactMic
//                 record={recordingstate}
//                 className="sound-wave RecordOutput"
//                 onStop={StoppedRecording}
//                 strokeColor="#000000"
//                 backgroundColor="#a6ddf0"
//                 audioBitsPerSecond={960000}
//                 sampleRate={48000}
//                 channelCount={1}
//                 codec="audio/webm"
//             />
//             <br />
//             <h4 style={{ 'textAlign': 'center' }}>Recording State: {recordingstate ? <>Recording.....</> : <>Not Recording</>}</h4>
//             {audioUrl && <audio src={audioUrl} controls={true} autoPlay />}
//             <button className="button infoButton" onClick={onOffRecording} disabled={update}>{recordingstate ? "Stop" : "Start"}</button>
//             <button className="button infoButton" onClick={uploaddRecording} disabled={recordingstate || update}>{update ? "Uploading" : "Upload"}</button>

//         </div>
//     );
// }
// export default Recorder;


import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { uploadRecording } from '../actions/UserAction';

const Recorder = () => {

    const [audioUrl, setAudioUrl] = useState('');
    const [recordingstate, setRecordingState] = useState(false);
    const [blob, setBlob] = useState(null);
    var [chunks] = useState([]);
    const update = useSelector((state) => state.authReducer.updateLoading);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const user = useSelector((state) => state.authReducer.authData);
    const dispatch = useDispatch()


    useEffect(() => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                const mediarecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                mediarecorder.ondataavailable = (e) => {
                    chunks.push(e.data);
                }
                mediarecorder.onstop = (e) => {
                    const blobb = new Blob(chunks, { 'type': 'audio/webm' })
                    setBlob(blobb)
                    var audioUrl = URL.createObjectURL(blobb);
                    setAudioUrl(audioUrl);
                    chunks = [];
                }
                setMediaRecorder(mediarecorder)
            })
        }
    }, [])

    const uploaddRecording = () => {

        if (blob !== null) {
            const formdata = new FormData();
            const time = new Date().getTime();
            const filename = `${user.email}_${time}.weba`;
            const blobb = new Blob([blob], { type: 'audio/webm' });
            formdata.append('audio', blobb, filename);
            setBlob(null)
            setAudioUrl('')
            dispatch(uploadRecording(user._id, formdata))
        }
        else {
            alert('record the sentence first')
        }
    }

    const startRecording = () => {
        mediaRecorder.start();
        setRecordingState(true)
    }

    const stopRecording = () => {
        mediaRecorder.stop();
        setRecordingState(false)
    }

    return (
        <div>
            <h4 style={{ 'textAlign': 'center' }}>Recording State: {recordingstate ? <>Recording.....</> : <>Not Recording</>}</h4>
            {audioUrl && <audio src={audioUrl} controls={true} autoPlay />}
            <br />
            <button className="button infoButton" onClick={recordingstate ? stopRecording : startRecording} disabled={update}>{recordingstate ? "Stop" : "Start"}</button>
            <button className="button infoButton" onClick={uploaddRecording} disabled={recordingstate || update}>{update ? "Uploading" : "Upload"}</button>
        </div>
    );
}
export default Recorder;
