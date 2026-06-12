import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTenants, login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [tenants, setTenants] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getTenants()
      .then(data => {
        if (Array.isArray(data)) setTenants(data);
      })
      .catch(err => console.error("Failed to fetch tenants:", err));
  }, []);

  const handleTenantSelect = (e) => {
    const slug = e.target.value;
    setSelectedSlug(slug);
    setError("");
  };

  const handleCompanySubmit = (e) => {
    e.preventDefault();
    if (selectedSlug) {
      console.log(`[Frontend] Company selected: ${selectedSlug}. Proceeding to login form.`);
      setShowLoginForm(true);
    } else {
      setError("Please select a company first.");
    }
  };

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");
    setLoading(true);
    console.log(`[Frontend] Attempting login for company: ${selectedSlug}`);
    console.log(`[Frontend] This will trigger backend 'resolveCompany' middleware to fetch Tenant ID and Connection String.`);

    try {
      const res = await login(selectedSlug, form);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("tenant_id", res.user.tenant_id);
        localStorage.setItem("company_slug", selectedSlug);
        alert(`Login successful for ${res.user.username}!`);
        navigate("/dashboard");
      } else {
        setError(res.error || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="w-[400px] p-8 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Multi-Tenant Login</h2>
        
        <form onSubmit={handleCompanySubmit} className="mb-4">
          <label className="block text-sm font-semibold text-gray-600 mb-1.5">Select Your Company</label>
          <div className="flex gap-2 items-center">
            <select
              value={selectedSlug}
              onChange={handleTenantSelect}
              className="flex-1 p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Choose Company --</option>
              {tenants.map((t) => (
                <option key={t.tenant_id} value={t.slug}>
                  {t.tenant_name}
                </option>
              ))}
            </select>
            <button type="submit" className="px-4 py-3 bg-emerald-500 text-white rounded-md font-semibold cursor-pointer hover:bg-emerald-600">Submit</button>
          </div>
        </form>

        {showLoginForm && (
          <div className="animate-in fade-in duration-500">
            <hr className="my-6 border-t border-gray-200" />
            <h3 className="text-lg text-gray-700 mb-4 text-center font-medium">Login to {selectedSlug}</h3>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Email Address</label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-600 mb-1.5">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full p-3 rounded-md border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}

              <button 
                type="submit" 
                className={`w-full p-3 bg-blue-600 text-white rounded-md text-base font-semibold cursor-pointer mt-3 hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={loading}
              >
                {loading ? "Authenticating..." : `Login to ${selectedSlug}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}



