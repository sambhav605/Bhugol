export default function MaintenancePage() {
  return (
    <main style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:'2rem', backgroundColor:'#0a0a0a', color:'#fff', fontFamily:'sans-serif' }}>
      <h1 style={{ fontSize:'2rem', fontWeight:600, marginBottom:'1rem' }}>
        🗺️ Bhugol is getting better
      </h1>
      <p style={{ fontSize:'1rem', color:'#aaa', maxWidth:'400px', lineHeight:1.7 }}>
        The Nepal Districts Quiz is currently offline for updates. Check back soon!
      </p>
    </main>
  )
}