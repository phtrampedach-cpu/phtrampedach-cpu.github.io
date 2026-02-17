# 🏆 KOMPLET GUIDE: Turneringer og Kampe

## 📋 Indholdsfortegnelse
1. [Overblik over systemet](#overblik)
2. [Opret nye kampe](#opret-kampe)
3. [Slet enkelte kampe](#slet-kampe)
4. [Opret ny turnering](#opret-turnering)
5. [Afslut en turnering (arkivering)](#afslut-turnering)
6. [Erstat turnering (ny sæson)](#erstat-turnering)
7. [Bevar historiske data](#bevar-data)
8. [Fremtidig funktion: Brugerprofiler med trofæer](#trofaeer)

---

<a name="overblik"></a>
## 🎯 1. Overblik over systemet

### Nuværende turneringer:
- **VM2026** - Verdensmesterskabet 2026
- **Superliga** - Superliga Forår 2026
- **PremierLeague** - Premier League Forår 2026

### Hvor data gemmes:

```
Firebase Firestore struktur:
├── matches (collection)
│   ├── VM1 (document) - tournament: "VM2026"
│   ├── VM2 (document) - tournament: "VM2026"
│   ├── SL1 (document) - tournament: "Superliga"
│   └── PL1 (document) - tournament: "PremierLeague"
│
├── users (collection)
│   └── {userId} (document)
│       └── guesses (subcollection)
│           ├── VM1 (document) - brugerens gæt på VM1
│           └── SL1 (document) - brugerens gæt på SL1
│
└── leaderboards (collection)
    ├── VM2026 (document)
    │   └── users (subcollection)
    │       └── {userId} - points, correctResult, correctOutcome
    ├── Superliga (document)
    └── PremierLeague (document)
```

---

<a name="opret-kampe"></a>
## ➕ 2. Opret nye kampe

### Metode A: Via kode (Anbefalet)

#### Trin 1: Åbn kampe_fixed.html i VS Code

#### Trin 2: Find `importMatches()` funktionen (ca. linje 195)

#### Trin 3: Tilføj dine kampe i `newMatches` arrayet:

```javascript
const newMatches = [
  {
    id: "VM6",                    // Unikt ID
    tournament: "VM2026",         // Turneringsnavn (SKAL matche præcist)
    homeTeam: "Spanien",
    awayTeam: "Italien",
    date: "2025-12-20",          // YYYY-MM-DD format
    time: "18:00",               // HH:MM format (24-timer)
    homeGoals: null,             // Altid null for nye kampe
    awayGoals: null
  },
  // Tilføj flere kampe her...
];
```

#### Trin 4: Gem filen

#### Trin 5: Gå til kampe.html i browseren (logget ind som admin)

#### Trin 6: Klik "📥 Importer alle kampe"

#### Trin 7: Bekræft - kampene tilføjes!

### ⚠️ Vigtige regler:

| Felt | Regel | Eksempel | Forkert eksempel |
|------|-------|----------|------------------|
| **id** | Skal være unikt | "VM6", "SL10" | "VM1" (allerede brugt) |
| **tournament** | Case-sensitive, præcist match | "VM2026" | "vm2026", "VM 2026" |
| **date** | YYYY-MM-DD format | "2026-03-15" | "15-03-2026", "2026/03/15" |
| **time** | HH:MM, 24-timer | "18:00", "09:30" | "6:00 PM", "18:00:00" |
| **homeGoals/awayGoals** | Altid null for nye | null | 0, "" |

### 💡 Pro tips:

1. **Brug konsekvent navngivning:**
   - VM kampe: VM1, VM2, VM3...
   - Superliga: SL1, SL2, SL3...
   - Premier League: PL1, PL2, PL3...

2. **Kopier eksisterende kampe** og ændr værdierne

3. **Tilføj flere kampe på én gang** - mere effektivt

---

<a name="slet-kampe"></a>
## 🗑️ 3. Slet enkelte kampe

### ⚠️ ADVARSEL: Sletning er permanent!

Når du sletter en kamp:
- ❌ Kampen forsvinder fra alle brugere
- ❌ Alle gæt på kampen slettes
- ❌ Point fra kampen fjernes fra leaderboard
- ⚠️ Dette kan IKKE fortrydes!

### Metode: Via Firebase Console

#### Trin 1: Gå til [Firebase Console](https://console.firebase.google.com/)

#### Trin 2: Vælg **trampestips** projektet

#### Trin 3: Klik **Firestore Database** → **Data**

#### Trin 4: Find **matches** collection

#### Trin 5: Find kampen du vil slette (f.eks. VM3)

#### Trin 6: Klik på de tre prikker ⋮ ved siden af kampen

#### Trin 7: Klik **Delete document**

#### Trin 8: Bekræft sletningen

#### Trin 9: VIGTIGT - Genberegn leaderboard:
1. Log ind som admin
2. Gå til admin.html
3. Klik "🔄 Genberegn alle leaderboards"
4. Dette opdaterer alle point korrekt

### ⚙️ Alternativ: Slet via kode (Avanceret)

Opret en slet-funktion i admin.html:

```javascript
async function deleteMatch(matchId) {
  if (!confirm(`Er du SIKKER på du vil slette ${matchId}? Dette kan ikke fortrydes!`)) {
    return;
  }
  
  // Slet kampen
  await db.collection("matches").doc(matchId).delete();
  
  // Slet alle brugergæt på kampen
  const usersSnap = await db.collection("users").get();
  const batch = db.batch();
  
  for (const userDoc of usersSnap.docs) {
    const guessRef = userDoc.ref.collection("guesses").doc(matchId);
    batch.delete(guessRef);
  }
  
  await batch.commit();
  
  // Genberegn leaderboards
  await recalculateAllLeaderboards();
  
  alert("Kamp slettet og leaderboards opdateret!");
  await loadKampe();
}
```

---

<a name="opret-turnering"></a>
## 🆕 4. Opret ny turnering

### Eksempel: Opret "EM2028"

#### Trin 1: Beslut turneringsnavn
- Vælg et kort, unikt navn: "EM2028"
- ⚠️ Kan IKKE ændres senere uden at miste data!

#### Trin 2: Tilføj turnering til dropdown (alle HTML filer)

Åbn **kampe_fixed.html**, **admin_fixed.html**, og **leaderboard_v2.html**

Find tournament selector sektionen og tilføj:

```html
<div style="display: flex; justify-content: center; gap: 0.75rem; margin-bottom: 2rem; flex-wrap: wrap;" id="tournament-selector">
  <button data-tournament="VM2026" class="tournament-btn bg-blue-600">VM 2026</button>
  <button data-tournament="Superliga" class="tournament-btn bg-gray-300">Superliga Forår 2026</button>
  <button data-tournament="PremierLeague" class="tournament-btn bg-gray-300">Premier League Forår 2026</button>
  <!-- NY TURNERING: -->
  <button data-tournament="EM2028" class="tournament-btn bg-gray-300">EM 2028</button>
</div>
```

#### Trin 3: Tilføj kampe til turneringen

I kampe_fixed.html, tilføj kampe med `tournament: "EM2028"`:

```javascript
const newMatches = [
  {id:"EM1", tournament:"EM2028", 
   homeTeam:"Danmark", awayTeam:"Tyskland", 
   date:"2028-06-10", time:"18:00", 
   homeGoals:null, awayGoals:null},
   
  {id:"EM2", tournament:"EM2028", 
   homeTeam:"Frankrig", awayTeam:"England", 
   date:"2028-06-10", time:"21:00", 
   homeGoals:null, awayGoals:null},
   
  // Flere kampe...
];
```

#### Trin 4: Gem og importer kampene

1. Gem alle HTML-filer
2. Refresh browseren
3. Log ind som admin
4. Klik "📥 Importer alle kampe"
5. Kampene oprettes med `tournament: "EM2028"`

#### Trin 5: Leaderboard oprettes automatisk

Når første resultat indtastes for EM2028, oprettes:
- `leaderboards/EM2028/users/{userId}`

Færdig! Turneringen er nu tilgængelig for alle brugere.

---

<a name="afslut-turnering"></a>
## 🏁 5. Afslut en turnering (arkivering)

### Scenarie: Superliga Forår 2026 er færdig

#### Option A: Behold som "skrivebeskyttet"

**Fordele:**
- ✅ Brugere kan stadig se deres gæt og point
- ✅ Leaderboard forbliver synligt
- ✅ Historik bevares

**Ulemper:**
- ⚠️ Fylder i dropdown (kan blive rodet)

**Ingen handling nødvendig** - bare lad den være!

#### Option B: Arkiver turneringen

1. **Eksporter data først (backup):**
   - Gå til Firebase Console
   - Firestore Database → Data
   - Eksporter `leaderboards/Superliga`
   - Gem som JSON eller CSV

2. **Fjern fra dropdown (valgfrit):**
   - Kommenter turneringen ud i HTML-filerne:
   ```html
   <!-- <button data-tournament="Superliga" class="tournament-btn bg-gray-300">Superliga Forår 2026</button> -->
   ```

3. **Data forbliver i Firebase** - kan genåbnes senere

#### Option C: Slet turneringen helt (IKKE anbefalet)

⚠️ **ADVARSEL: Dette sletter ALT data permanent!**

Kun hvis du er **100% sikker**:

1. Slet alle kampe med `tournament: "Superliga"`
2. Slet `leaderboards/Superliga` document
3. Slet alle brugergæt på Superliga kampe
4. Fjern fra dropdown

**Anbefaling:** Brug Option A eller B i stedet!

---

<a name="erstat-turnering"></a>
## 🔄 6. Erstat turnering (ny sæson)

### Scenarie: Superliga Forår 2026 → Superliga Efterår 2026

#### Metode 1: Nyt turneringsnavn (ANBEFALET)

**Fordele:**
- ✅ Bevar historik fra forårssæsonen
- ✅ Klart adskilt i leaderboard
- ✅ Brugere kan sammenligne sæsoner

**Trin:**

1. **Opret ny turnering:**
   - Navn: "SuperligaE26" (Superliga Efterår 2026)

2. **Tilføj til dropdown:**
   ```html
   <button data-tournament="SuperligaE26" class="tournament-btn bg-gray-300">Superliga Efterår 2026</button>
   ```

3. **Tilføj nye kampe:**
   ```javascript
   {id:"SLE1", tournament:"SuperligaE26", ...}
   {id:"SLE2", tournament:"SuperligaE26", ...}
   ```

4. **Behold eller fjern forårssæsonen** fra dropdown

#### Metode 2: Gennemgående turneringsnavn

**Fordele:**
- ✅ Simpel - samme navn hele tiden
- ✅ Færre dropdowns

**Ulemper:**
- ❌ Mister historik når nye kampe tilføjes
- ❌ Svært at sammenligne sæsoner

**Trin:**

1. **Arkiver data fra forårssæsonen først!**
   - Eksporter `leaderboards/Superliga`
   - Gem som "Superliga_Foraar_2026.json"

2. **Slet gamle kampe** (eller lad dem ligge - de vises kun som "afviklede")

3. **Tilføj nye kampe** med samme `tournament: "Superliga"`

4. **Leaderboard nulstilles IKKE automatisk** - kræver manuel handling

**Anbefaling:** Brug Metode 1 - det er renere og bevarer historik!

---

<a name="bevar-data"></a>
## 💾 7. Bevar historiske data

### Hvorfor bevare data?

- 📊 Brugere kan se deres historik
- 🏆 Muliggør trofæ-system senere
- 📈 Statistik over tid
- 🎯 Sammenlign sæsoner

### Hvad gemmes automatisk:

✅ **Gemmes permanent i Firebase:**
- Alle kampe (`matches` collection)
- Alle brugergæt (`users/{uid}/guesses`)
- Alle leaderboards (`leaderboards/{tournament}/users`)

✅ **Går IKKE tabt når ny sæson starter**

### Hvad du skal gøre:

#### 1. Eksporter vigtige leaderboards (backup)

**Via Firebase Console:**

1. Gå til Firestore Database → Data
2. Find `leaderboards/Superliga`
3. Klik Export
4. Gem filen: `Superliga_Foraar_2026_leaderboard.json`

**Via kode (Avanceret):**

```javascript
async function exportLeaderboard(tournament) {
  const snapshot = await db.collection("leaderboards")
    .doc(tournament)
    .collection("users")
    .get();
  
  const data = {};
  snapshot.forEach(doc => {
    data[doc.id] = doc.data();
  });
  
  console.log(JSON.stringify(data, null, 2));
  // Kopier fra console og gem som .json fil
}
```

#### 2. Dokumenter hvilke turneringer der findes

Opret en fil: `TURNERINGER_HISTORIK.txt`

```
=== TRAMPESTIPS TURNERINGER ===

VM2026 (December 2025 - Januar 2026)
- Kampe: VM1-VM5
- Status: Afsluttet
- Leaderboard: Gemt i leaderboards/VM2026

Superliga Forår 2026 (Februar - April 2026)
- Kampe: SL1-SL4
- Status: Igangværende
- Leaderboard: leaderboards/Superliga

Premier League Forår 2026 (Januar - Maj 2026)
- Kampe: PL1-PL2
- Status: Igangværende
- Leaderboard: leaderboards/PremierLeague
```

#### 3. Gem kopi af kampdata

For hver afsluttet sæson, gem en kopi af:
- Leaderboard (point, placering, statistik)
- Top 10 brugere
- Interessante statistikker

Dette kan senere bruges til trofæ-systemet!

---

<a name="trofaeer"></a>
## 🏆 8. Fremtidig funktion: Brugerprofiler med trofæer

### Vision for brugerprofiler:

Hver bruger får en personlig side med:

```
╔══════════════════════════════════════╗
║        BRUGER: Trampe123            ║
╚══════════════════════════════════════╝

📊 SAMLET STATISTIK:
• Total point: 247
• Turneringer deltaget: 5
• Kampe gættet: 143
• Korrekte resultater: 24
• Korrekte udfald: 89

🏆 TROFÆER:

🥇 1. plads - Superliga Forår 2026 (87 point)
🥈 2. plads - VM 2026 (62 point)
🥉 3. plads - Premier League Forår 2026 (54 point)

📜 TURNERINGS-HISTORIK:

VM2026
├─ Placering: #2
├─ Point: 62
├─ Korrekte: 6
└─ Status: Afsluttet

Superliga Forår 2026
├─ Placering: #1 🏆
├─ Point: 87
├─ Korrekte: 11
└─ Status: Afsluttet

Premier League Forår 2026
├─ Placering: #3
├─ Point: 54
├─ Korrekte: 7
└─ Status: Igangværende
```

### Implementering (fremtidig)

#### Firebase struktur tilføjelse:

```javascript
users/{userId}
├── email
├── username
├── createdAt
├── totalPoints (number)
├── tournamentsPlayed (number)
└── trophies (map)
    ├── VM2026
    │   ├── placement: 2
    │   ├── points: 62
    │   ├── correctResults: 6
    │   └── trophy: "silver"
    └── Superliga
        ├── placement: 1
        ├── points: 87
        ├── correctResults: 11
        └── trophy: "gold"
```

#### Når en turnering afsluttes:

```javascript
async function finalizeTournament(tournament) {
  // Hent leaderboard
  const leaderboard = await db.collection("leaderboards")
    .doc(tournament)
    .collection("users")
    .orderBy("points", "desc")
    .get();
  
  // Tildel trofæer til top 3
  const batch = db.batch();
  leaderboard.docs.forEach((doc, index) => {
    const userId = doc.id;
    const data = doc.data();
    
    let trophy = null;
    if (index === 0) trophy = "gold";
    else if (index === 1) trophy = "silver";
    else if (index === 2) trophy = "bronze";
    
    const userRef = db.collection("users").doc(userId);
    batch.update(userRef, {
      [`trophies.${tournament}`]: {
        placement: index + 1,
        points: data.points,
        correctResults: data.correctResult,
        trophy: trophy,
        finalizedAt: new Date()
      }
    });
  });
  
  await batch.commit();
  console.log(`${tournament} finalized with trophies!`);
}
```

#### Ny HTML-fil: profile.html

```html
<!-- Vis brugerens profil, statistik og trofæer -->
<h1>Min Profil</h1>
<div id="user-stats"></div>
<div id="user-trophies"></div>
<div id="tournament-history"></div>
```

---

## 📝 TJEKLISTE: Afslut og start ny sæson

### Når Superliga Forår 2026 slutter:

- [ ] **Afslut sæsonen:**
  - [ ] Alle kampe har resultater
  - [ ] Leaderboard er korrekt
  - [ ] Eksporter leaderboard til backup
  - [ ] (Fremtid) Kør `finalizeTournament("Superliga")`

- [ ] **Opret ny sæson:**
  - [ ] Beslut navn: "SuperligaE26" eller gennemgående "Superliga"
  - [ ] Tilføj til dropdown i alle 3 HTML-filer
  - [ ] Opret nye kampe med nyt tournament-navn
  - [ ] Importer kampene
  - [ ] Test at det virker

- [ ] **Kommunikér til brugere:**
  - [ ] Meddel hvornår nye kampe er tilgængelige
  - [ ] Vis afsluttende leaderboard fra forårssæsonen

---

## 🆘 FEJLSØGNING

### Problem: Ny turnering vises ikke i dropdown
**Løsning:** 
- Tjek at du har tilføjet knappen i ALLE 3 filer (kampe, admin, leaderboard)
- Refresh browseren (Ctrl+F5)

### Problem: Kampe vises under forkert turnering
**Løsning:**
- Tjek `tournament` feltet - det skal matche præcist (case-sensitive)

### Problem: Leaderboard viser 0 point for ny turnering
**Løsning:**
- Indtast mindst ét resultat som admin
- Leaderboard oprettes automatisk

### Problem: Gamle kampe dukker op i ny sæson
**Løsning:**
- Brug unikt turneringsnavn for hver sæson
- ELLER filtrér kampe baseret på dato

---

## 💡 BEST PRACTICES

1. ✅ **Brug unikke turneringsnavne** - f.eks. "SuperligaF26", "SuperligaE26"
2. ✅ **Eksporter data før sletning** - altid!
3. ✅ **Test nye turneringer** før du inviterer brugere
4. ✅ **Dokumenter dine turneringer** - lav en liste
5. ✅ **Bevar historik** - brugere elsker at se deres gamle resultater
6. ✅ **Kommunikér tydeligt** når ny sæson starter

---

## 📞 Hurtig reference

| Opgave | Metode | Tid |
|--------|--------|-----|
| Tilføj 1 kamp | Rediger `importMatches()`, klik import | 2 min |
| Tilføj 10 kampe | Rediger `importMatches()`, klik import | 5 min |
| Opret ny turnering | Tilføj til dropdown (3 filer), tilføj kampe | 10 min |
| Slet kamp | Firebase Console → Delete document | 2 min |
| Eksporter leaderboard | Firebase Console → Export | 3 min |
| Afslut sæson | Eksporter data, tilføj ny turnering | 15 min |

---

**Held og lykke med dine turneringer! ⚽🏆**
