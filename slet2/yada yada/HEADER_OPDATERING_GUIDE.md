# HEADER TEMPLATE - Brug denne i alle HTML filer

## HTML Header (i <body>):

```html
<header>
  <nav class="menu-bar" id="menuBar">
    <a href="index.html">Forside</a>
    <div class="dropdown" id="dashboardDropdown" style="position: relative; display: none;">
      <a href="dashboard.html" style="display: flex; align-items: center; gap: 0.3rem;">
        Dashboard
        <span style="font-size: 0.7rem;">▼</span>
      </a>
      <div class="dropdown-content" style="display: none; position: absolute; top: 100%; left: 0; background: white; min-width: 200px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius: 8px; margin-top: 0.5rem; z-index: 1000;">
        <a href="kampe.html" style="color: var(--text-dark); padding: 0.75rem 1rem; display: block; border-bottom: 1px solid var(--border-gray);">⚽ Gæt på kampe</a>
        <a href="#" style="color: var(--text-light); padding: 0.75rem 1rem; display: block; cursor: not-allowed;">👥 Gæt på tilskuertal (kommer snart)</a>
      </div>
    </div>
    <a href="leaderboard.html" id="leaderboardLink" style="display: none;">Leaderboard</a>
    <a href="2Contact.html">Kontakt</a>
    
    <!-- Login/Logout button -->
    <a href="gaet_login.html" id="loginBtn" style="background-color: var(--success-green); margin-left: auto;">Log ind</a>
    <a href="#" id="logoutBtn" onclick="logout(); return false;" style="background-color: var(--error-red); margin-left: auto; display: none;">Log ud</a>
  </nav>
</header>
```

## JavaScript (før </body>):

```javascript
<script>
// Logout function
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}

// Dropdown functionality
const dashboardDropdown = document.getElementById("dashboardDropdown");
if (dashboardDropdown) {
  const dropdownLink = dashboardDropdown.querySelector("a");
  const dropdownContent = dashboardDropdown.querySelector(".dropdown-content");
  
  dropdownLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isVisible = dropdownContent.style.display === "block";
    dropdownContent.style.display = isVisible ? "none" : "block";
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dashboardDropdown.contains(e.target)) {
      dropdownContent.style.display = "none";
    }
  });
}

const ADMIN_EMAIL = "p.h.trampedach@gmail.com";

firebase.auth().onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardDropdown = document.getElementById("dashboardDropdown");
  const leaderboardLink = document.getElementById("leaderboardLink");

  if (user) {
    // User is logged in
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    dashboardDropdown.style.display = "block";
    leaderboardLink.style.display = "block";

    // Add admin link if admin
    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      const menuBar = document.getElementById("menuBar");
      const exists = Array.from(menuBar.children).some(a => a.href && a.href.includes("admin.html"));
      if (!exists) {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.textContent = "Admin";
        menuBar.insertBefore(adminLink, logoutBtn);
      }
    }
  } else {
    // User is NOT logged in
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    dashboardDropdown.style.display = "none";
    leaderboardLink.style.display = "none";
  }

  // Set active page
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".menu-bar a");
  links.forEach(a => {
    if (a.href) {
      const linkPage = a.href.split("/").pop();
      if (linkPage === currentPage) a.classList.add("active");
      else a.classList.remove("active");
    }
  });
});
</script>
```

## Filer der skal opdateres:
- [x] index_new.html (DONE)
- [ ] dashboard_new.html
- [ ] 2Contact_new.html
- [ ] kampe_fixed.html
- [ ] leaderboard_v2.html
- [ ] admin_fixed.html

## Husk:
1. Erstat hele <header> sektionen
2. Tilføj logout() funktionen og auth logic før </body>
3. Sørg for Firebase auth er initialiseret først
