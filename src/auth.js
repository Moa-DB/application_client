/**
 * Helper methods for authentication.
 */
export default class Auth {

    /**
     * Get headers to send with HTML requests. Server uses HTML basic which requires we send user and pass base64 encoded with each request.
     */
    static getHeaders() {
        const user = localStorage.getItem("username");
        const pass = localStorage.getItem("password");

        let headers = new Headers();
        headers.append("Authorization", "Basic " + btoa(user+":"+pass));
        return headers;
    }
    /**
     * Set user credentials in local storage (to avoid having to poll server for it all the time).
     */
    static setCredentials(username,password) {
        localStorage.setItem("loggedin", "true");
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
    }
    /**
     * Check if logged in or not.
     */
    static isLoggedIn() {
        if (localStorage.getItem("loggedin") === "true") {
            // console.log("HILOGGEDIN");
            return true;
        } else {
            // console.log("HINOTLOGGEDIN");
            return false;
        }
    }
    /**
     * Log out
     */
    static unSetCredentials() {
        localStorage.setItem("loggedin", "false");
        localStorage.setItem("username", "");
        localStorage.setItem("password", "");
    }
}
