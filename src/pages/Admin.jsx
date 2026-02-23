import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [activeTab, setActiveTab] = useState('news'); // 'news' | 'alumni'

  // ---------- 状态管理 ----------
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState([]);
  const [alumniList, setAlumniList] = useState([]);

  const [newsForm, setNewsForm] = useState({
    title: '',
    category: 'Campus',
    summary: '',
    content: '',
    author: 'SUZUMIYA',
    date: new Date().toISOString().slice(0, 10),
  });
  const [alumniForm, setAlumniForm] = useState({ name: '', role: '', quote: '' });

  const [newsFile, setNewsFile] = useState(null);
  const [alumniFile, setAlumniFile] = useState(null);

  // 1. 初始化拉取
  useEffect(() => {
    if (auth) {
      fetchData();
    }
  }, [auth, activeTab]);

  const fetchData = () => {
    if (activeTab === 'news') fetchNews();
    else fetchAlumni();
  };

  // ===================== 数据操作逻辑 =====================

  const fetchNews = async () => {
    const { data } = await supabase.from('news').select('*').order('created_at', { ascending: false });
    setNewsList(data || []);
  };

  const fetchAlumni = async () => {
    const { data } = await supabase.from('alumni').select('*').order('created_at', { ascending: false });
    setAlumniList(data || []);
  };

  // 通用上传逻辑
  const uploadFile = async (file, bucket) => {
    if (!file) return '';
    const fileName = `${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from(bucket).upload(fileName, file);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleNewsPublish = async () => {
    if (!newsForm.title || !newsForm.content) return alert('标题和内容必填');
    setLoading(true);
    try {
      const imageUrl = await uploadFile(newsFile, 'news-pics');
      const { error } = await supabase.from('news').insert([{ ...newsForm, image_url: imageUrl }]);
      if (error) throw error;
      alert('新闻发布成功！');
      setNewsForm({ ...newsForm, title: '', summary: '', content: '' });
      setNewsFile(null);
      fetchNews();
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  const handleAlumniPublish = async () => {
    if (!alumniForm.name || !alumniForm.role) return alert('姓名和头衔必填');
    setLoading(true);
    try {
      const avatarUrl = await uploadFile(alumniFile, 'alumni-avatars');
      const { error } = await supabase.from('alumni').insert([{ ...alumniForm, image_url: avatarUrl }]);
      if (error) throw error;
      alert('校友已入驻名人堂！');
      setAlumniForm({ name: '', role: '', quote: '' });
      setAlumniFile(null);
      fetchAlumni();
    } catch (e) { alert(e.message); } finally { setLoading(false); }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('校长，确定要执行此删除操作吗？')) return;
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) { fetchData(); alert('操作成功'); }
  };

  // ===================== UI 组件 =====================

  if (!auth) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-white/5 w-full max-w-sm text-center">
          <div className="text-4xl mb-4">🔑</div>
          <h2 className="text-white text-xl font-bold mb-8 tracking-widest uppercase">BGU Terminal</h2>
          <input
            type="password"
            placeholder="校 长 暗 号"
            className="w-full p-4 rounded-2xl bg-black/50 text-white border border-white/10 focus:border-orange-600 outline-none mb-6 text-center tracking-[0.5em]"
            onChange={(e) => setPwd(e.target.value)}
          />
          <button
            onClick={() => pwd === 'welcome996' && setAuth(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-2xl font-black transition-all transform active:scale-95"
          >
            鉴 权
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6 transition-colors duration-500">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
              DASHBOARD <span className="text-orange-600 text-lg ml-2">v2.1</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">不止哥们大学后台管理</p>
          </div>
          <button onClick={() => setAuth(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-full text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all">Logout</button>
        </header>

        {/* Tab 控制器 */}
        <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-2xl mb-8">
          <button 
            onClick={() => setActiveTab('news')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'news' ? 'bg-white dark:bg-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            📰 校园新闻
          </button>
          <button 
            onClick={() => setActiveTab('alumni')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all ${activeTab === 'alumni' ? 'bg-white dark:bg-slate-800 dark:text-white shadow-sm' : 'text-slate-500'}`}
          >
            🤝 校友名人堂
          </button>
        </div>

        {/* --- 发布表单 --- */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
          {activeTab === 'news' ? (
            <div className="space-y-4">
              <input placeholder="文章标题" className="admin-input" value={newsForm.title} onChange={e => setNewsForm({...newsForm, title: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input placeholder="分类" className="admin-input" value={newsForm.category} onChange={e => setNewsForm({...newsForm, category: e.target.value})} />
                <input placeholder="日期" className="admin-input" value={newsForm.date} onChange={e => setNewsForm({...newsForm, date: e.target.value})} />
              </div>
              <textarea placeholder="摘要（显示在卡片上）" className="admin-input h-24" value={newsForm.summary} onChange={e => setNewsForm({...newsForm, summary: e.target.value})} />
              <textarea placeholder="正文内容" className="admin-input h-48" value={newsForm.content} onChange={e => setNewsForm({...newsForm, content: e.target.value})} />
              <div className="upload-box">
                <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">新闻主图</p>
                <input type="file" onChange={e => setNewsFile(e.target.files[0])} className="text-xs text-slate-500" />
              </div>
              <button onClick={handleNewsPublish} disabled={loading} className="publish-btn">{loading ? '📡 同步轨道...' : '🚀 立即发布新闻'}</button>
            </div>
          ) : (
            <div className="space-y-4">
              <input placeholder="校友姓名" className="admin-input" value={alumniForm.name} onChange={e => setAlumniForm({...alumniForm, name: e.target.value})} />
              <input placeholder="头衔 / 身份" className="admin-input" value={alumniForm.role} onChange={e => setAlumniForm({...alumniForm, role: e.target.value})} />
              <textarea placeholder="校友名言 / 简介" className="admin-input h-32" value={alumniForm.quote} onChange={e => setAlumniForm({...alumniForm, quote: e.target.value})} />
              <div className="upload-box">
                <p className="text-[10px] text-slate-400 font-bold mb-2 uppercase">校友头像</p>
                <input type="file" onChange={e => setAlumniFile(e.target.files[0])} className="text-xs text-slate-500" />
              </div>
              <button onClick={handleAlumniPublish} disabled={loading} className="publish-btn bg-blue-600 hover:bg-blue-500 shadow-blue-600/20">{loading ? '📡 录入档案...' : '✨ 加入名人堂'}</button>
            </div>
          )}
        </div>

        {/* --- 列表管理 --- */}
        <div className="mt-12">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Manage Records</h2>
          <div className="space-y-3">
            {(activeTab === 'news' ? newsList : alumniList).map(item => (
              <div key={item.id} className="flex justify-between items-center p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-orange-200">
                <div>
                  <h3 className="font-bold dark:text-white text-sm">{item.title || item.name}</h3>
                  <p className="text-[10px] opacity-40 dark:text-white uppercase mt-1">{item.category || item.role} • {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <button onClick={() => handleDelete(activeTab === 'news' ? 'news' : 'alumni', item.id)} className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          padding: 1rem;
          border-radius: 1rem;
          border: 1px solid #e2e8f0;
          background: transparent;
          outline: none;
          transition: all 0.3s;
          font-size: 0.875rem;
        }
        .dark .admin-input {
          border-color: #1e293b;
          color: white;
          background: #0f172a;
        }
        .admin-input:focus {
          border-color: #ea580c;
          box-shadow: 0 0 0 2px rgba(234, 88, 12, 0.1);
        }
        .upload-box {
          padding: 1rem;
          border: 2px dashed #e2e8f0;
          border-radius: 1rem;
        }
        .dark .upload-box { border-color: #1e293b; }
        .publish-btn {
          width: 100%;
          padding: 1.25rem;
          background: #ea580c;
          color: white;
          border-radius: 1.25rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s;
          box-shadow: 0 10px 20px -5px rgba(234, 88, 12, 0.3);
        }
        .publish-btn:hover { transform: translateY(-2px); }
        .publish-btn:active { transform: translateY(0); }
      `}</style>
    </div>
  );
}

export default Admin;