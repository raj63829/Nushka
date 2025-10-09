import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Package,
  Heart,
  Settings,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import { supabase, Address, Order } from "../../lib/supabase";
import { useCart } from "../../context/CartContext";

const Dashboard: React.FC = () => {
  const { state: cartState } = useCart();

  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [addressForm, setAddressForm] = useState({
    name: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    is_default: false,
  });

  // ✅ Load user session from Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/login";
      } else {
        setUser(user);
        setProfileForm({
          name: user.user_metadata?.name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
        });
        loadAddresses(user.id);
        loadOrders(user.id);
      }
    };
    getUser();
  }, []);

  // ✅ Load Addresses from Supabase
  const loadAddresses = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false });

    if (error) console.error("Error loading addresses:", error);
    else setAddresses(data || []);
  };

  // ✅ Load Orders from Supabase
  const loadOrders = async (userId: string) => {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *,
          products (name, images)
        )
      `
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error loading orders:", error);
    else setOrders(data as Order[]);
  };

  // ✅ Update Profile in Supabase Auth
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, phone } = profileForm;

    const { error } = await supabase.auth.updateUser({
      data: { name, phone },
    });

    if (error) {
      alert("Failed to update profile: " + error.message);
    } else {
      alert("Profile updated successfully!");
      setIsEditing(false);
    }
  };

  // ✅ Add or Update Address
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      if (editingAddress) {
        await supabase
          .from("user_addresses")
          .update(addressForm)
          .eq("id", editingAddress.id);
      } else {
        await supabase
          .from("user_addresses")
          .insert({ ...addressForm, user_id: user.id });
      }

      loadAddresses(user.id);
      setShowAddressForm(false);
      setEditingAddress(null);
      setAddressForm({
        name: "",
        address_line_1: "",
        address_line_2: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        is_default: false,
      });
    } catch (error) {
      console.error("Error saving address:", error);
    }
  };

  // ✅ Delete Address
  const deleteAddress = async (addressId: string) => {
    const { error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", addressId);
    if (error) console.error(error);
    else if (user) loadAddresses(user.id);
  };

  // ✅ Tabs List
  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // ✅ Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-sage-800 mb-4">
            Please Sign In
          </h2>
          <p className="text-sage-600">
            You need to be logged in to access your dashboard.
          </p>
        </div>
      </div>
    );
  }

  // ✅ UI Section
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-sage-800">My Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sage-800">
                    {user.user_metadata?.name || "User"}
                  </h3>
                  <p className="text-sm text-sage-600">{user.email}</p>
                </div>
              </div>

              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-sage-100 text-sage-800"
                        : "text-sage-600 hover:bg-sage-50"
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-sage-100 p-6">
              {activeTab === "profile" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-sage-800">
                      Profile Information
                    </h2>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center space-x-2 text-sage-600 hover:text-sage-800"
                    >
                      <Edit className="h-4 w-4" />
                      <span>{isEditing ? "Cancel" : "Edit"}</span>
                    </button>
                  </div>

                  {isEditing ? (
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileForm.email}
                          disabled
                          className="w-full p-3 border border-sage-200 rounded-md bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-2">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          className="w-full p-3 border border-sage-200 rounded-md focus:ring-2 focus:ring-sage-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-sage-600 text-white px-6 py-2 rounded-md hover:bg-sage-700 transition-colors"
                      >
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1">
                          Name
                        </label>
                        <p className="text-sage-800">
                          {user.user_metadata?.name || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1">
                          Email
                        </label>
                        <p className="text-sage-800">{user.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-sage-700 mb-1">
                          Phone
                        </label>
                        <p className="text-sage-800">
                          {user.user_metadata?.phone || "Not provided"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "addresses" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-sage-800">
                      Saved Addresses
                    </h2>
                    <button
                      onClick={() => setShowAddressForm(true)}
                      className="flex items-center space-x-2 bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Address</span>
                    </button>
                  </div>

                  {/* Address Form */}
                  {showAddressForm && (
                    <div className="mb-6 p-4 border border-sage-200 rounded-md">
                      <h3 className="text-lg font-medium text-sage-800 mb-4">
                        {editingAddress ? "Edit Address" : "Add New Address"}
                      </h3>
                      <form
                        onSubmit={handleAddressSubmit}
                        className="grid grid-cols-2 gap-4"
                      >
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Name
                          </label>
                          <input
                            type="text"
                            value={addressForm.name}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                name: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={addressForm.phone}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                phone: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            value={addressForm.address_line_1}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                address_line_1: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                            required
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            value={addressForm.address_line_2}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                address_line_2: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={addressForm.city}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                city: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            value={addressForm.state}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                state: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-sage-700 mb-2">
                            PIN Code
                          </label>
                          <input
                            type="text"
                            value={addressForm.pincode}
                            onChange={(e) =>
                              setAddressForm({
                                ...addressForm,
                                pincode: e.target.value,
                              })
                            }
                            className="w-full p-2 border border-sage-200 rounded-md"
                            required
                          />
                        </div>
                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={addressForm.is_default}
                              onChange={(e) =>
                                setAddressForm({
                                  ...addressForm,
                                  is_default: e.target.checked,
                                })
                              }
                              className="text-sage-600"
                            />
                            <span className="text-sm text-sage-700">
                              Set as default address
                            </span>
                          </label>
                        </div>
                        <div className="col-span-2 flex space-x-4">
                          <button
                            type="submit"
                            className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 transition-colors"
                          >
                            {editingAddress ? "Update Address" : "Save Address"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAddressForm(false);
                              setEditingAddress(null);
                            }}
                            className="border border-sage-300 text-sage-600 px-4 py-2 rounded-md hover:bg-sage-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Address List */}
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div
                        key={address.id}
                        className="border border-sage-200 rounded-md p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sage-800">
                              {address.name}
                            </h4>
                            <p className="text-sage-600 text-sm mt-1">
                              {address.address_line_1}
                              {address.address_line_2 &&
                                `, ${address.address_line_2}`}
                            </p>
                            <p className="text-sage-600 text-sm">
                              {address.city}, {address.state} {address.pincode}
                            </p>
                            <p className="text-sage-600 text-sm">
                              Phone: {address.phone}
                            </p>
                            {address.is_default && (
                              <span className="inline-block bg-sage-100 text-sage-700 text-xs px-2 py-1 rounded-full mt-2">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingAddress(address);
                                setAddressForm(address);
                                setShowAddressForm(true);
                              }}
                              className="text-sage-600 hover:text-sage-800"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => deleteAddress(address.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div>
                  <h2 className="text-xl font-semibold text-sage-800 mb-6">
                    My Orders
                  </h2>
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <p className="text-sage-600">No orders found.</p>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.order_id}
                          className="border border-sage-200 rounded-md p-4"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium text-sage-800">
                                Order #{order.order_id.slice(-8)}
                              </h4>
                              <p className="text-sm text-sage-600">
                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-sage-800">
                                ₹{order.total_amount.toLocaleString()}
                              </p>
                              <span
                                className={`inline-block px-2 py-1 rounded-full text-xs ${
                                  order.order_status === "delivered"
                                    ? "bg-green-100 text-green-800"
                                    : order.order_status === "shipped"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.order_status === "processing"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {order.order_status
                                  .charAt(0)
                                  .toUpperCase() +
                                  order.order_status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-sage-600">
                            <p>Payment: {order.payment_method}</p>
                            <p>Status: {order.payment_status}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && (
                <div>
                  <h2 className="text-xl font-semibold text-sage-800 mb-6">
                    My Wishlist
                  </h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cartState.wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="border border-sage-200 rounded-md p-4"
                      >
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-full h-32 object-cover rounded-md mb-3"
                        />
                        <h4 className="font-medium text-sage-800 mb-2">
                          {item.name}
                        </h4>
                        <p className="text-sage-600 text-sm mb-2">
                          ₹{item.price.toLocaleString()}
                        </p>
                        <button className="w-full bg-sage-600 text-white py-2 rounded-md text-sm hover:bg-sage-700 transition-colors">
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div>
                  <h2 className="text-xl font-semibold text-sage-800 mb-6">
                    Account Settings
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-sage-800 mb-3">
                        Security
                      </h3>
                      <button className="bg-sage-600 text-white px-4 py-2 rounded-md hover:bg-sage-700 transition-colors">
                        Change Password
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-sage-800 mb-3">
                        Notifications
                      </h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="text-sage-600"
                            defaultChecked
                          />
                          <span className="text-sage-700">
                            Email notifications for orders
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="text-sage-600"
                            defaultChecked
                          />
                          <span className="text-sage-700">
                            SMS notifications for delivery
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="text-sage-600" />
                          <span className="text-sage-700">
                            Marketing emails
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
