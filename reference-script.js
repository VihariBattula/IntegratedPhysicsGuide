// Date
const d = new Date();
const dateDisplay = document.getElementById('dateDisplay');
if (dateDisplay) {
  dateDisplay.textContent = d.toISOString().split('T')[0];
}

// Reveal Logic
function toggleOne(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = (el.style.display === 'block') ? 'none' : 'block';
  }
}

// Toggle Sidebar Groups
function toggleGroup(headerBtn) {
  const group = headerBtn.parentElement;
  if (group) group.classList.toggle('collapsed');
}

// Toggle Sidebar (Mobile)
function toggleSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const header = document.querySelector('.header');
  if (sidebar && header) {
    sidebar.classList.toggle('mobile-open');
    header.classList.toggle('menu-open');
  }
}

// Navigation Logic
function navigateTo(sectionId, subLinkId = null) {
  // Close mobile sidebar if open
  const sidebar = document.querySelector('.sidebar');
  const header = document.querySelector('.header');
  if (sidebar) sidebar.classList.remove('mobile-open');
  if (header) header.classList.remove('menu-open');

  // 1. Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(sec => sec.classList.remove('active'));

  // 2. Show target section
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
  }

  // 3. Update Sidebar Active State
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => item.classList.remove('active'));
  const activeNav = document.getElementById('nav-' + sectionId);
  if (activeNav) activeNav.classList.add('active');

  // 4. Ensure parent group is expanded
  if (activeNav) {
    let parent = activeNav.parentElement;
    while (parent && !parent.classList.contains('sidebar')) {
      if (parent.classList.contains('nav-group')) {
        parent.classList.remove('collapsed');
      }
      parent = parent.parentElement;
    }
  }

  // 5. Scroll handling
  const mainScroll = document.getElementById('main-scroll');

  if (subLinkId) {
    setTimeout(() => {
      const subTarget = document.getElementById(subLinkId);
      if (subTarget) subTarget.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  } else {
    if (mainScroll) {
      mainScroll.scrollTop = 0;
    }
  }
}

// Export functions to global scope
window.toggleOne = toggleOne;
window.toggleGroup = toggleGroup;
window.navigateTo = navigateTo;
window.toggleSidebar = toggleSidebar;
