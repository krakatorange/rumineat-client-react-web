var jwtDecode = require('jwt-decode');

export default class JwtUtil {
    static setToken(token) {
        return localStorage.setItem('id_token', token)
    }

    static getToken(){
        return localStorage.getItem('id_token');
    }

    static addHeader(headers){
        headers['authorization'] = "Bearer: "+ JwtUtil.getToken()
        return headers;
    }

    static getData(){
        const token = this.getToken();
        const data = jwtDecode(token);
        return data; //TODO: extract the useful parts
    }
}