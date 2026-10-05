// All forms -> FormSubmit (AJAX).
const show=(el,ok,msg)=>{el.className='p-4 rounded-lg font-semibold '+(ok?'bg-leaf-50 text-leaf-700 border border-leaf-500':'bg-red-50 text-red-700 border border-red-300');el.textContent=msg};
document.querySelectorAll('form[data-form]').forEach(f=>f.addEventListener('submit',async e=>{
 e.preventDefault();const out=f.querySelector('[data-msg]'),btn=f.querySelector('button[type=submit]');
 if(f.dataset.form==='signup'){
  const pw=f.querySelector('[name=password]');
  if(pw.value!==f.querySelector('[name=confirm]').value)return show(out,false,'Passwords do not match.');
 }
 btn.disabled=true;const oldText=btn.textContent;btn.textContent='Sending…';
 try{const r=await fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}});
  if(r.ok){
   if(f.dataset.form==='contact') show(out,true,'Thanks! Your message was sent. We reply within one working day.');
   else if(f.dataset.form==='newsletter') show(out,true,'You are subscribed. See you Monday.');
   else {
    show(out,true,f.dataset.form==='signup'?'Account created. Redirecting…':'Signed in. Redirecting…');
    setTimeout(()=>location.href='index.html',1200);
   }
   f.reset();
  }else show(out,false,'Could not send. Check the email address and activate FormSubmit (see README).')}
 catch{show(out,false,'Network error. Please try again.')}
 btn.disabled=false;btn.textContent=oldText;
}));
document.querySelectorAll('[data-toggle-pw]').forEach(b=>b.addEventListener('click',()=>{const i=b.previousElementSibling;i.type=i.type==='password'?'text':'password';b.textContent=i.type==='password'?'Show':'Hide'}));
const meter=document.getElementById('pw-meter');
if(meter)document.querySelector('[name=password]').addEventListener('input',e=>{const v=e.target.value;let s=0;if(v.length>=8)s++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^\w]/.test(v))s++;
 meter.style.width=(s*25)+'%';meter.className='h-2 rounded-full transition-all '+['bg-slate-300','bg-red-500','bg-sun-500','bg-leaf-500','bg-leaf-700'][s];document.getElementById('pw-label').textContent=['Enter a password','Weak','Fair','Good','Strong'][s]});
