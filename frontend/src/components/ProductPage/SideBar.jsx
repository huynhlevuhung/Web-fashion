import React, { useEffect, useState } from "react";
import api from "@/utils/api";
import { ChevronDown } from "lucide-react";

const Sidebar = ({ setFilters }) => {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const [selectedSex, setSelectedSex] = useState(null);
  const [showTags, setShowTags] = useState(true);
  const [showSex, setShowSex] = useState(true);

  // 🧭 Lấy danh sách Tag
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await api.get("/tags");
        const data =
          res?.data?.data ??
          res?.data?.tags ??
          (Array.isArray(res?.data) ? res.data : []);
        setTags(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi lấy tags:", err);
        setTags([]);
      }
    };
    fetchTags();
  }, []);

  // 🔁 Cập nhật filters khi thay đổi
  useEffect(() => {
    const newFilters = {};
    if (selectedTag) newFilters.tag = selectedTag;
    if (selectedSex) newFilters.sex = selectedSex;

    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      curPage: 1,
    }));
  }, [selectedTag, selectedSex, setFilters]);

  return (
    <aside className="w-64 bg-white shadow-md rounded-lg p-4 space-y-6">
      {/* Lọc theo loại */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowTags((prev) => !prev)}
        >
          <h2 className="text-lg font-semibold">Loại</h2>
          <ChevronDown
            className={`transform transition-transform duration-300 ${
              showTags ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showTags && (
          <div className="mt-3 space-y-2">
            {tags.map((tag) => (
              <label
                key={tag._id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                  selectedTag === tag._id ? "bg-blue-50" : ""
                }`}
                onClick={() =>
                  setSelectedTag(selectedTag === tag._id ? null : tag._id)
                }
              >
                <input
                  type="radio"
                  name="tag"
                  checked={selectedTag === tag._id}
                  readOnly
                  className="accent-blue-600"
                />
                <span className="text-gray-700">
                  {tag.nameTag || tag.name}
                </span>
              </label>
            ))}

            {tags.length === 0 && (
              <p className="text-sm text-gray-500 italic">Không có tag nào.</p>
            )}
          </div>
        )}
      </div>

      {/* Lọc theo giới tính */}
      <div>
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowSex((prev) => !prev)}
        >
          <h2 className="text-lg font-semibold">Giới tính</h2>
          <ChevronDown
            className={`transform transition-transform duration-300 ${
              showSex ? "rotate-180" : "rotate-0"
            }`}
          />
        </div>

        {showSex && (
          <div className="mt-3 space-y-2">
            {["Nam", "Nữ", "Trẻ em", "Unisex"].map((sex) => (
              <label
                key={sex}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all hover:bg-gray-100 ${
                  selectedSex === sex ? "bg-blue-50" : ""
                }`}
                onClick={() =>
                  setSelectedSex(selectedSex === sex ? null : sex)
                }
              >
                <input
                  type="radio"
                  name="sex"
                  checked={selectedSex === sex}
                  readOnly
                  className="accent-blue-600"
                />
                <span className="text-gray-700">{sex}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
