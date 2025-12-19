import axios from "axios";



axios.defaults.baseURL = "https://zipfile.pythonanywhere.com"
axios.defaults.headers.get['Accept'] = 'application/json';
// Don't set Content-Type for POST by default - let FormData handle it
// axios.defaults.headers.post['Content-Type'] = 'application/json';


export default axios