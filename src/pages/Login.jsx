import { useState, useEffect } from "react"
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import loginBackground from "../assets/images/loginBackground.png"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchUsername } from "../services/operations/authAPI.jsx"
import { login } from "../services/operations/authAPI.jsx"

const Login = ({ switchView }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [usernames, setUsernames] = useState([]) // store usernames here

  const { username, password } = formData

  // Fetch usernames on page load
  useEffect(() => {
  const getUsernames = async () => {
    try {
      const response = await fetchUsername()()
      if (Array.isArray(response?.data)) {
        setUsernames(response.data)  // response is your array of { Username: "..." }
      }
    } catch (err) {
      console.error("Failed to fetch usernames:", err)
    }
  }
  getUsernames()
}, [])


  const handleOnChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }))
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    // console.log("Logging in with:", username, password)
    dispatch(login(username, password, navigate))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#00AEEF] to-[#7B2FF7] px-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-md flex flex-col md:flex-row overflow-hidden h-full md:h-[90vh]">
        
        {/* Left Side - Logo */}
        <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center p-6">
          <img src={loginBackground} alt="background" className="w-2/3 h-auto" />
        </div>
    
        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
          <div className="w-full max-w-md">
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-800 mb-10 text-center">
              Welcome to Dashboard
            </h2>
        
            {/* Form */}
            <form className="space-y-6 bg-gray-50 p-2 rounded" onSubmit={handleOnSubmit}>
              
              {/* Username Row */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="username"
                  className="w-20 md:w-24 text-base font-medium text-black"
                >
                  Username:
                </label>
                <select
                  required
                  name="username"
                  value={username}
                  onChange={handleOnChange}
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                >
                  <option value="">Select Username</option>
                  {usernames.map((userObj, idx) => (
                    <option key={idx} value={userObj.Username}>
                      {userObj.Username}
                    </option>
                  ))}
                </select>
              </div>
        
              {/* Password Row */}
              <div className="flex items-center gap-4">
                <label
                  htmlFor="password"
                  className="w-20 md:w-24 text-base font-medium text-black"
                >
                  Password
                </label>
                <div className="relative flex-1">
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={handleOnChange}
                    placeholder="Enter Password"
                    className="w-full p-3 border border-gray-300 rounded-lg pr-10 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
                  />
                  <span
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible fontSize={20} fill="#6B7280" />
                    ) : (
                      <AiOutlineEye fontSize={20} fill="#6B7280" />
                    )}
                  </span>
                </div>
              </div>
        
              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
              >
                Login
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login
