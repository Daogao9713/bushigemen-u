import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [activeTab, setActiveTab] = useState('news'); // 'news' | 'alumni' | 'broadcast'

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

  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [broadcastActive, setBroadcastActive] = useState(false);

  useEffect(() => {
    if (auth) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, activeTab]);

  const fetchData = () => {
    if (activeTab === 'news') fetchNews();
    else if (activeTab === 'alumni') fetchAlumni();
    else fetchBroadcast();
  };

  const fetchNews = async () => {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    setNewsList(data || []);
  };

  const fetchAlumni = async () => {
    const { data, error } = await supabase
      .from('alumni')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error(error);
    setAlumniList(data || []);
  };

  // ✅ 彻底避免 406：id=1 不存在时，single() 会 406；maybeSingle() 不会
  const fetchBroadcast = async () => {
    const { data, error } = await supabase
      .from('broadcast')
      .select('*')
      .eq('id', 1)
      .maybeSingle();

    if (error) {
      console.error('[fetchBroadcast] error:', error);
      return;
    }

    if (data) {
      setBroadcastMsg(data.message || '');
      setBroadcastActive(!!data.is_active);
    } else {
      // 没有 id=1 这一行时，不报错、不 406，只保持默认 UI 状态
      setBroadcastMsg('');
      setBroadcastActive(false);
    }
  };

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
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
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
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ 按你要求：严格替换为“纯净字段 payload”的版本（只传 message / is_active）
  const handleBroadcast = async (status) => {
    setLoading(true);
    try {
      // 🚨 绝对纯净的 Payload，只包含数据库有的字段
      const { error } = await supabase
        .from('broadcast')
        .update({
          message: broadcastMsg,
          is_active: status,
        })
        .eq('id', 1);

      if (error) throw error;

      setBroadcastActive(status);
      alert(status ? '🚨 第一圣战体制已开启' : '✅ 警报解除');
    } catch (e) {
      console.error(e);
      alert('发送失败: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!window.confirm('校长，确定要执行此删除操作吗？')) return;

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (!error) {
      fetchData();
      alert('操作成功');
    } else {
      console.error(error);
      alert(error.message);
    }
  };

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
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              Dashboard <span className="text-orange-600 text-lg ml-2">v2.5</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold font-mono">
              NERV ACCESS GRANTED
            </p>
          </div>
          <button
            onClick={() => setAuth(false)}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 dark:text-white rounded-full text-[10px] font-bold uppercase hover:bg-red-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </header>

        <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-2xl mb-8 gap-1">
          {['news', 'alumni', 'broadcast'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 rounded-xl text-[10px] md:text-sm font-black transition-all uppercase ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              {tab === 'news' ? '📰 News' : tab === 'alumni' ? '🤝 Alumni' : '📢 Command'}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl border border-slate-100 dark:border-slate-800">
          {activeTab === 'news' && (
            <div className="space-y-4">
              <input
                placeholder="文章标题"
                className="admin-input"
                value={newsForm.title}
                onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder="分类"
                  className="admin-input"
                  value={newsForm.category}
                  onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                />
                <input
                  placeholder="日期"
                  className="admin-input"
                  value={newsForm.date}
                  onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                />
              </div>
              <textarea
                placeholder="摘要"
                className="admin-input h-24"
                value={newsForm.summary}
                onChange={(e) => setNewsForm({ ...newsForm, summary: e.target.value })}
              />
              <textarea
                placeholder="正文内容"
                className="admin-input h-48"
                value={newsForm.content}
                onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
              />
              <div className="upload-box">
                <input
                  type="file"
                  onChange={(e) => setNewsFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500"
                />
              </div>
              <button onClick={handleNewsPublish} disabled={loading} className="publish-btn">
                {loading ? '📡 同步轨道...' : '🚀 发布新闻'}
              </button>
            </div>
          )}

          {activeTab === 'alumni' && (
            <div className="space-y-4">
              <input
                placeholder="校友姓名"
                className="admin-input"
                value={alumniForm.name}
                onChange={(e) => setAlumniForm({ ...alumniForm, name: e.target.value })}
              />
              <input
                placeholder="头衔 / 身份"
                className="admin-input"
                value={alumniForm.role}
                onChange={(e) => setAlumniForm({ ...alumniForm, role: e.target.value })}
              />
              <textarea
                placeholder="校友名言"
                className="admin-input h-32"
                value={alumniForm.quote}
                onChange={(e) => setAlumniForm({ ...alumniForm, quote: e.target.value })}
              />
              <div className="upload-box">
                <input
                  type="file"
                  onChange={(e) => setAlumniFile(e.target.files?.[0] || null)}
                  className="text-xs text-slate-500"
                />
              </div>
              <button
                onClick={handleAlumniPublish}
                disabled={loading}
                className="publish-btn bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
              >
                {loading ? '📡 录入档案...' : '✨ 加入名人堂'}
              </button>
            </div>
          )}

          {activeTab === 'broadcast' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="font-black text-slate-900 dark:text-white text-sm uppercase italic tracking-widest text-red-600">
                  MAGI System Status
                </h3>
                <span
                  className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    broadcastActive
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {broadcastActive ? 'LEVEL 1: EMERGENCY' : 'STATUS: NORMAL'}
                </span>
              </div>

              <textarea
                placeholder="在此输入最高指令..."
                className="admin-input h-40 font-mono text-red-600 border-red-100 dark:border-red-900/30"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleBroadcast(true)}
                  disabled={loading}
                  className="publish-btn bg-red-600 hover:bg-red-500 shadow-red-600/20"
                >
                  开启警报
                </button>
                <button
                  onClick={() => handleBroadcast(false)}
                  disabled={loading}
                  className="publish-btn bg-slate-800 hover:bg-slate-700 shadow-none"
                >
                  解除指令
                </button>
              </div>
            </div>
          )}
        </div>

        {activeTab !== 'broadcast' && (
          <div className="mt-12 space-y-3">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Manage Records
            </h2>
            {(activeTab === 'news' ? newsList : alumniList).map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all hover:border-orange-200"
              >
                <div>
                  <h3 className="font-bold dark:text-white text-sm">{item.title || item.name}</h3>
                  <p className="text-[9px] opacity-40 dark:text-white uppercase mt-1">
                    {(item.category || item.role) || '-'} •{' '}
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : '-'}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(activeTab === 'news' ? 'news' : 'alumni', item.id)}
                  className="text-red-600 font-black text-[10px] uppercase hover:bg-red-600 hover:text-white px-4 py-2 rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
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
        .dark .upload-box {
          border-color: #1e293b;
        }
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
        .publish-btn:hover {
          transform: translateY(-2px);
        }
        .publish-btn:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}

export default Admin;