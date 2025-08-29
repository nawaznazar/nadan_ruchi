import React, { useMemo, useState } from 'react'
import { MENU } from '../data/menu.js'
import { useAuth } from '../context/AuthContext.jsx'

const STORAGE_KEY = 'nr_admin_menu'

function useAdminMenu(){
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : MENU
  })
  const persist = (next) => { setItems(next); localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) }
  const upsert = (item) => {
    const idx = items.findIndex(x => x.id === item.id)
    if (idx >= 0) persist(items.map((x,i)=> i===idx ? item : x))
    else persist([...items, item])
  }
  const del = (id) => persist(items.filter(x => x.id !== id))
  return { items, upsert, del }
}

export default function AdminDashboard(){
  const { user } = useAuth()
  const { items, upsert, del } = useAdminMenu()
  const [q, setQ] = useState('')
  const filtered = useMemo(()=> items.filter(i=> !q || i.name.toLowerCase().includes(q.toLowerCase())),[items,q])

  const [form, setForm] = useState({ id:'', name:'', category:'Breakfast', price:0, veg:true, spicy:0, img:'', desc:'' })
  const onSubmit = (e) => {
    e.preventDefault()
    if (!form.id) return alert('Please provide a unique id (e.g., appam-stew)')
    upsert({ ...form, price: Number(form.price) })
    setForm({ id:'', name:'', category:'Breakfast', price:0, veg:true, spicy:0, img:'', desc:'' })
  }

  if (user?.role !== 'admin') return null

  return (
    <div className="container">
      <h2>Admin — Manage Menu</h2>
      <div className="row">
        <input placeholder="Search items…" value={q} onChange={e=>setQ(e.target.value)} />
      </div>
      <div className="spacer"></div>
      <div className="grid">
        {filtered.map(i => (
          <div key={i.id} className="card">
            <strong>{i.name}</strong>
            <div className="muted">{i.category} • {i.veg ? 'Veg' : 'Non-veg'}</div>
            <div className="row" style={{marginTop:'.4rem'}}>
              <button className="btn outline" onClick={()=>setForm(i)}>Edit</button>
              <button className="btn outline" onClick={()=>del(i.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="spacer"></div>
      <div className="card">
        <h3>{form.id ? 'Edit Item' : 'Add Item'}</h3>
        <form onSubmit={onSubmit}>
          <div className="grid" style={{gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))'}}>
            <label>ID<br/><input value={form.id} onChange={e=>setForm({...form, id:e.target.value})} placeholder="unique-id" required/></label>
            <label>Name<br/><input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/></label>
            <label>Category<br/>
              <select value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                <option>Breakfast</option><option>Lunch</option><option>Evening Snacks</option><option>Dinner</option>
              </select>
            </label>
            <label>Price (QR)<br/><input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form, price:e.target.value})} required/></label>
            <label>Veg?<br/>
              <select value={form.veg ? 'true':'false'} onChange={e=>setForm({...form, veg:e.target.value==='true'})}>
                <option value="true">Veg</option><option value="false">Non-veg</option>
              </select>
            </label>
            <label>Spicy (0-2)<br/><input type="number" min="0" max="2" value={form.spicy} onChange={e=>setForm({...form, spicy:Number(e.target.value)})}/></label>
            <label>Image URL<br/><input value={form.img} onChange={e=>setForm({...form, img:e.target.value})} placeholder="/img/appam.jpg"/></label>
            <label>Description<br/><input value={form.desc} onChange={e=>setForm({...form, desc:e.target.value})} /></label>
          </div>
          <div className="spacer"></div>
          <button className="btn" type="submit">{form.id ? 'Save' : 'Add'}</button>
        </form>
      </div>
    </div>
  )
}
