/**
 * This module contains the API endpoints the web frontend can use on the Kyabia HTTP API.
 */
import store from '../store';
import {REMOVE_SESSION, SET_SESSION} from '../store';
import _ from 'lodash';

const stringIdPattern = /^[a-z0-9]+$/i;

/**
 * Main API class that contains the accessor functions for all API endpoints
 */
class Api {

    /**
     * Constuctor for the API class
     *
     * @param {Vuex.store} store  The Vuex store to use when handling API requests (needed for token retrieval)
     */
    constructor(store) {
        this.store = store;
    }

    /**
     * Returns the default init object that can be used for fetching data
     *
     * @return {Object} The default init object
     */
    defaultInit() {
        let headers = new Headers();
        let token = this.store.getters.apiToken;
        if (token) {
            headers.append('token', token);
        }
        return {
            method: 'GET',
            headers: headers,
            mode: 'same-origin',
            cache: 'no-store',
        };
    }

    /**
     * Converts an incoming ID parameter to an integer and throws an error if the value is not a valid integer
     *
     * @param  {String/Number} id   The numeric ID
     * @return {Number}             The ID converted to an integer value
     */
    numericId(id) {
        id = Number.parseInt(id, 10);
        if (!_.isFinite(id) || id < 0) {
            throw new Error(`Illegal numeric ID '${id}'`);
        }
        return id;
    }

    /**
     * Checks if an incoming string parameter is a valid string ID used in kyabia and throws an error if not
     *
     * @param  {String} id  The ID to check
     * @return {String}     The ID - can be used later if transformation is needed
     */
    stringId(id) {
        if (!stringIdPattern.test(id)) {
            throw new Error(`Illegal string ID '${id}'`);
        }
        return id;
    }

    /**
     * Decodes the returned response and does some basic error handling
     *
     * @param  {Response} res   A response object as returned by resolving fetch()
     * @return {Object}         An API response object decoded from the response
     */
    async decodeResponse(res) {
        let jsonData;
        let text;
        try {
            text = await res.text();
            jsonData = JSON.parse(text);
        } catch (e) {
            return {
                ok: false,
                error: 'ILLEGAL_RESPONSE_FORMAT',
                errorDetails: {
                    error: e.toString(),
                    httpStatus: res.status,
                    httpStatusText: res.statusText,
                    text: text,
                },
            };
        }
        if (jsonData && !jsonData.ok) {
            // Handle an API error
            if (jsonData.error && jsonData.error == 'NOT_LOGGED_IN') {
                // Okay the user has lost the session - remove it
                this.store.commit(REMOVE_SESSION);
            }
        } else if (!jsonData) {
            // Handle a non-standard error
            return {
                ok: false,
                errorMessage: await res.text() || res.statusText,
                errorDetails: `Response status: ${res.status} ${res.statusText}`,
            };
        }
        return jsonData;
    }

    /**
     * Tries to log-in with the given credentials
     *
     * @param  {String} username    The user name
     * @param  {String} password    The user's password
     * @return {Promise}            A promise that resolves to a result set
     */
    async login(username, password) {
        let init = this.defaultInit();
        const data = {
            user: username,
            password: password,
        };
        init.method = 'POST';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/login`, init);
        res = await this.decodeResponse(res);
        if (res.ok && res.data && res.data.sessionId) {
            this.store.commit(SET_SESSION, res.data);
        }
        return res;
    }

    // -- Videos -------------------------------------------------------------------------------------------------------

    /**
     * Searches for videos for the given search term
     *
     * @param  {String} searchTerm The term to find matching videos for
     * @param  {Number} offset     Paging: Offset of the results to return
     * @param  {Number} limit      Paging: Maximum number of results to return
     * @return {Promise}           A promise that resolves to a result set
     */
    async searchVideos(searchTerm, offset=0, limit=50) {
        let res = await fetch(`/api/videos?search=${searchTerm}&limit=${limit}&offset=${offset}`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Loads the video entry with the given ID
     *
     * @param  {String}     id      The ID of the video to load
     * @return {Promise}            A promise that resolves to a result set
     */
    async getVideo(id) {
        id = this.stringId(id);
        let res = await fetch(`/api/videos/${id}`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Updates an existing video entry
     *
     * @param  {String}     id          The ID of the existing video entry
     * @param  {Object}     data        The video entry data to update
     * @return {Promise}                A promise that resolves to a result set
     */
    async updateVideo(id, data) {
        id = this.stringId(id);
        let init = this.defaultInit();
        init.method = 'PUT';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/videos/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Deletes the event with the given ID from the database
     *
     * @param  {Number}     id          The ID of the event to be deleted
     * @return {Promise}                A promise that resolves to a result set
     */
    async deleteVideo(id) {
        id = this.stringId(id);
        let init = this.defaultInit();
        init.method = 'DELETE';
        let res = await fetch(`/api/videos/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    // -- Events -------------------------------------------------------------------------------------------------------

    /**
     * Searches for events for the given search term
     *
     * @param  {String} searchTerm The term to find matching events for
     * @param  {Number} offset     Paging: Offset of the results to return
     * @param  {Number} limit      Paging: Maximum number of results to return
     * @return {Promise}           A promise that resolves to a result set
     */
    async searchEvents(searchTerm, offset=0, limit=50) {
        let res = await fetch(`/api/events?search=${searchTerm}&limit=${limit}&offset=${offset}`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Loads the event with the given ID
     *
     * @param  {Number}     id      The ID of the event to load
     * @return {Promise}            A promise that resolves to a result set
     */
    async getEvent(id) {
        id = this.numericId(id);
        let res = await fetch(`/api/events/${id}`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Creates a new event on the server with the given settings
     *
     * @param  {Object}     data        The event data
     * @return {Promise}                A promise that resolves to a result set
     */
    async createEvent(data) {
        let init = this.defaultInit();
        init.method = 'POST';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/events`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Updates an existing event
     *
     * @param  {Number}     id          The ID of the existing event
     * @param  {Object}     data        The event data
     * @return {Promise}                A promise that resolves to a result set
     */
    async updateEvent(id, data) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'PUT';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/events/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Changes the active event to the one with the given ID
     *
     * @param  {Number}     id          The ID of the event to select as new active event
     * @return {Promise}                A promise that resolves to a result set
     */
    async chooseActiveEvent(id) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'POST';
        let res = await fetch(`/api/events/${id}/makeCurrent`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Deletes the event with the given ID from the database
     *
     * @param  {Number}     id          The ID of the event to be deleted
     * @return {Promise}                A promise that resolves to a result set
     */
    async deleteEvent(id) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'DELETE';
        let res = await fetch(`/api/events/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Loads the currently active event
     *
     * @return {Promise}            A promise that resolves to a result set
     */
    async getActiveEvent() {
        let res = await fetch(`/api/events/current`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    // -- Main playlist ------------------------------------------------------------------------------------------------

    /**
     * Places a wish for a video by adding it to the main playlist
     *
     * @param  {String}     videoHash   The ID (hash) of the video to wish for
     * @param  {String}     requester   The name of the person that placed the wish
     * @return {Promise}                A promise that resolves to a result set
     */
    async makeWish(videoHash, requester) {
        videoHash = this.stringId(videoHash);
        let init = this.defaultInit();
        const data = {
            videoHash: videoHash,
            requestedBy: requester,
        };
        init.method = 'POST';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/playlists/main/entries`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Returns the entries on the main playlist
     *
     * @return {Promise}                A promise that resolves to a result set
     */
    async getMainPlaylistEntries() {
        let res = await fetch(`/api/playlists/main/entries?limit=1000`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Loads information about the main playlist
     *
     * @return {Promise}                A promise that resolves to a result set
     */
    async getMainPlaylist() {
        let res = await fetch(`/api/playlists/main`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    // -- Playlists ----------------------------------------------------------------------------------------------------

    /**
     * Searches for playlists for the given search term
     *
     * @param  {String} searchTerm The term to find matching playlists for
     * @param  {Number} offset     Paging: Offset of the results to return
     * @param  {Number} limit      Paging: Maximum number of results to return
     * @return {Promise}           A promise that resolves to a result set
     */
    async searchPlaylists(searchTerm='', offset=0, limit=50) {
        searchTerm = searchTerm && searchTerm.trim() || '';
        let res = await fetch(
            `/api/playlists?search=${searchTerm}&limit=${limit}&offset=${offset}`,
            this.defaultInit()
        );
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Returns the playlist with the given ID
     *
     * @param  {Number}     playlistId  The ID of the playlist to load
     * @return {Promise}                A promise that resolves to a result set
     */
    async getPlaylist(playlistId) {
        playlistId = this.numericId(playlistId);
        let res = await fetch(`/api/playlists/${playlistId}`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Creates a new playlist on the server with the given settings
     *
     * @param  {Object}     data        The playlist data
     * @return {Promise}                A promise that resolves to a result set
     */
    async createPlaylist(data) {
        let init = this.defaultInit();
        init.method = 'POST';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/playlists`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Updates an existing event
     *
     * @param  {Number}     id          The ID of the existing playlist
     * @param  {Object}     data        The playlist data
     * @return {Promise}                A promise that resolves to a result set
     */
    async updatePlaylist(id, data) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'PUT';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/playlists/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Deletes the playlist with the given ID from the database
     *
     * @param  {Number}     id          The ID of the event to be deleted
     * @return {Promise}                A promise that resolves to a result set
     */
    async deletePlaylist(id) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'DELETE';
        let res = await fetch(`/api/playlists/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    // -- PlaylistEntries ----------------------------------------------------------------------------------------------

    /**
     * Returns the entries on the given playlist
     *
     * @param  {Number}     playlistId  The ID of the playlist to load the entries for
     * @return {Promise}                A promise that resolves to a result set
     */
    async getPlaylistEntries(playlistId) {
        playlistId = this.numericId(playlistId);
        let res = await fetch(`/api/playlists/${playlistId}/entries?limit=1000`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Places a wish for a video by adding it to the main playlist
     *
     * @param  {String}     playlistId  The ID of the playlist to add the entry to
     * @param  {String}     videoHash   The ID (hash) of the video to wish for
     * @param  {String}     requester   The name of the person that placed the wish
     * @return {Promise}                A promise that resolves to a result set
     */
    async addPlaylistEntry(playlistId, videoHash, requester) {
        playlistId = this.numericId(playlistId);
        videoHash = this.stringId(videoHash);
        let init = this.defaultInit();
        const data = {
            videoHash: videoHash,
            requestedBy: requester,
        };
        init.method = 'POST';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/playlists/${playlistId}/entries`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Reorders the playlist so that the given playlist entry will be placed before the other entry
     *
     * @param  {Number}     entryId         The ID of the playlist entry to reposition
     * @param  {Number}     otherEntryId    The ID of the playlist entry to place the other one before - or 0 for the
     *                                      end of the list
     * @return {Promise}                    A promise that resolves to a result set
     */
    async placePlaylistEntryBefore(entryId, otherEntryId) {
        entryId = this.numericId(entryId);
        otherEntryId = this.numericId(otherEntryId);
        let init = this.defaultInit();
        init.method = 'PUT';
        let res = await fetch(`/api/playlistEntries/${entryId}/before/${otherEntryId}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Deletes the playlist entry with the given ID from the database
     *
     * @param  {Number}     id          The ID of the playlist entry to be deleted
     * @return {Promise}                A promise that resolves to a result set
     */
    async deletePlaylistEntry(id) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'DELETE';
        let res = await fetch(`/api/playlistEntries/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Updates an existing playlist entry
     *
     * @param  {Number}     id          The ID of the existing playlist entry
     * @param  {Object}     data        The playlist entry data
     * @return {Promise}                A promise that resolves to a result set
     */
    async updatePlaylistEntry(id, data) {
        id = this.numericId(id);
        let init = this.defaultInit();
        init.method = 'PUT';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify(data);
        let res = await fetch(`/api/playlistEntries/${id}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    // -- Scraping -----------------------------------------------------------------------------------------------------

    /**
     * Loads a list of currently running scraping operations
     *
     * @return {Promise}                A promise that resolves to a result set
     *
     * @memberOf Api
     */
    async listRunningScrapes() {
        let res = await fetch(`/api/scrapes`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Loads a list of subdirectories of the given folder
     *
     * @param  {String}   path          The directory to get the subdirectories of
     * @return {Promise}                A promise that resolves to a result set
     *
     * @memberOf Api
     */
    async listDirs(path) {
        path = path.split('/').filter(item => (item && item.trim())).join('/');
        let res = await fetch(`/api/dirs/${path}`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Starts a new scraping operation in the given path
     *
     * @param  {String}     path        The root path to start the scrape at
     * @return {Promise}                A promise that resolves to a result set
     *
     * @memberOf Api
     */
    async startScrape(path) {
        path = path.split('/').filter(item => (item && item.trim())).join('/');
        let init = this.defaultInit();
        init.method = 'POST';
        let res = await fetch(`/api/scrape/${path}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    // -- Settings -----------------------------------------------------------------------------------------------------

    /**
     * Retrieves the list of IP addresses currently whitelisted for the wishlist
     *
     * @return {Promise}                A promise that resolves to a result set
     *
     * @memberOf Api
     */
    async getWhitelistedIps() {
        let res = await fetch(`/api/config/restrictions/whitelist`, this.defaultInit());
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Retrieves the list of IP addresses currently whitelisted for the wishlist
     *
     * @param  {String}     ipAddress   The IP address to add to the whitelist
     * @return {Promise}                A promise that resolves to a result set
     *
     * @memberOf Api
     */
    async addIpToWhitelist(ipAddress) {
        let init = this.defaultInit();
        init.method = 'POST';
        init.headers.append('Content-Type', 'application/json');
        init.body = JSON.stringify({ip: ipAddress});
        let res = await fetch(`/api/config/restrictions/whitelist`, init);
        res = await this.decodeResponse(res);
        return res;
    }

    /**
     * Removes the given IP address from the whitelist
     *
     * @param  {String}     ipAddress   The IP address to remove from the whitelist
     * @return {Promise}                A promise that resolves to a result set
     *
     * @memberOf Api
     */
    async removeIpFromWhitelist(ipAddress) {
        ipAddress = encodeURIComponent(ipAddress);
        let init = this.defaultInit();
        init.method = 'DELETE';
        let res = await fetch(`/api/config/restrictions/whitelist/${ipAddress}`, init);
        res = await this.decodeResponse(res);
        return res;
    }

}

export default new Api(store);
