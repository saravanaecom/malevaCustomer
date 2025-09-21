import { useState, useEffect } from 'react';
import { User, Mail, Building, MapPin, Calendar, X } from 'lucide-react';
import { useUser } from '../hooks/useUser.js';
import { customerService } from '../services/customerService.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

export default function Profile() {
  const { customerId, companyId } = useUser();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomerDetails();
  }, [customerId, companyId]);

  const fetchCustomerDetails = async () => {
    if (!customerId || !companyId) {
      setError('Customer ID or Company ID not available');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching customer details for:', { customerId, companyId });
      
      const result = await customerService.getCustomerDetails(customerId, companyId);
      console.log('API Response:', result);
      
      if (result.IsSuccess && result.Data1 && result.Data1.length > 0) {
        setCustomerData(result.Data1[0]);
        console.log('Customer data set:', result.Data1[0]);
      } else {
        setError('Customer details not found');
      }
    } catch (err) {
      setError(`Failed to fetch customer details: ${err.message}`);
      console.error('Error fetching customer details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border text-center max-w-sm w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Loading Profile</h2>
          <p className="text-gray-600 text-sm">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border text-center max-w-sm w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-6 h-6 text-red-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Profile</h2>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button 
            onClick={fetchCustomerDetails}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 shadow-sm border text-center max-w-sm w-full">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No Profile Data</h2>
          <p className="text-gray-600 text-sm">Customer details not available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-3 sm:p-6 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Customer Profile</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-20 sm:h-24"></div>
          <div className="p-4 sm:p-6 -mt-10 sm:-mt-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white flex-shrink-0">
                <User className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
              <div className="text-center sm:text-left flex-1 mt-2 sm:mt-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 mt-5">{customerData.CustomerName}</h2>
                <p className="text-gray-600 mb-3 text-sm sm:text-base">{customerData.CNumberDisplay}</p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium">
                    ID: {customerData.Id}
                  </span>
                  <span className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white ${
                    customerData.Active === 1 ? 'bg-emerald-500' : 'bg-rose-500'
                  }`}>
                    {customerData.Active === 1 ? '✓ Active' : '✗ Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Contact Information</h3>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Email Address</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.Email || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Mobile Number</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.MobileNo || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">City</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.City || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Company Information</h3>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Company Code</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.CompanyCode || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">GST Number</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.GSTNO || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">SST Number</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.SSTNo || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Address Information</h3>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Address Line 1</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.Address1?.trim() || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Address Line 2</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.Address2 || 'Not provided'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Address Line 3</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">{customerData.Address3 || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Account Details</h3>
              </div>
            </div>
            <div className="p-4 sm:p-5">
              <div className="space-y-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Created Date</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">
                    {customerData.Created_Date ? new Date(customerData.Created_Date).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs sm:text-sm text-slate-600 mb-1 font-medium">Last Modified</p>
                  <p className="text-gray-800 font-semibold text-sm sm:text-base">
                    {customerData.Modified_Date ? new Date(customerData.Modified_Date).toLocaleDateString() : 'Not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}