// import { createContext, useState, useEffect } from "react";
// import axios from "axios";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [tokens, setTokens] = useState(() =>
//     localStorage.getItem("tokens")
//       ? JSON.parse(localStorage.getItem("tokens"))
//       : null
//   );
//   const [user, setUser] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(!!tokens);
//   const api = "http://127.0.0.1:8000/api"; // API endpoint

//   useEffect((e) => {
//     if (tokens) {
//       setUser(user);


//        // Set user based on tokens (in a real app, decode the token)
//     }
//   }, [tokens]);

//   const login = async (username, password) => {
//     try {
//       const response = await axios.post(`${api}/login/`, {
//         username,
//         password,
//       });
//       setTokens(response.data);
//       localStorage.setItem("tokens", JSON.stringify(response.data));
//       setIsLoggedIn(true);
//       setUser(username);
//     } catch (error) {
//       console.error("Login failed:", error);
//     }
//   };

//   const signup = async (username, password) => {
//     try {
//       await axios.post(`${api}/signup/`, { username, password });
//       await login(username, password);
//     } catch (error) {
//       console.error("Signup failed:", error);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(`${api}/logout/`, { refresh: tokens?.refresh });
//       setTokens(null);
//       setUser(null);
//       localStorage.removeItem("tokens");
//       setIsLoggedIn(false);
//     } catch (error) {
//       console.error("Logout failed:", error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthContext;

import { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [tokens, setTokens] = useState(() =>
    localStorage.getItem("tokens")
      ? JSON.parse(localStorage.getItem("tokens"))
      : null
  );
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!tokens);
  const api = "http://127.0.0.1:8000/api"; // API endpoint

  useEffect(() => {
    if (tokens) {
      getUsername(); // Fetch username when tokens are available
    } else {
      setUser(null); // Reset user if tokens are not present
    }
  }, [tokens]);

  const getUsername = async () => {
    try {
      const response = await axios.get(`${api}/get-username/`, {
        headers: {
          Authorization: `Bearer ${tokens.access}`, // Use the access token
        },
      });
      setUser(response.data.username); // Set the username
    } catch (error) {
      console.error("Error fetching username:", error);
      setUser(null); // Reset user if there's an error
    }
  };

  const login = async (username, password) => {
    try {
      const response = await axios.post(`${api}/login/`, {
        username,
        password,
      });
      setTokens(response.data);
      localStorage.setItem("tokens", JSON.stringify(response.data));
      setIsLoggedIn(true);
      await getUsername(); // Fetch username after login
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const signup = async (username, password) => {
    try {
      await axios.post(`${api}/signup/`, { username, password });
      await login(username, password);
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${api}/logout/`, { refresh: tokens?.refresh });
      setTokens(null);
      setUser(null);
      localStorage.removeItem("tokens");
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

