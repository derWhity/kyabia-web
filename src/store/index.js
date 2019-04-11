import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const SET_SESSION = 'setSession';
export const REMOVE_SESSION = 'removeSession';

const SESSION_KEY = 'KyabiaSession';

/**
 * Tries to load session data from session storage
 *
 * @return {Object/null}    The loaded session data or null, if no session exists
 */
function loadSessionFromStorage() {
    if (window.sessionStorage) {
        const str = window.sessionStorage.getItem(SESSION_KEY);
        if (str) {
            try {
                const data = JSON.parse(str);
                if (data && data.sessionId) {
                    return data;
                }
            } catch(e) {}
        }
    }
    return null;
}

/**
 * Tries to write the current session to the browser's session storage
 *
 * @param  {Object/null} sessionData     The session data object or `null` to remove the session
 */
function writeSessionToStorage(sessionData) {
    if (window.sessionStorage) {
        try {
            if (sessionData) {
                window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            } else {
                window.sessionStorage.removeItem(SESSION_KEY);
            }
        } catch(e) {}
    }
}

const store = new Vuex.Store({
    state: {
        session: loadSessionFromStorage(),
    },
    mutations: {
        [SET_SESSION](state, param) {
            // We can either pass the session directly or as "session" property of an object
            let session = param.session ? param.session : param;
            if(!session.sessionId || !session.userName) {
                console.warn('Tried to store an illegal session object');
                return;
            }
            state.session = session;
            writeSessionToStorage(session);
        },
        [REMOVE_SESSION](state) {
            state.session = null;
            writeSessionToStorage(null);
        },
    },
    getters: {
        loggedIn: state => {
            return state.session !== null;
        },
        apiToken: state => {
            return state.session ? state.session.sessionId : null;
        },
        userFullName: state => {
            return state.session ? state.session.userFullName : '';
        },
    },
});

export default store;
