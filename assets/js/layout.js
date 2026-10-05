// Shared navbar + footer so every page stays identical.
const links=[['index.html','Home'],['about.html','About'],['contact.html','Contact']];
const here=location.pathname.split('/').pop()||'index.html';
const nav=`<header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-leaf-100">
<nav class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between" aria-label="Main">
<a href="index.html" class="flex items-center gap-2 font-display text-xl font-bold text-leaf-700"><img src="assets/img/favicon.svg" alt="" class="w-8 h-8">Seedling</a>
<ul class="hidden md:flex items-center gap-8">${links.map(([h,t])=>`<li><a href="${h}" class="font-semibold ${h===here?'text-leaf-600 border-b-2 border-sun-400':'text-slate-600 hover:text-leaf-600'} pb-1">${t}</a></li>`).join('')}</ul>
<div class="hidden md:flex gap-3"><a href="signin.html" class="px-4 py-2 rounded-lg font-semibold text-leaf-700 hover:bg-leaf-50">Sign in</a><a href="signup.html" class="px-4 py-2 rounded-lg font-semibold bg-leaf-700 text-white hover:bg-leaf-600">Sign up</a></div>
<button id="menu-btn" class="md:hidden p-2 rounded-lg hover:bg-leaf-50" aria-label="Toggle menu" aria-expanded="false"><svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16"/></svg></button></nav>
<div id="mobile-menu" class="hidden md:hidden border-t border-leaf-100 px-4 pb-4 pt-2 space-y-1">${[...links,['signin.html','Sign in'],['signup.html','Sign up']].map(([h,t])=>`<a href="${h}" class="block px-3 py-2 rounded-lg font-semibold ${h===here?'bg-leaf-50 text-leaf-700':'text-slate-700 hover:bg-leaf-50'}">${t}</a>`).join('')}</div></header>`;
const foot=`<footer class="bg-leaf-900 text-leaf-100 mt-20"><div class="max-w-6xl mx-auto px-4 py-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
<div class="lg:col-span-2"><p class="font-display text-xl font-bold text-white flex items-center gap-2"><img src="assets/img/favicon.svg" alt="" class="w-7 h-7">Seedling</p><p class="mt-3 max-w-sm text-leaf-100/80">A garden planner that tells you what to sow, water and harvest, week by week.</p></div>
<div><h2 class="font-display font-semibold text-white mb-3">Explore</h2><ul class="space-y-2">${links.map(([h,t])=>`<li><a class="hover:text-sun-400" href="${h}">${t}</a></li>`).join('')}</ul></div>
<div><h2 class="font-display font-semibold text-white mb-3">Account</h2><ul class="space-y-2"><li><a class="hover:text-sun-400" href="signin.html">Sign in</a></li><li><a class="hover:text-sun-400" href="signup.html">Create account</a></li></ul></div></div>
<div class="border-t border-white/10 py-5 text-center text-sm text-leaf-100/70">© <span id="yr"></span> Seedling Garden Co. All rights reserved.</div></footer>`;
document.getElementById('site-nav').innerHTML=nav;document.getElementById('site-footer').innerHTML=foot;
document.getElementById('yr').textContent=new Date().getFullYear();
const b=document.getElementById('menu-btn'),m=document.getElementById('mobile-menu');
b.addEventListener('click',()=>{m.classList.toggle('hidden');b.setAttribute('aria-expanded',!m.classList.contains('hidden'))});
