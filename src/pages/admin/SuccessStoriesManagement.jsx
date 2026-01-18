import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSuccessStories, createSuccessStory, updateSuccessStory, deleteSuccessStory, toggleStoryStatus } from '../../services/successStoriesService';

const SuccessStoriesManagement = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [formData, setFormData] = useState({
        couple_name: '',
        story: '',
        wedding_date: '',
        image_url: '',
        is_active: true,
        display_order: 0
    });

    useEffect(() => {
        loadStories();
    }, []);

    const loadStories = async () => {
        const { stories: data, error } = await getSuccessStories(true); // Include inactive
        if (!error) {
            setStories(data);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (editingStory) {
            const { success } = await updateSuccessStory(editingStory.id, formData);
            if (success) {
                alert('Success story updated!');
                resetForm();
                loadStories();
            }
        } else {
            const { success } = await createSuccessStory(formData);
            if (success) {
                alert('Success story created!');
                resetForm();
                loadStories();
            }
        }
    };

    const handleEdit = (story) => {
        setEditingStory(story);
        setFormData({
            couple_name: story.couple_name,
            story: story.story,
            wedding_date: story.wedding_date || '',
            image_url: story.image_url || '',
            is_active: story.is_active,
            display_order: story.display_order
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this success story?')) {
            const { success } = await deleteSuccessStory(id);
            if (success) {
                alert('Success story deleted!');
                loadStories();
            }
        }
    };

    const handleToggleStatus = async (id, currentStatus) => {
        const { success } = await toggleStoryStatus(id, !currentStatus);
        if (success) {
            loadStories();
        }
    };

    const resetForm = () => {
        setFormData({
            couple_name: '',
            story: '',
            wedding_date: '',
            image_url: '',
            is_active: true,
            display_order: 0
        });
        setEditingStory(null);
        setShowForm(false);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, image_url: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900">
                <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                        <h1 className="text-2xl font-bold text-white">Success Stories</h1>
                    </div>
                </header>
                <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-saffron"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Header */}
            <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-white">Success Stories</h1>
                            <p className="text-gray-400 text-sm">Manage success stories displayed on home page</p>
                        </div>
                        <Link
                            to="/admin/dashboard"
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-gray-400">Total Stories: {stories.length}</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-saffron hover:bg-saffron-dark text-white rounded-lg transition-colors font-medium"
                    >
                        {showForm ? 'Cancel' : '+ Add Success Story'}
                    </button>
                </div>

                {/* Form */}
                {showForm && (
                    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6 border border-gray-700">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Couple Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.couple_name}
                                        onChange={(e) => setFormData({ ...formData, couple_name: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g., Rahul & Priya"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Wedding Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.wedding_date}
                                        onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
                                        className="input-field"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.display_order}
                                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                        className="input-field"
                                        placeholder="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.value === 'true' })}
                                        className="input-field"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Story *
                                </label>
                                <textarea
                                    value={formData.story}
                                    onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                    className="input-field"
                                    rows="4"
                                    placeholder="Write the success story..."
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Couple Photo
                                </label>
                                {formData.image_url && (
                                    <img
                                        src={formData.image_url}
                                        alt="Preview"
                                        className="w-32 h-32 object-cover rounded-lg mb-2"
                                    />
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-saffron file:text-white hover:file:bg-saffron-dark"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="btn-primary">
                                    {editingStory ? 'Update Story' : 'Create Story'}
                                </button>
                                <button type="button" onClick={resetForm} className="btn-secondary">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Stories List */}
                <div className="space-y-4">
                    {stories.length === 0 ? (
                        <div className="card p-8 text-center">
                            <p className="text-gray-500">No success stories yet. Add your first one!</p>
                        </div>
                    ) : (
                        stories.map((story) => (
                            <div key={story.id} className="card p-6">
                                <div className="flex gap-6">
                                    {story.image_url && (
                                        <img
                                            src={story.image_url}
                                            alt={story.couple_name}
                                            className="w-32 h-32 object-cover rounded-lg"
                                        />
                                    )}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-800">{story.couple_name}</h3>
                                                {story.wedding_date && (
                                                    <p className="text-sm text-gray-600">
                                                        Married: {new Date(story.wedding_date).toLocaleDateString('en-IN')}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${story.is_active
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {story.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                                    Order: {story.display_order}
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 mb-4">{story.story}</p>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(story)}
                                                className="btn-secondary text-sm py-1.5 px-4"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleToggleStatus(story.id, story.is_active)}
                                                className={`text-sm py-1.5 px-4 rounded-lg font-medium ${story.is_active
                                                    ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                                                    : 'bg-green-600 text-white hover:bg-green-700'
                                                    }`}
                                            >
                                                {story.is_active ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(story.id)}
                                                className="bg-red-600 text-white text-sm py-1.5 px-4 rounded-lg hover:bg-red-700 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
};

export default SuccessStoriesManagement;
