import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, User, Calendar, Badge, Camera, Check, X, Copy, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/index';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import Loading from '../components/Loading';
import toast from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, getMe } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  // Load profile data on mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setPageLoading(true);
      const response = await authAPI.getProfile();
      setProfileData(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
      });
    } catch (err) {
      console.error('Failed to load profile:', err);
      toast.error('Failed to load profile data');
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);

      // Update profile via API
      const response = await authAPI.updateProfile({
        name: formData.name,
        email: formData.email,
      });

      // Update local profile data
      setProfileData(response.data.user);
      
      // Refresh auth context
      await getMe();

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setAvatar(null);
      setPreview(null);
    } catch (err) {
      console.error('Profile update failed:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreview(null);
    setAvatar(null);
    setFormData({
      name: profileData?.name || '',
      email: profileData?.email || '',
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const displayData = profileData || user || {};

  const userInitials = displayData?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  const gradients = ['from-blue-500 to-blue-600', 'from-purple-500 to-pink-600', 'from-green-500 to-emerald-600'];
  const gradientClass = gradients[userInitials.charCodeAt(0) % gradients.length];

  // Format date properly
  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return 'Not available';
    }
  };

  // Copy to clipboard function
  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <Sidebar />
        <div className="flex-1 lg:ml-[220px] ml-0 flex items-center justify-center">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Sidebar />

      <div className="flex-1 lg:ml-[220px] ml-0 overflow-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="border-b border-white/20 bg-white/80 backdrop-blur-sm p-8">
          <div className="flex items-center gap-4">
            <motion.button whileHover={{ x: -4 }} onClick={() => navigate('/dashboard')} className="rounded-xl p-2 hover:bg-gray-100 transition">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </motion.button>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">My Profile</h1>
              <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
            </div>
          </div>
        </motion.div>

        <div className="p-8">
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-6">
            {/* Avatar & Basic Info Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white to-blue-50 p-8">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  {/* Avatar Section */}
                  <div className="relative">
                    <div className={`h-24 w-24 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center font-bold text-4xl text-white shadow-lg`}>
                      {preview ? (
                        <img src={preview} alt="Avatar preview" className="h-24 w-24 rounded-2xl object-cover" />
                      ) : (
                        userInitials
                      )}
                    </div>
                    {isEditing && (
                      <label className="absolute -bottom-2 -right-2 cursor-pointer">
                        <input type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="rounded-lg bg-blue-600 p-2.5 text-white hover:bg-blue-700 transition shadow-lg"
                        >
                          <Camera className="h-5 w-5" />
                        </motion.div>
                      </label>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="flex-1">
                    {!isEditing ? (
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{displayData?.name}</h2>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="bg-blue-100 text-blue-700 font-semibold px-3 py-1 rounded-full text-sm">
                            {displayData?.role === 'admin' ? 'Admin' : 'Salesperson'}
                          </div>
                        </div>
                        <p className="text-gray-600 mt-3 flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          {displayData?.email}
                        </p>
                        <p className="text-gray-500 text-sm mt-4 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Member Since: {formatDate(displayData?.createdAt)}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} placeholder="Kasun Perera" />
                        <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="kasun@gmail.com" />
                      </div>
                    )}
                  </div>

                  {/* Edit Button */}
                  <div>
                    {!isEditing ? (
                      <Button variant="primary" onClick={() => setIsEditing(true)}>
                        Edit Profile
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleSave}
                          disabled={loading}
                          className="rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white p-3 hover:from-green-600 hover:to-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          {loading ? (
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Check className="h-5 w-5" />
                          )}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCancel}
                          disabled={loading}
                          className="rounded-lg bg-gray-300 text-gray-700 p-3 hover:bg-gray-400 transition disabled:opacity-50 shadow-lg"
                        >
                          <X className="h-5 w-5" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Account Information Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-white via-blue-50 to-indigo-50 p-8 border border-white/50">
                <div className="flex items-center gap-3 mb-8">
                  <div className="rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 p-3">
                    <Badge className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* User ID - Professional Format */}
                  <motion.div whileHover={{ y: -2 }} className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-blue-100/50 hover:border-blue-200 transition">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">User ID</p>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => copyToClipboard(displayData?.userId || 'N/A', 'User ID')}
                        className="p-1.5 rounded-lg hover:bg-blue-100 transition"
                      >
                        <Copy className="h-4 w-4 text-blue-600" />
                      </motion.button>
                    </div>
                    <p className="font-bold text-xl text-blue-600 font-mono tracking-wider">{displayData?.userId || 'Generating...'}</p>
                    <p className="text-xs text-gray-500 mt-2">Professional identifier</p>
                  </motion.div>

                  {/* Role Badge */}
                  <motion.div whileHover={{ y: -2 }} className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-purple-100/50 hover:border-purple-200 transition">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Role</p>
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${displayData?.role === 'admin' ? 'bg-red-500' : 'bg-green-500'}`} />
                      <span className="font-bold text-lg text-gray-900 capitalize">
                        {displayData?.role === 'admin' ? 'Administrator' : 'Salesperson'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {displayData?.role === 'admin' ? 'Full system access' : 'Standard permissions'}
                    </p>
                  </motion.div>

                  {/* Member Since */}
                  <motion.div whileHover={{ y: -2 }} className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-green-100/50 hover:border-green-200 transition">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Member Since</p>
                    <p className="font-bold text-lg text-gray-900">{formatDate(displayData?.createdAt)}</p>
                    <p className="text-xs text-gray-500 mt-2">Account creation date</p>
                  </motion.div>

                  {/* Last Updated */}
                  <motion.div whileHover={{ y: -2 }} className="bg-white/60 backdrop-blur-sm rounded-xl p-5 border border-orange-100/50 hover:border-orange-200 transition">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Last Updated</p>
                    <p className="font-bold text-lg text-gray-900">{formatDate(displayData?.updatedAt)}</p>
                    <p className="text-xs text-gray-500 mt-2">Last profile modification</p>
                  </motion.div>
                </div>
              </Card>
            </motion.div>

            {/* Security Summary */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-8 border border-green-200/50">
                <div className="flex items-start gap-5">
                  <motion.div whileHover={{ rotate: 10 }} className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-4 flex-shrink-0">
                    <Shield className="h-7 w-7 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900">Account Security</h3>
                    <p className="text-gray-600 mt-2">Your account is secure and fully password-protected. Enable two-factor authentication for additional security.</p>
                    {/* Settings removed — Security details are shown here without external settings page */}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
