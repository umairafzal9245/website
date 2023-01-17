import * as AuthApi from '../api/AuthRequest';

export const logIn = (FormData) => async (dispatch) => {

    dispatch({ type: "AUTH_START" });
    try {
        const { data } = await AuthApi.logIn(FormData);
        if (data === "User doesn't exist")
            dispatch({ type: "USER_NOT_FOUND" });
        else if (data === "Password incorrect")
            dispatch({ type: "PASSWORD_FAIL" });
        else if (data === "Error")
            dispatch({ type: "AUTH_FAIL" })
        else
            dispatch({ type: "AUTH_COMPLETED", data: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "AUTH_FAIL" });
    }
};

export const signUp = (FormData) => async (dispatch) => {

    dispatch({ type: "AUTH_START" });
    try {
        const { data } = await AuthApi.signUp(FormData);
        if (data === "User already exists")
            dispatch({ type: "DUPLICATE_FAIL" });
        else if (data === "Error")
            dispatch({ type: "AUTH_FAIL" })
        else
            dispatch({ type: "AUTH_COMPLETED", data: data });
    } catch (error) {
        console.log(error);
        dispatch({ type: "AUTH_FAIL" });
    }
};


export const logOut = () => async (dispatch) => {
    dispatch({ type: "LOG_OUT" });
}
