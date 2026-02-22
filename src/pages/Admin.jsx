import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);
  const [newsList, setNewsList] = useState([]); // 用于管理已发布的新闻

  const [form, setForm] = useState({
    title: '',
    category: 'Campus',
    summary: '',
    content: '',
    author: 'SUZUMIYA',
    date: new Date().toISOString().slice(0, 10),
  });

  const [file, setFile] = useState(null);

  // 1. 登录成功后拉取列表
  useEffect(() => {
    if (auth) {
      fetchNews();
    }
  }, [auth]);

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });
    setNewsList(data || []);
  };

  // 2. 删除（撤回）逻辑
  const handleDelete = async (id) => {
    if (!window.confirm('校长，确定要从校报中撤回这条稿件吗？')) return;
    
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) {
      alert('撤回失败：' + error.message);
    } else {
      alert('稿件已成功撤回。');
      fetchNews(); // 刷新列表
    }
  };

  // 3. 发布逻辑
  const handlePublish = async () => {
    if (!form.title || !form.content) {
      alert('校长，标题和内容是必填的。');
      return;
    }
    setLoading(true);

    try {
      let publicUrl = '';

      // 上传图片
      if (file) {
        const fileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('news-pics')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('news-pics')
          .getPublicUrl(fileName);

        publicUrl = urlData?.publicUrl || '';
      }

      // 写入数据库
      const { error: insertError } = await supabase.from('news').insert([
        {
          ...form,
          image_url: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert('发布成功！BGU 卫星信号已同步。');
      // 清空表单
      setForm({ ...form, title: '', summary: '', content: '' });
      setFile(null);
      fetchNews(); // 更新下方的管理列表
    } catch (e) {
      console.error(e);
      alert(`发布失败：${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  // --- 身份验证界面 ---
  if (!auth) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-700 w-full max-w-sm">
          <h2 className="text-white text-center text-xl font-bold mb-6 italic">BGU Admin Access</h2>
          <input
            type="password"
            placeholder="请输入校长暗号"
            className="w-full p-4 rounded-xl bg-slate-900 text-white border border-slate-600 focus:border-orange-500 outline-none mb-4 transition-all"
            onChange={(e) => setPwd(e.target.value)}
          />
          <button
            onClick={() => pwd === 'welcome996' && setAuth(true)}
            className="w-full bg-orange-600 hover:bg-orange-500 text-white p-4 rounded-xl font-bold transition-colors"
          >
            鉴权并进入
          </button>
        </div>
      </div>
    );
  }

  // --- 主管理界面 ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-20 px-6 transition-colors duration-500">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">校长发报机 <span className="text-orange-600">v2.0</span></h1>
          <button onClick={() => setAuth(false)} className="text-xs opacity-50 hover:opacity-100 dark:text-white">退出登录</button>
        </div>

        {/* 发布表单 */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 space-y-4">
          <input
            placeholder="文章标题"
            className="w-full p-4 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="分类 (Campus/Global)"
              className="p-4 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <input
              placeholder="日期"
              className="p-4 rounded-xl border dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <textarea
            placeholder="摘要（可选，显示在列表页）"
            className="w-full p-4 rounded-xl border h-24 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />

          <textarea
            placeholder="正文内容"
            className="w-full p-4 rounded-xl border h-64 dark:bg-slate-800 dark:border-slate-700 dark:text-white outline-none"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />

          <div className="p-4 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <p className="text-xs text-slate-400 mb-2 uppercase font-bold">新闻配图</p>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>

          <button
            onClick={handlePublish}
            disabled={loading}
            className="w-full bg-orange-600 p-5 rounded-2xl font-black text-white hover:bg-orange-500 disabled:opacity-50 transition-all shadow-lg shadow-orange-600/20"
          >
            {loading ? '📡 正在同步卫星轨道...' : '🚀 立即全球发布'}
          </button>
        </div>

        {/* 稿件管理 */}
        <div className="mt-16">
          <h2 className="text-xl font-bold mb-6 dark:text-white flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            已发布稿件管理
          </h2>
          <div className="space-y-3">
            {newsList.map(item => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm group hover:border-red-200 dark:hover:border-red-900/50 transition-all">
                <div className="flex flex-col">
                  <span className="font-bold dark:text-white truncate max-w-[200px] md:max-w-md">{item.title}</span>
                  <span className="text-[10px] opacity-40 dark:text-white uppercase font-mono">{new Date(item.created_at).toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-50 dark:bg-red-900/20 text-red-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter hover:bg-red-600 hover:text-white transition-all"
                >
                  撤回
                </button>
              </div>
            ))}
            {newsList.length === 0 && <p className="text-center text-slate-400 py-10">暂无发布记录</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;