import { NavLink, useRouteError } from "react-router-dom"

export const ErrorPage=()=>
{
    const error=useRouteError();
    return<>
    <h1>
        Oops! An Error Occurred.
    </h1>
    {error && <p>{error.data}<br></br> {error.status}</p> }
    <NavLink to="/"> <button>Go Home</button></NavLink>
    </>
}