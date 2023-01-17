import * as UserApi from '../api/UserRequest';

export const skipSentence = (id) => async (dispatch) => {
    dispatch({ type: "SKIPPING_START" });
    try {
        const { data } = await UserApi.skipSentence(id);
        if (data === "No more sentences") {
            alert('No more sentences');
            dispatch({ type: "SKIPPING_FAIL" })
        }
        else if (data === "Error") {
            alert('Error in skipping sentence');
            dispatch({ type: "SKIPPING_FAIL" })
        }
        else
            dispatch({ type: "SKIPPING_SUCCESS", data: data });
    } catch (error) {
        alert('Error in skipping sentence');
        dispatch({ type: "SKIPPING_FAIL" })
    }
}

export const uploadRecording = (id, formdata) => async (dispatch) => {
    dispatch({ type: "UPLOADING_START" });
    try {

        const { data } = await UserApi.uploadRecording(id, formdata)
        if (data === "Error") {
            alert("Error in uploading recording");
            dispatch({ type: "UPLOADING_FAILED" });
        }
        else
            dispatch({ type: "UPLOADING_SUCCESS", data: data });
    } catch (error) {
        alert("Error in uploading recording");
        dispatch({ type: "UPLOADING_FAILED" });
    }
}

export const getRecording = (recordingname) => async (dispatch) => {
    dispatch({ type: "GETTING_START" });
    try {
        const { data } = await UserApi.getRecording(recordingname)
        if (data === "Error") {
            alert("Error in getting recording");
            dispatch({ type: "GETTING_FAILED" });
        }
        else
            dispatch({ type: "GETTING_SUCCESS" });

        return data;
    } catch (error) {
        dispatch({ type: "GETTING_FAILED" });
        alert("Error in getting recording");
    }
}

export const deleteRecording = (id, recordingname) => async (dispatch) => {
    dispatch({ type: "DELETING_START" });
    try {
        const { data } = await UserApi.deleteRecording(id, recordingname)
        if (data === "Error") {
            alert("Error in deleting recording");
            dispatch({ type: "DELETING_FAILED" });
        }
        else
            dispatch({ type: "DELETING_SUCCESS", data: data });
    } catch (error) {
        dispatch({ type: "DELETING_FAILED" });
        alert("Error in deleting recording");
    }
}
