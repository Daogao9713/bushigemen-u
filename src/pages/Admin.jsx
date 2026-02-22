// src/pages/Admin.jsx
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

function Admin() {
  const [auth, setAuth] = useState(false);
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: '',
    category: 'Global',
    summary: '',
    content: '',
    author: 'Admin',
    date: new Date().toISOString().slice(0, 10), // 2026-02-22
  });

  const [file, setFile] = useState(null);

  if (!auth) {
    return (
      <div className="h-screen bg-slate-900 flex items-center justify-center">
        <input
          type="password"
          placeholder="校长暗号"
          className="p-2 rounded"
          onChange={(e) => setPwd(e.target.value)}
        />
        <button
          onClick={() => pwd === '哥们儿' && setAuth(true)}
          className="ml-2 bg-orange-600 p-2 text-white"
        >
          进入
        </button>
      </div>
    );
  }

  const handlePublish = async () => {
    setLoading(true);

    try {
      let publicUrl = '';

      // 1) 上传图片（如果选择了）
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

      // 2) 写入数据库
      // 你之前用的是 image_url，我保留 image_url 字段（比较常见）
      const { error: insertError } = await supabase.from('news').insert([
        {
          ...form,
          image_url: publicUrl,
        },
      ]);

      if (insertError) throw insertError;

      alert('发布成功！去新闻列表看看吧');
      window.location.href = '/news';
    } catch (e) {
      console.error(e);
      alert(`发布失败：${e.message || e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 max-w-xl mx-auto dark:text-white">
      <h1 className="text-2xl font-bold mb-4">校长发报机</h1>

      <input
        placeholder="标题"
        className="w-full mb-4 p-2 border dark:bg-slate-800"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="分类 (Global / Campus / ...)"
        className="w-full mb-4 p-2 border dark:bg-slate-800"
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      />

      <input
        placeholder="作者"
        className="w-full mb-4 p-2 border dark:bg-slate-800"
        value={form.author}
        onChange={(e) => setForm({ ...form, author: e.target.value })}
      />

      <input
        placeholder="日期 2026-02-22"
        className="w-full mb-4 p-2 border dark:bg-slate-800"
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <textarea
        placeholder="摘要（可选）"
        className="w-full mb-4 p-2 border h-20 dark:bg-slate-800"
        value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
      />

      <textarea
        placeholder="内容"
        className="w-full mb-4 p-2 border h-40 dark:bg-slate-800"
        value={form.content}
        onChange={(e) => setForm({ ...form, content: e.target.value })}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handlePublish}
        disabled={loading}
        className="w-full bg-orange-600 p-4 font-bold text-white disabled:opacity-60"
      >
        {loading ? '同步到全球中...' : '立即发布'}
      </button>
    </div>
  );
}

export default Admin;