import React from 'react';
import { Link } from 'react-router-dom';
import { newsData } from '../data/newsData';

function NewsArchive() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-20 px-6 transition-colors duration-500">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center" data-aos="fade-down">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4 italic">Campus Gazette</h1>
          <p className="text-slate-500 dark:text-slate-400">“不止哥们大学”官方校报全集</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news) => (
            <Link key={news.id} to={`/news/${news.id}`} className="block group">
              <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                <div className="h-48 overflow-hidden relative">
                  <img src={news.image} alt={news.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute top-4 left-4 ${news.tagColor} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase`}>
                    {news.category}
                  </div>
                </div>
                <div className="p-6 flex-grow flex flex-col">
                  <div className="text-[10px] font-mono text-slate-400 mb-2">{news.date}</div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                    {news.title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{news.summary}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsArchive;