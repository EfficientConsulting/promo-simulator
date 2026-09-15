// src/app/page.tsx
'use client';

import { useState } from 'react';
import { calculatePromo } from '@/lib/calculator';
import { AlertTriangle, TrendingUp, CheckCircle, Flame } from 'lucide-react';

export default function Home() {
  const [itemName, setItemName] = useState('Smash Burger');
  const [price, setPrice] = useState<number>(15.00);
  const [cogs, setCogs] = useState<number>(4.50);
  const [normalUnits, setNormalUnits] = useState<number>(100);
  const [discountType, setDiscountType] = useState<'PERCENT' | 'DOLLAR'>('PERCENT');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [isDeliveryApp, setIsDeliveryApp] = useState<boolean>(false);

  const results = calculatePromo({
    itemName,
    price: Number(price) || 0,
    cogs: Number(cogs) || 0,
    normalUnits: Number(normalUnits) || 1,
    discountType,
    discountValue: Number(discountValue) || 0,
    isDeliveryApp,
    commissionRate: 0.30, // standard 30% take-rate
  });

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Restaurant Promo Break-Even Simulator
          </h1>
          <p className="text-slate-600 mt-2 text-sm sm:text-base">
            Find out how many extra orders you must sell before discounting your menu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Controls / Inputs */}
          <div className="md:col-span-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            <h2 className="text-lg font-bold text-slate-800 border-b pb-2">1. Item Economics</h2>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Item Name</label>
              <input 
                type="text" 
                value={itemName} 
                onChange={(e) => setItemName(e.target.value)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Regular Price ($)</label>
                <input 
                  type="number" 
                  step="0.5" 
                  value={price} 
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Plate Cost / COGS ($)</label>
                <input 
                  type="number" 
                  step="0.25" 
                  value={cogs} 
                  onChange={(e) => setCogs(parseFloat(e.target.value) || 0)} 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Baseline Volume (e.g. Orders/Week)</label>
              <input 
                type="number" 
                value={normalUnits} 
                onChange={(e) => setNormalUnits(parseInt(e.target.value) || 1)} 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              />
            </div>

            <h2 className="text-lg font-bold text-slate-800 border-b pb-2 pt-2">2. Promotion Details</h2>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Discount Amount</label>
              <div className="flex gap-2">
                <input 
                  type="number" 
                  value={discountValue} 
                  onChange={(e) => setDiscountValue(parseFloat(e.target.value) || 0)} 
                  className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                />
                <button 
                  type="button" 
                  onClick={() => setDiscountType(discountType === 'PERCENT' ? 'DOLLAR' : 'PERCENT')}
                  className="px-4 py-2 border bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm"
                >
                  {discountType === 'PERCENT' ? '% Off' : '$ Off'}
                </button>
              </div>
            </div>

            {/* Delivery Toggle */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-sm font-semibold text-slate-800 block">3rd-Party Delivery App</span>
                <span className="text-xs text-slate-500">Deduct standard 30% take-rate</span>
              </div>
              <input 
                type="checkbox" 
                checked={isDeliveryApp} 
                onChange={(e) => setIsDeliveryApp(e.target.checked)} 
                className="w-5 h-5 accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Results Output Card */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Break-Even Requirement</h2>

              {results.isUnderwater ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <Flame className="w-5 h-5 text-red-600" /> Margin Wiped Out!
                  </div>
                  <p className="text-sm">
                    This discount sets your revenue lower than your food cost. You will lose money on every unit sold regardless of volume.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-5xl font-extrabold text-slate-900">{results.breakEvenUnits}</span>
                    <span className="text-slate-500 font-medium">orders required</span>
                  </div>

                  <p className="text-sm text-slate-600 mb-6">
                    You need <strong className="text-slate-900">+{results.additionalUnitsNeeded} orders</strong> (a <strong className="text-slate-900">+{results.volumeLiftPct}%</strong> volume lift) just to make your baseline profit of <strong>${results.baselineGrossProfit.toFixed(0)}</strong>.
                  </p>

                  {/* Risk Badge */}
                  <div className={`p-4 rounded-xl border flex items-center gap-3 ${
                    results.riskLevel === 'LOW' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                      : results.riskLevel === 'MEDIUM' 
                      ? 'bg-amber-50 border-amber-200 text-amber-800' 
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}>
                    {results.riskLevel === 'LOW' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                    {results.riskLevel === 'MEDIUM' && <TrendingUp className="w-5 h-5 text-amber-600" />}
                    {results.riskLevel === 'HIGH' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
                    
                    <div className="text-xs">
                      <strong className="block font-bold">
                        {results.riskLevel === 'LOW' && 'Low Execution Risk (<15% lift)'}
                        {results.riskLevel === 'MEDIUM' && 'Moderate Risk (15–35% lift)'}
                        {results.riskLevel === 'HIGH' && 'High Operational Risk (>35% lift)'}
                      </strong>
                      <span>
                        {results.riskLevel === 'HIGH' ? 'Kitchen station bottlenecks could break customer experience.' : 'Easily achievable within regular operating capacity.'}
                      </span>
                    </div>
                  </div>

                  {/* Per-Plate Margin Breakdown */}
                  <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase">Baseline Profit/Plate</span>
                      <span className="text-lg font-bold text-slate-700">${results.cm0.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="block text-xs text-slate-400 uppercase">Promo Profit/Plate</span>
                      <span className="text-lg font-bold text-slate-700">${results.cm1.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Soft Beta Signup Footer */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-300">Don't want to type your menu manually?</p>
                <p className="text-sm font-semibold">Join the Toast / Square integration beta</p>
              </div>
              <button 
                onClick={() => alert("Enter your email flow or Typeform link here!")}
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                Join Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}