import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import jwt_decode from "jwt-decode";

const LoginRedir = () => {
    const { auth } = useAuth();
    
    const decoded = auth?.accessToken
        ? jwt_decode(auth.accessToken)
        : undefined;
    
    const roles = decoded?.UserInfo?.roles || [];

    return (
        roles 
            ? roles.includes(2004) 
                ? <Navigate to="/panel" replace />
                : roles.includes(1101) 
                    ? <Navigate to="https://panel.inroom.tech/login" replace />
                    : <Navigate to="/" replace />
            : <Navigate to="/login" replace />
    );    
}

export default LoginRedir
