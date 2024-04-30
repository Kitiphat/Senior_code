import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext(); // Create Context

export const ThemeProvider = ({ children }) => {
  const [themeColor, setThemeColor] = useState(""); // Create state to store theme colors
  const darkThemeColors = {
    navbar: "#333333",
    username: "#CCCCCC",
    link: "#CCCCCC",
    settingsIcon: "#CCCCCC"
    // Add other colors according to the part that you want to change to dark.
    };

  const changeTheme = (color) => {
    setThemeColor(color === "Dark" ? darkThemeColors : ""); // Set the dark color when selecting Dark theme.
  };

  return (
    <ThemeContext.Provider value={{ themeColor, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext); // Custom hook to use Context
};