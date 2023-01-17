import React from 'react';
import Recording from './recording';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const Recordings = () => {

    const user = useSelector((state) => state.authReducer.authData);
    const [recordings, setRecordings] = useState([]);

    useEffect(() => {

        if (user) {
            var rec = []
            if (Object.keys(user.recorded['short']).length > 0) {
                const data = Object.entries(user.recorded['short'])
                data.map((item) => {
                    return rec.push({ [item[0]]: item[1] })
                })
            }
            if (Object.keys(user.recorded['medium']).length > 0) {
                const data = Object.entries(user.recorded['medium'])
                data.map((item) => {
                    return rec.push({ [item[0]]: item[1] })
                })
            }
            if (Object.keys(user.recorded['long']).length > 0) {
                const data = Object.entries(user.recorded['long'])
                data.map((item) => {
                    return rec.push({ [item[0]]: item[1] })
                })
            }
            if (Object.keys(user.recorded['words']).length > 0) {
                const data = Object.entries(user.recorded['words'])
                data.map((item) => {
                    return rec.push({ [item[0]]: item[1] })
                })
            }
            setRecordings(rec)
        }

    }, [user]);

    return (
        <div className='Recordings'>
            <h2 >Recorded Sentences</h2>
            <ol style={{ 'margin': '0rem' }}>
                {recordings.length > 0 ?
                    recordings.map((recording) => {
                        return (
                            <>
                                <Recording recording={recording} />
                            </>
                        );
                    }) : <h3 style={{ 'margin': '0rem' }}>No Recordings</h3>
                }
            </ol>
        </div>
    );
};

export default Recordings;
