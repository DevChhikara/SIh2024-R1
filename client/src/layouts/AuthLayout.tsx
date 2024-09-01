import { Outlet } from "react-router-dom";
import './styles.css';

const AuthLayout = () => {
  return (
    <div className="flex items-center justify-center min-h-full">
      <Outlet />
    </div>
  );
};

export default AuthLayout;
