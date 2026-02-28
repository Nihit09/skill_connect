import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import Navbar from '../components/Navbar';
import PageTransition from '../components/PageTransition';
import {
    Clock, Upload, FileText, Download, UserPlus,
    MessageSquare, CheckCircle, AlertCircle, File
} from 'lucide-react';
import { motion } from 'framer-motion';

const Workspace = () => {
    const { exchangeId } = useParams();
    const [workspace, setWorkspace] = useState(null);
    const [artifacts, setArtifacts] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        fetchWorkspace();
    }, [exchangeId]);

    const fetchWorkspace = async () => {
        try {
            const res = await axiosClient.get(`/workspaces/${exchangeId}`);
            setWorkspace(res.data.data.workspace);
            setArtifacts(res.data.data.artifacts);
            setActivities(res.data.data.activities);
        } catch (error) {
            console.error("Error fetching workspace:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('comment', 'Uploaded via Workspace UI');

        setUploading(true);
        try {
            await axiosClient.post(`/workspaces/${workspace._id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchWorkspace(); // Refresh
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="loading loading-spinner loading-lg"></span></div>;
    if (!workspace) return <div className="min-h-screen flex items-center justify-center">Workspace not found or access denied.</div>;

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#0a0a0a] dark:bg-gray-900 pb-20">
                <Navbar />

                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white ">
                    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl font-bold">Exchange Workspace</h1>
                                <p className="mt-2 opacity-90 text-indigo-100">Collaborate, share files, and track progress.</p>
                                <div className="mt-4 flex gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${workspace.status === 'active' ? 'bg-green-400/20 text-green-100' : 'bg-[#0a0a0a]0/50'}`}>
                                        {workspace.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            <div className="flex -space-x-2">
                                {workspace.members.map(member => (
                                    <img key={member._id}
                                        src={member.avatar || `https://ui-avatars.com/api/?name=${member.firstName}+${member.lastName}`}
                                        alt={member.firstName}
                                        className="w-10 h-10 rounded-full border-2 border-indigo-500"
                                        title={`${member.firstName} ${member.lastName}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Files */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-transparent dark:bg-gray-800 rounded-2xl  p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-600" />
                                    Project Artifacts
                                </h2>
                                {workspace.status === 'active' && (
                                    <label className={`btn btn-primary btn-sm ${uploading ? 'loading' : ''}`}>
                                        <Upload className="w-4 h-4 mr-1" /> Upload File
                                        <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                                    </label>
                                )}
                            </div>

                            <div className="space-y-3">
                                {artifacts.length === 0 ? (
                                    <div className="text-center py-10 text-gray-500 bg-[#0a0a0a] rounded-xl border border-dashed border-gray-200">
                                        <Upload className="w-10 h-10 mx-auto text-gray-300 mb-2" />
                                        <p>No files uploaded yet.</p>
                                    </div>
                                ) : (
                                    artifacts.map((file) => (
                                        <div key={file._id} className="flex items-center justify-between p-4 bg-[#111111] dark:bg-gray-700/30 rounded-xl hover:bg-[#1a1a1a] transition border border-transparent hover:border-[#333333]">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                                    <File className="w-5 h-5 text-indigo-400" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-100 dark:text-gray-200">{file.name}</h3>
                                                    <p className="text-xs text-gray-500">
                                                        v{file.version} • {new Date(file.createdAt).toLocaleDateString()} • by {file.uploader.firstName}
                                                    </p>
                                                </div>
                                            </div>
                                            <a
                                                href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${file.storageKey}`}
                                                target="_blank"
                                                download
                                                className="btn btn-ghost btn-circle btn-sm"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4 text-gray-500" />
                                            </a>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity */}
                    <div className="lg:col-span-1">
                        <div className="bg-transparent dark:bg-gray-800 rounded-2xl  p-6 sticky top-24">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-indigo-600" />
                                Activity Timeline
                            </h2>

                            <div className="relative border-l-2 border-indigo-100 dark:border-gray-700 ml-3 space-y-6">
                                {activities.map((log) => (
                                    <div key={log._id} className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-transparent dark:bg-gray-800 border-2 border-indigo-400"></div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-100 dark:text-gray-200">
                                                {log.actor.firstName} <span className="font-normal text-gray-600 dark:text-gray-400">
                                                    {log.action === 'UPLOAD_FILE' ? 'uploaded a file' :
                                                        log.action === 'CREATE_WORKSPACE' ? 'created the workspace' :
                                                            log.action === 'Exchange Status Update' ? `changed status to ${log.details.status}` :
                                                                'performed an action'}
                                                </span>
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(log.createdAt).toLocaleString()}
                                            </p>
                                            {log.details && (
                                                <p className="text-xs text-indigo-500 mt-1 bg-indigo-50 inline-block px-2 py-1 rounded">
                                                    {log.details.fileName || log.details.message || JSON.stringify(log.details)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </PageTransition>
    );
};

export default Workspace;
