import { useContext, useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import {
  signInWithGoogle,
} from "../../services/authServices";
import { UserContext } from "../../providers/UserProvider";
import Loader from "../Shared/Loader/Loader";
import "./Login.scss"
const Login =()=>{
    const info =useContext(UserContext);
    const { user, isLoading }= info;
    const [redirect,setredirect]= useState(null);
    
    useEffect(()=>{
        if(user && !isLoading){
            setredirect("/");
        }
    },[user,isLoading]);
    if(redirect){
        return <Redirect to={redirect}/>
    }
    return(
        <div className="login">
            {isLoading &&<Loader/>}
            {!isLoading &&(
                <div className="logincard">
                    <p>Login</p>
                    <p className="line"></p>
                    <p>Connect with</p>
                    <p>
                        <img className="google-img"
                        src={"/asset/images/login/google.png"}
                        onClick={signInWithGoogle}
                        alt=""
                    />
                    </p>
                </div>
            )}
        </div>
    )
}

export default Login;