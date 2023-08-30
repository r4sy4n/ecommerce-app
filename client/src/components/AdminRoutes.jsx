import { Outlet, Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

const AdminRoutes = () => {
    const { userInfo } = useContext(UserContext);
  return (
      userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to='/login' replace />
  )
};

export default AdminRoutes;