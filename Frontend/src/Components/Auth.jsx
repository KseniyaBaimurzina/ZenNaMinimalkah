
export const setToken = (token, role)=>{
    localStorage.setItem('role', role)
    localStorage.setItem('temitope', token);
}

export const fetchToken = ()=>{
    if(localStorage.getItem('temitope')) return localStorage.getItem('role');
    return localStorage.getItem('temitope');
}
