// Site-wide JS: theme toggle, nav, and simple helpers
document.addEventListener('DOMContentLoaded', ()=>{
  // Theme persisted toggle - defaults to dark mode
  const theme = localStorage.getItem('site-theme') || 'dark'
  document.documentElement.setAttribute('data-theme', theme)

  const toggles = document.querySelectorAll('[data-toggle-theme]')
  toggles.forEach(t=>t.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme')
    const next = current==='dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('site-theme', next)
  }))

  // Also support buttons with class .dark-mode-toggle
  const updateThemeButton = () => {
    const current = document.documentElement.getAttribute('data-theme')
    const themeText = current === 'dark' ? 'Dark' : 'Light'
    document.querySelectorAll('.dark-mode-toggle').forEach(btn => {
      btn.textContent = `Theme: ${themeText}`
    })
  }
  
  updateThemeButton() // Set initial text
  
  document.querySelectorAll('.dark-mode-toggle').forEach(btn=>btn.addEventListener('click', ()=>{
    const current = document.documentElement.getAttribute('data-theme')
    const next = current==='dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('site-theme', next)
    updateThemeButton() // Update button text after theme change
  }))

  // Simple mobile nav toggle
  const navBtn = document.querySelector('.nav-toggle')
  const navLinks = document.querySelector('.nav-links')
  if(navBtn){
    navBtn.addEventListener('click', ()=>{
      navLinks.classList.toggle('open')
    })
  }

  // Close mobile nav on link click and set active link
  document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click', ()=>{
      if(navLinks && navLinks.classList.contains('open')) navLinks.classList.remove('open')
    })
  })

  // Highlight active navigation item based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href')
    if(href && href.indexOf(currentPath) !== -1) a.classList.add('active')
  })

  // Resume image modal functionality
  const resumeModal = document.getElementById('resumeModal')
  const resumeModalImg = document.getElementById('resumeModalImg')
  const resumePreviewImg = document.querySelector('.resume-preview-img')
  const resumeModalClose = document.querySelector('.resume-modal-close')
  
  if (resumePreviewImg && resumeModal && resumeModalImg) {
    resumePreviewImg.addEventListener('click', () => {
      resumeModal.style.display = 'block'
      resumeModalImg.src = resumePreviewImg.src
      resumeModalImg.alt = resumePreviewImg.alt
      document.body.style.overflow = 'hidden' // Prevent background scrolling
    })
    
    if (resumeModalClose) {
      resumeModalClose.addEventListener('click', () => {
        resumeModal.style.display = 'none'
        document.body.style.overflow = 'auto'
      })
    }
    
    // Close modal when clicking outside the image
    resumeModal.addEventListener('click', (e) => {
      if (e.target === resumeModal) {
        resumeModal.style.display = 'none'
        document.body.style.overflow = 'auto'
      }
    })
    
    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && resumeModal.style.display === 'block') {
        resumeModal.style.display = 'none'
        document.body.style.overflow = 'auto'
      }
    })
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute('href'))
      if(target) target.scrollIntoView({behavior:'smooth'})
    })
  })

  // Add hover effect to feature cards
  document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-10px) scale(1.02)'
    })
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0) scale(1)'
    })
  })

  // Animate elements on scroll
  const observerOptions = {threshold:0.1}
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1'
        entry.target.style.transform = 'translateY(0)'
      }
    })
  }, observerOptions)

  document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card)
  })
})

/* --- Game utility: simple memory match --- */
function initMemoryGame(containerSelector, pairs=8){
  const container = document.querySelector(containerSelector)
  if(!container) return
  const values = []
  for(let i=1;i<=pairs;i++){values.push(i);values.push(i)}
  // shuffle
  values.sort(()=>Math.random()-0.5)

  let first=null, second=null, lock=false, matched=0

  container.innerHTML = ''
  values.forEach((v,idx)=>{
    const tile = document.createElement('div')
    tile.className='card-tile'
    tile.dataset.value = v
    tile.textContent = ''
    tile.addEventListener('click', ()=>{
      if(lock || tile===first || tile.classList.contains('matched')) return
      tile.style.background = '#fff'
      tile.textContent = v
      if(!first){ first = tile; return }
      second = tile
      if(first.dataset.value === second.dataset.value){
        first.classList.add('matched'); second.classList.add('matched')
        matched += 2; first=null; second=null
        if(matched === values.length){
          setTimeout(()=>alert('Congratulations! You matched all tiles.'),200)
        }
      } else {
        lock = true
        setTimeout(()=>{
          first.style.background = '#e6eef8'
          second.style.background = '#e6eef8'
          first.textContent = ''
          second.textContent = ''
          first=null; second=null; lock=false
        },700)
      }
    })
    container.appendChild(tile)
  })
}
