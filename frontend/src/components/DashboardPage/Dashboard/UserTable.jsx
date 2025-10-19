import React from "react";

const UserTable = ({ users }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Danh sách người dùng</h2>

      <table className="min-w-full border border-gray-200 text-sm">
        <thead>
          <tr className="bg-gray-100 text-left text-gray-600">
            <th className="px-4 py-2 border-b">Tên</th>
            <th className="px-4 py-2 border-b">Email</th>
            <th className="px-4 py-2 border-b">Địa chỉ</th>
            <th className="px-4 py-2 border-b">SĐT</th>
            <th className="px-4 py-2 border-b">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{user.username}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.address}</td>
                <td className="px-4 py-2 border-b">{user.phone}</td>
                <td className="px-4 py-2 border-b">
                  {user.isActive ? (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                      Không hoạt động
                    </span>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
