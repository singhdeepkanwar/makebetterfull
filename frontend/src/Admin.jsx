import React, { useState, useEffect } from 'react';
import axios from 'axios';
// FIX: Updated Icon names for Font Awesome 6
import { FaFloppyDisk, FaRotate, FaArrowLeft, FaTable } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Import Logout Icon


export default function Admin() {
  const [content, setContent] = useState(JSON.stringify({}, null, 2));
  const [leads, setLeads] = useState([]);
  const [activeTab, setActiveTab] = useState('content');
  const [status, setStatus] = useState('');
    const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
    };
  // Fetch Data on Load
  useEffect(() => {
    fetchContent();
    fetchLeads();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/content`);
      setContent(JSON.stringify(res.data, null, 4)); // Pretty print JSON
    } catch (err) { alert("Failed to load content"); }
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/leads`);
      setLeads(res.data);
    } catch (err) { alert("Failed to load leads"); }
  };

  const handleSave = async () => {
    try {
      setStatus('Saving...');
      const parsed = JSON.parse(content); // Validate JSON before sending
      await axios.put(`${API_URL}/api/content`, parsed);
      setStatus('Saved Successfully!');
      setTimeout(() => setStatus(''), 2000);
    } catch (err) {
      setStatus('Error: Invalid JSON format');
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Makebetter Admin</h1>
        <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-blue-400 hover:text-white transition"><FaArrowLeft /> Back to Site</Link>
        <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 hover:text-white transition text-sm font-bold">
            <FaSignOutAlt /> Logout
        </button>
        </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-800 pb-1">
          <button onClick={() => setActiveTab('content')} className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>Website Content</button>
          <button onClick={() => setActiveTab('leads')} className={`px-4 py-2 font-medium ${activeTab === 'leads' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>Leads / Inquiries</button>
        </div>

        {/* CONTENT EDITOR TAB */}
        {activeTab === 'content' && (
          <div className="bg-[#0F172A] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between mb-4">
              <p className="text-sm text-gray-400">Edit the JSON below to update text instantly.</p>
              <div className="flex items-center gap-4">
                <span className={`text-sm ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>{status}</span>
                {/* Updated Icon: FaRotate */}
                <button onClick={fetchContent} className="p-2 text-gray-400 hover:text-white" title="Refresh"><FaRotate /></button>
                {/* Updated Icon: FaFloppyDisk */}
                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition">
                  <FaFloppyDisk /> Save Changes
                </button>
              </div>
            </div>
            <textarea
              className="w-full h-[600px] bg-[#020617] text-green-400 font-mono text-sm p-4 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck="false"
            />
          </div>
        )}

        {/* LEADS TAB */}
        {activeTab === 'leads' && (
          <div className="bg-[#0F172A] rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-900 text-gray-400 text-sm uppercase">
                  <th className="p-4 border-b border-gray-800">Date</th>
                  <th className="p-4 border-b border-gray-800">Name</th>
                  <th className="p-4 border-b border-gray-800">Company</th>
                  <th className="p-4 border-b border-gray-800">Email</th>
                  <th className="p-4 border-b border-gray-800">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-800/50 transition">
                    <td className="p-4 text-gray-500 text-sm">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-white">{lead.name}</td>
                    <td className="p-4 text-gray-300">{lead.company}</td>
                    <td className="p-4 text-blue-400">{lead.email}</td>
                    <td className="p-4 text-gray-400 text-sm max-w-xs truncate" title={lead.message}>{lead.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && <div className="p-8 text-center text-gray-500">No leads found yet.</div>}
          </div>
        )}
      </div>
    </div>
  );
}