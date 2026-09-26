import React from 'react';
import { ShoppingBag, Heart, Code2, Database, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900">Shoppy</span>
            </div>
            <p className="text-sm text-slate-500">
              A minimalist, complete learning e-commerce platform designed to master full-stack web development.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Architecture</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" /> React 18 + Vite + Tailwind
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-500" /> Node.js Express REST API
              </li>
              <li className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" /> PostgreSQL + Prisma ORM
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> JWT Auth with Refresh Tokens
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Core Workstreams</h4>
            <ul className="space-y-1.5 text-sm text-slate-500">
              <li>00 · Scaffolding & Tooling</li>
              <li>01 · Relational Prisma Schema</li>
              <li>02 · Auth API (JWT + bcrypt)</li>
              <li>03 · Auth Frontend & State</li>
              <li>04 · Catalog Search & Filtering</li>
              <li>05 · Persistent Cart & Checkout</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Demo Accounts</h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
              <p>
                <span className="font-semibold text-slate-800">Admin:</span> admin@shoppy.local
              </p>
              <p>
                <span className="font-semibold text-slate-800">Password:</span> admin123
              </p>
              <div className="border-t border-slate-200 pt-1 mt-1">
                <p>
                  <span className="font-semibold text-slate-800">Customer:</span> user@shoppy.local
                </p>
                <p>
                  <span className="font-semibold text-slate-800">Password:</span> user123
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Shoppy — Open Source Educational E-Commerce. MIT License.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Built for pair programming & learning full-stack mastery
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
