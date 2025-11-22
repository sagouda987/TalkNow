import React, { useEffect, useState } from "react";

export default function App() {
  useEffect(() => {
    const s = document.createElement('style');
    s.textContent = `:root{--color-primary:#0d47a1;--color-background:#0a0a0a;--color-surface:#111827;--color-surface-dark:#0a1118;--color-text:#e5e7eb;--color-text-secondary:#9ca3af;--color-border:rgba(255,255,255,0.06)} body{margin:0;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:var(--color-background);color:var(--color-text)} .container{max-width:1100px;margin:0 auto;padding:20px} .modal{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.5)} input,select{background:var(--color-surface-dark);color:var(--color-text);border:1px solid var(--color-border);padding:8px;border-radius:8px}`;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  const [rooms, setRooms] = useState([]);
  const [user, setUser] = useState(() => {
    const id = localStorage.getItem('ft_user_id');
    const name = localStorage.getItem('ft_user_name');
    return id && name ? {id,name} : null;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({topic:'', language:'English', maxPeople:'4', level:'Intermediate'});

  useEffect(() => {
    const saved = localStorage.getItem('free4talk_rooms');
    if (saved) {
      try { setRooms(JSON.parse(saved)); } catch(e){ setRooms([]); }
    } else {
      const initial = [
        {id:'room-1', topic:'Technology Talk', maxPeople:'5', currentPeople:3, language:'English', level:'Intermediate'},
        {id:'room-2', topic:'Daily Conversation', maxPeople:'2', currentPeople:1, language:'English', level:'Beginner'}
      ];
      setRooms(initial);
      localStorage.setItem('free4talk_rooms', JSON.stringify(initial));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('free4talk_rooms', JSON.stringify(rooms));
  }, [rooms]);

  function signIn(name) {
    const id = `user-${Date.now()}`;
    localStorage.setItem('ft_user_id', id);
    localStorage.setItem('ft_user_name', name);
    setUser({id,name});
  }

  function createRoom(e){
    e.preventDefault();
    if(!user) return setModalOpen(false) || alert('Sign in first');
    const r = { id:`room-${Date.now()}`, topic: form.topic || 'General Discussion', maxPeople: form.maxPeople, currentPeople:0, language: form.language, level: form.level, createdAt: Date.now() };
    setRooms(prev=>[r,...prev]);
    setModalOpen(false);
  }

  return (
    <div className="container">
      <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
        <div>
          <h1 style={{margin:0}}>🗣️ Language Practice Community</h1>
          <div style={{color:'#9ca3af'}}>Practice speaking online — demo</div>
        </div>
        <div>
          {user ? (<><span style={{marginRight:8}}>Signed in as <strong>{user.name}</strong></span><button onClick={()=>{localStorage.removeItem('ft_user_id');localStorage.removeItem('ft_user_name');setUser(null);}}>Sign out</button></>) : (<button onClick={()=>{const name=prompt('Display name'); if(name) signIn(name);}}>Sign in</button>)}
        </div>
      </header>

      <div style={{marginBottom:12}}>
        <button onClick={()=> setModalOpen(true)}>+ Create New Group</button>
        <button onClick={()=>{ const raw = localStorage.getItem('free4talk_rooms'); if(raw) setRooms(JSON.parse(raw)); alert('🔄 Rooms refreshed'); }}>🔄 Refresh</button>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12}}>
        {rooms.map(r=>(
          <div key={r.id} style={{background:'#111827',padding:12,borderRadius:8}}>
            <div style={{fontWeight:700}}>{r.topic}</div>
            <div style={{marginTop:8}}><small>{r.language} • {r.level}</small></div>
            <div style={{marginTop:8,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'#9ca3af'}}>{r.currentPeople}/{r.maxPeople}</div>
              <button onClick={()=>{ if(!user){alert('Sign in first');return;} setRooms(prev=>prev.map(x=> x.id===r.id?{...x,currentPeople:(Number(x.currentPeople)||0)+1}:x)); alert('Joined (simulated)'); }}>Join</button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal" onClick={()=>setModalOpen(false)}>
          <form onSubmit={createRoom} style={{background:'#111827',padding:16,borderRadius:8,minWidth:320}} onClick={e=>e.stopPropagation()}>
            <h3>Create New Group</h3>
            <div style={{marginTop:8}}>
              <label>Topic</label>
              <input value={form.topic} onChange={e=>setForm({...form,topic:e.target.value})} style={{width:'100%',marginTop:6}} />
            </div>
            <div style={{display:'flex',gap:8,marginTop:8}}>
              <select value={form.maxPeople} onChange={e=>setForm({...form,maxPeople:e.target.value})} style={{flex:1}}>
                <option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="10">10</option><option value="unlimited">Unlimited</option>
              </select>
              <select value={form.language} onChange={e=>setForm({...form,language:e.target.value})} style={{flex:1}}>
                <option>English</option><option>Spanish</option><option>Hindi</option><option>French</option><option>German</option><option>Chinese (Mandarin)</option><option>Japanese</option><option>Korean</option><option>Portuguese</option><option>Russian</option><option>Italian</option><option>Arabic</option><option>Dutch</option><option>Turkish</option><option>Swedish</option><option>Vietnamese</option><option>Polish</option><option>Bengali</option><option>Marathi</option><option>Urdu</option>
              </select>
            </div>
            <div style={{marginTop:8}}>
              <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} style={{width:'100%'}}>
                <option>Beginner</option><option>Upper Beginner</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div style={{marginTop:12,display:'flex',gap:8}}>
              <button type="submit">Create Group</button>
              <button type="button" onClick={()=>setModalOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
