import { useEffect, useState } from "react";
import api from "../utils/api";

function Test() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/users/me", {
          withCredentials: true,
        });
        setUser(res.data.data.user);
      } catch (err) {
        console.error(
          "JWT không hợp lệ hoặc chưa login:",
          err.response?.data.message
        );
      }
    };

    checkAuth();
  }, []);

  return (
    <div>
      {user ? (
        <p>
          Xin chào {user.username} - Email: {user.email}
        </p>
      ) : (
        <p>Chưa đăng nhập</p>
      )}
    </div>
  );
}

export default Test;
