import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const PrivateRoutes = () => {
    const { userInfo } = useContext(UserContext);
  return (
      userInfo ? <Outlet /> : <Navigate to='/login' />
  )
};

export default PrivateRoutes;