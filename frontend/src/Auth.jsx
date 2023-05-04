
export const setToken = (token, role)=>{
    localStorage.setItem('role', role)
    localStorage.setItem('temitope', token);
}

export const fetchToken = (token)=>{
    if(localStorage.getItem('temitope')) return localStorage.getItem('role');
    return localStorage.getItem('temitope');
}

// export function RequireToken({children}){
//     let auth = fetchToken();
//     let location = useLocation();
//     console.log("Check Auth");

//     // if(!auth){
//     //     console.log("Unauthorized");
//     //     return <Navigate to='/login' state ={{from : location}}/>;
//     // }

//     return children;
// }
