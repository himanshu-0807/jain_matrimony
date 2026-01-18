import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAllApplications } from '../../services/adminService';

const PendingApplications = () => {
    const { status } = useParams(); // 'pending', 'approved', 'rejected', or 'all'
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadApplications();
    }, [status]);

    const loadApplications = async () => {
        setLoading(true);
        const filterStatus = status === 'all' ? null : status;
        const { applications: data, error } = await getAllApplications(filterStatus);

        if (!error && data) {
            setApplications(data);
        }
        setLoading(false);
    };

    const filteredApplications = applications.filter(app =>
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm)
    );

    const getStatusBadge = (status) => {
        const badges = {
            pending: 'bg-yellow-600 text-yellow-100',
            approved: 'bg-green-600 text-green-100',
            rejected: 'bg-red-600 text-red-100'
        };
        return badges[status] || 'bg-gray-600 text-gray-100';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <Link to="/admin/dashboard" className="text-gray-400 hover:text-white text-sm mb-1 block">
                                ← Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold text-white capitalize">
                                {status === 'all' ? 'All' : status} Applications
                            </h1>
                        </div>
                        <div className="text-gray-400">
                            {filteredApplications.length} application(s)
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by email or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-saffron"
                    />
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                        <p className="text-gray-400 mt-4">Loading applications...</p>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-gray-400 text-lg">No applications found</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredApplications.map((app) => (
                            <div key={app.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-saffron transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(app.status)}`}>
                                                {app.status.toUpperCase()}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {formatDate(app.created_at)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-gray-400 text-sm">Email</p>
                                                <p className="text-white font-medium">{app.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-400 text-sm">Phone</p>
                                                <p className="text-white font-medium">{app.phone}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <span>📄 Biodata: {app.biodata_pdf_url ? 'Uploaded' : 'Missing'}</span>
                                            <span>📷 Photos: {app.photo_urls?.length || 0}/5</span>
                                        </div>
                                    </div>

                                    <Link
                                        to={`/admin/review/${app.id}`}
                                        className="ml-4 px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition-colors font-medium"
                                    >
                                        {app.status === 'pending' ? 'Review' : 'View'}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default PendingApplications;
