import JwtUtil from "./auth/JwtUtil";

class Api {

    static headers(){
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    static URL(){
        return process.env.REACT_APP_API_URL;

    }

    static async makeRequest(url, method, headers, body) {
        const options = {
            method: method,
            headers: headers
        };
        if(body){
            options['body'] = JSON.stringify(body);
        }
        return await fetch(url, options);
    }

    static async createUserAndSession(latitude, longitude, range, level) {
        const path = '/sessions';
        const url = `${Api.URL()}${path}`;
        const bodyData = {
            latitude: latitude,
            longitude: longitude,
            range: range,
            price_level: level
        };
        return Api.makeRequest(url, "POST", Api.headers(), bodyData);
    }

    static async createUserJoinSession(accessCode){
        const path = '/sessions/join';
        const url = `${Api.URL()}${path}`;

        const bodyData = {
            access_code: accessCode
        };

        return Api.makeRequest(url, "POST", Api.headers(), bodyData);
    }

    static async getPlaces(){
        let data = JwtUtil.getData();
        let sessionID = data.session_id;
        const url = `${Api.URL()}/sessions/${sessionID}/places`;
        const headers = JwtUtil.addHeader(Api.headers());

        return Api.makeRequest(url, "GET", headers, null);
    }
}
export default Api;