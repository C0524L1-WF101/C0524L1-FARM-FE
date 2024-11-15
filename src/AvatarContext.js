import React, { createContext, useContext, useState } from 'react';

// Tạo context cho Avatar
const AvatarContext = createContext();

// Custom hook để sử dụng context dễ dàng
export const useAvatar = () => {
  return useContext(AvatarContext);
};

// Provider để cung cấp state avatar cho toàn bộ ứng dụng
export const AvatarProvider = ({ children }) => {
  const [avatar, setAvatar] = useState(null);

  const updateAvatar = (newAvatar) => {
    setAvatar(newAvatar);
  };

  return (
    <AvatarContext.Provider value={{ avatar, updateAvatar }}>
      {children}
    </AvatarContext.Provider>
  );
};
