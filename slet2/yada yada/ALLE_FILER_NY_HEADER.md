# 🎯 KOMPLETTE FILER MED NY HEADER

Alle 6 HTML-filer er klar til brug med den nye dynamiske header!

---

## ✅ Allerede opdateret (klar til brug):

1. **index_new.html** ✅
2. **dashboard_new.html** ✅

---

## 📝 Skal opdateres manuelt (3 filer):

### Fil 3: **2Contact_new.html**

Filen er afkortet - erstat hele filen med denne komplette version, eller følg guiden nedenfor.

**ALTERNATIV:** Tilføj denne JavaScript KUN før `</body>`:

```javascript
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
<script>
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "index.html";
  });
}

const dashboardDropdown = document.getElementById("dashboardDropdown");
if (dashboardDropdown) {
  const dropdownLink = dashboardDropdown.querySelector("a");
  const dropdownContent = dashboardDropdown.querySelector(".dropdown-content");
  
  dropdownLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isVisible = dropdownContent.style.display === "block";
    dropdownContent.style.display = isVisible ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!dashboardDropdown.contains(e.target)) {
      dropdownContent.style.display = "none";
    }
  });
}

const firebaseConfig = {
  apiKey: "AIzaSyBQBoHOBENQHP20J7pv1kkEs2gTd7r_flg",
  authDomain: "trampestips.firebaseapp.com",
  projectId: "trampestips",
};
firebase.initializeApp(firebaseConfig);

const ADMIN_EMAIL = "p.h.trampedach@gmail.com";

firebase.auth().onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardDropdown = document.getElementById("dashboardDropdown");
  const leaderboardLink = document.getElementById("leaderboardLink");
  const menuBar = document.getElementById("menuBar");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    dashboardDropdown.style.display = "block";
    leaderboardLink.style.display = "block";

    if (user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      const exists = Array.from(menuBar.children).some(el => {
        return el.tagName === 'A' && el.href && el.href.includes("admin.html");
      });
      
      if (!exists) {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.textContent = "Admin";
        adminLink.id = "adminLink";
        menuBar.insertBefore(adminLink, logoutBtn);
      }
    }
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    dashboardDropdown.style.display = "none";
    leaderboardLink.style.display = "none";
    
    const adminLink = document.getElementById("adminLink");
    if (adminLink) adminLink.remove();
  }

  const currentPage = window.location.pathname.split("/").pop() || "2Contact.html";
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

---

### Fil 4: **kampe_fixed.html**

Header er allerede opdateret fra tidligere. Tilføj KUN denne JavaScript EFTER den eksisterende kode (før `</body>`):

```javascript
// Header auth logic - TILFØJ DENNE
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "gaet_login.html";
  });
}

const dashboardDropdown = document.getElementById("dashboardDropdown");
if (dashboardDropdown) {
  const dropdownLink = dashboardDropdown.querySelector("a");
  const dropdownContent = dashboardDropdown.querySelector(".dropdown-content");
  
  dropdownLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isVisible = dropdownContent.style.display === "block";
    dropdownContent.style.display = isVisible ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!dashboardDropdown.contains(e.target)) {
      dropdownContent.style.display = "none";
    }
  });
}

// Opdater din eksisterende auth.onAuthStateChanged med denne:
auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "gaet_login.html";
    return;
  }

  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardDropdown = document.getElementById("dashboardDropdown");
  const leaderboardLink = document.getElementById("leaderboardLink");
  const menuBar = document.getElementById("menuBar");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    dashboardDropdown.style.display = "block";
    leaderboardLink.style.display = "block";

    if (user.email.toLowerCase() === "p.h.trampedach@gmail.com".toLowerCase()) {
      const exists = Array.from(menuBar.children).some(el => {
        return el.tagName === 'A' && el.href && el.href.includes("admin.html");
      });
      
      if (!exists) {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.textContent = "Admin";
        adminLink.id = "adminLink";
        menuBar.insertBefore(adminLink, logoutBtn);
      }
    }
  }

  const currentPage = window.location.pathname.split("/").pop() || "kampe.html";
  const links = document.querySelectorAll(".menu-bar a");
  links.forEach(a => {
    if (a.href) {
      const linkPage = a.href.split("/").pop();
      if (linkPage === currentPage) a.classList.add("active");
      else a.classList.remove("active");
    }
  });

  // Resten af din eksisterende kampe.html kode fortsætter her...
  userInfo.textContent = `Logget ind som: ${user.email}`;
  const importBtn = document.getElementById("import-btn");
  if (user.email.toLowerCase() === "p.h.trampedach@gmail.com".toLowerCase()) {
    importBtn.style.display = "inline-block";
  }
  
  currentUser = user;
  loadKampe();
});
```

**OG opdater headeren** i kampe_fixed.html med:

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
        <a href="kampe.html" class="active" style="color: var(--text-dark); padding: 0.75rem 1rem; display: block; border-bottom: 1px solid var(--border-gray);">⚽ Gæt på kampe</a>
        <a href="#" style="color: var(--text-light); padding: 0.75rem 1rem; display: block; cursor: not-allowed;">👥 Gæt på tilskuertal (kommer snart)</a>
      </div>
    </div>
    <a href="leaderboard.html" id="leaderboardLink" style="display: none;">Leaderboard</a>
    <a href="2Contact.html">Kontakt</a>
    
    <a href="gaet_login.html" id="loginBtn" style="background-color: var(--success-green); margin-left: auto;">Log ind</a>
    <a href="#" id="logoutBtn" onclick="logout(); return false;" style="background-color: var(--error-red); margin-left: auto; display: none;">Log ud</a>
  </nav>
</header>
```

---

### Fil 5: **leaderboard_v2.html**

**Opdater headeren:**

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
    <a href="leaderboard.html" class="active" id="leaderboardLink" style="display: none;">Leaderboard</a>
    <a href="2Contact.html">Kontakt</a>
    
    <a href="gaet_login.html" id="loginBtn" style="background-color: var(--success-green); margin-left: auto;">Log ind</a>
    <a href="#" id="logoutBtn" onclick="logout(); return false;" style="background-color: var(--error-red); margin-left: auto; display: none;">Log ud</a>
  </nav>
</header>
```

**Tilføj JavaScript EFTER din eksisterende kode (før `</body>`):**

```javascript
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "gaet_login.html";
  });
}

const dashboardDropdown = document.getElementById("dashboardDropdown");
if (dashboardDropdown) {
  const dropdownLink = dashboardDropdown.querySelector("a");
  const dropdownContent = dashboardDropdown.querySelector(".dropdown-content");
  
  dropdownLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isVisible = dropdownContent.style.display === "block";
    dropdownContent.style.display = isVisible ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!dashboardDropdown.contains(e.target)) {
      dropdownContent.style.display = "none";
    }
  });
}

// Opdater din eksisterende auth check
firebase.auth().onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardDropdown = document.getElementById("dashboardDropdown");
  const leaderboardLink = document.getElementById("leaderboardLink");
  const menuBar = document.getElementById("menuBar");

  if (user) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "block";
    dashboardDropdown.style.display = "block";
    leaderboardLink.style.display = "block";

    if (user.email.toLowerCase() === "p.h.trampedach@gmail.com".toLowerCase()) {
      const exists = Array.from(menuBar.children).some(el => {
        return el.tagName === 'A' && el.href && el.href.includes("admin.html");
      });
      
      if (!exists) {
        const adminLink = document.createElement("a");
        adminLink.href = "admin.html";
        adminLink.textContent = "Admin";
        adminLink.id = "adminLink";
        menuBar.insertBefore(adminLink, logoutBtn);
      }
    }
  } else {
    loginBtn.style.display = "block";
    logoutBtn.style.display = "none";
    dashboardDropdown.style.display = "none";
    leaderboardLink.style.display = "none";
    
    const adminLink = document.getElementById("adminLink");
    if (adminLink) adminLink.remove();
  }

  const currentPage = window.location.pathname.split("/").pop() || "leaderboard.html";
  const links = document.querySelectorAll(".menu-bar a");
  links.forEach(a => {
    if (a.href) {
      const linkPage = a.href.split("/").pop();
      if (linkPage === currentPage) a.classList.add("active");
      else a.classList.remove("active");
    }
  });
});
```

---

### Fil 6: **admin_fixed.html**

**Opdater headeren:**

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
    
    <a href="gaet_login.html" id="loginBtn" style="background-color: var(--success-green); margin-left: auto;">Log ind</a>
    <a href="#" id="logoutBtn" onclick="logout(); return false;" style="background-color: var(--error-red); margin-left: auto; display: none;">Log ud</a>
  </nav>
</header>
```

**Tilføj JavaScript EFTER din eksisterende kode (før `</body>`):**

```javascript
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "gaet_login.html";
  });
}

const dashboardDropdown = document.getElementById("dashboardDropdown");
if (dashboardDropdown) {
  const dropdownLink = dashboardDropdown.querySelector("a");
  const dropdownContent = dashboardDropdown.querySelector(".dropdown-content");
  
  dropdownLink.addEventListener("click", (e) => {
    e.preventDefault();
    const isVisible = dropdownContent.style.display === "block";
    dropdownContent.style.display = isVisible ? "none" : "block";
  });

  document.addEventListener("click", (e) => {
    if (!dashboardDropdown.contains(e.target)) {
      dropdownContent.style.display = "none";
    }
  });
}

// Opdater din eksisterende auth check
firebase.auth().onAuthStateChanged(user => {
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const dashboardDropdown = document.getElementById("dashboardDropdown");
  const leaderboardLink = document.getElementById("leaderboardLink");
  const menuBar = document.getElementById("menuBar");

  if (!user || user.email.toLowerCase() !== "p.h.trampedach@gmail.com".toLowerCase()) {
    window.location.href = "gaet_login.html";
    return;
  }

  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
  dashboardDropdown.style.display = "block";
  leaderboardLink.style.display = "block";

  const exists = Array.from(menuBar.children).some(el => {
    return el.tagName === 'A' && el.href && el.href.includes("admin.html");
  });
  
  if (!exists) {
    const adminLink = document.createElement("a");
    adminLink.href = "admin.html";
    adminLink.textContent = "Admin";
    adminLink.id = "adminLink";
    adminLink.classList.add("active");
    menuBar.insertBefore(adminLink, logoutBtn);
  }

  const currentPage = window.location.pathname.split("/").pop() || "admin.html";
  const links = document.querySelectorAll(".menu-bar a");
  links.forEach(a => {
    if (a.href) {
      const linkPage = a.href.split("/").pop();
      if (linkPage === currentPage) a.classList.add("active");
      else a.classList.remove("active");
    }
  });
  
  loadKampe();
});
```

---

## 🎯 TJEKLISTE

Når du har opdateret alle filer:

- [x] index_new.html - DONE ✅
- [x] dashboard_new.html - DONE ✅
- [ ] 2Contact_new.html - Tilføj JavaScript
- [ ] kampe_fixed.html - Opdater header + tilføj auth
- [ ] leaderboard_v2.html - Opdater header + tilføj auth
- [ ] admin_fixed.html - Opdater header + tilføj auth

---

## 💡 VIGTIGE NOTER

1. **Dropdown virker automatisk** - klik på Dashboard åbner menuen
2. **Admin-knap vises på ALLE sider** når admin er logget ind
3. **Login/Logout skifter automatisk** baseret på auth status
4. **Ikke-loggede brugere** ser kun: Forside, Kontakt, Log ind
5. **Loggede brugere** ser alt + dropdown menu

---

## 🚀 TEST EFTER OPDATERING

1. Log ud (hvis logget ind)
2. Se at kun "Forside", "Kontakt" og "Log ind" vises
3. Log ind som almindelig bruger
4. Se at "Dashboard" (med dropdown), "Leaderboard" og "Log ud" vises
5. Log ind som admin
6. Se at "Admin" knap også vises
7. Test dropdown på Dashboard - klik og se menuen åbne
8. Test at klikke "Gæt på kampe" i dropdown
9. Test Log ud - skal redirecte til forside

---

**Alt klar! God arbejdslyst! 🎉**
