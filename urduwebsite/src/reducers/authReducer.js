const authReducer = (state = { authData: null, loading: false, password: false, duplicate: false, notfound: false, updateLoading: false, fetching: false, deleting: false }, action) => {
    switch (action.type) {

        case "AUTH_START":
            return { ...state, loading: true, password: false, duplicate: false, notfound: false };

        case "AUTH_COMPLETED":
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, loading: false, password: false, duplicate: false, notfound: false };

        case "AUTH_FAIL":
            return { ...state, loading: false, password: false, duplicate: false, notfound: false };

        case "PASSWORD_FAIL":
            return { ...state, loading: false, password: true, duplicate: false, notfound: false };

        case "DUPLICATE_FAIL":
            return { ...state, loading: false, password: false, duplicate: true, notfound: false };

        case "USER_NOT_FOUND":
            return { ...state, loading: false, password: false, duplicate: false, notfound: true };

        case "LOG_OUT":
            localStorage.clear();
            return { ...state, authData: null, loading: false, updateLoading: false };

        case "CLEAR":
            return { ...state, loading: false, password: false, duplicate: false, notfound: false };

        case "SKIPPING_START":
            return { ...state, updateLoading: true };

        case "SKIPPING_FAIL":
            return { ...state, updateLoading: false };

        case "SKIPPING_SUCCESS":
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, updateLoading: false };

        case "UPLOADING_START":
            return { ...state, updateLoading: true };

        case "UPLOADING_SUCCESS":
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, updateLoading: false };

        case "UPLOADING_FAILED":
            return { ...state, updateLoading: false };

        case "GETTING_START":
            return { ...state, fetching: true };

        case "GETTING_SUCCESS":
            return { ...state, fetching: false };

        case "GETTING_FAILED":
            return { ...state, fetching: false };

        case "DELETING_START":
            return { ...state, deleting: true };

        case "DELETING_SUCCESS":
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { ...state, authData: action.data, updateLoading: false, deleting: false };

        case "DELETING_FAILED":
            return { ...state, deleting: false };

        default:
            return state;
    }
};

export default authReducer;