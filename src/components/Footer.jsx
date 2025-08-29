import React from 'react'

export default function Footer(){
  return (
    <footer>
      <div className="container">
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>
            <strong>Nadan Ruchi</strong><br/>
            Traditional Kerala Special • Qatar<br/>
            Al Wakrah, Doha • Hotline: +974 5555 5555
          </div>
          <div className="muted">© {new Date().getFullYear()} Nadan Ruchi. Prices in Qatari Riyals (QR).</div>
        </div>
      </div>
    </footer>
  )
}
