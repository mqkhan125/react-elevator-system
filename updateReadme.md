# 🚀 Smart Lift System (React Simulation)

A real-time **lift (elevator) simulation app** built using React.  
This project demonstrates **state management, queue handling, and interval-based animations** similar to real-world elevator systems.

---

## 👨‍💻 Author
**Muhammad Qasim Khan**

---
### 🏢 Lift System UI
<img width="773" height="575" alt="lift_system" src="https://github.com/user-attachments/assets/73632de4-aa31-48dd-bb62-73e4cd554d85" />

---

## 📌 Features

- 🏢 Multi-floor building (0–9 floors)
- 🔘 Floor request queue system
- ⬆️⬇️ Direction-aware movement (UP / DOWN)
- 🚪 Door open & close animation on arrival
- ⏱️ Realistic timing:
  - 2 seconds per floor movement
  - 3 seconds stop delay (door handling)
- ⚡ Prevents invalid movements (no negative floors)
- 🎯 Smart queue processing (FIFO system)
- 🎨 Clean UI with floor highlighting and lift animation

---

## 🧠 Core Logic

The system is based on:

- **Queue-based request handling**
- **Interval-driven floor movement**
- **State machine behavior (IDLE → MOVING → STOP)**
- **Edge case protection (same-floor requests, duplicate clicks)**

---

## 🛠️ Tech Stack

- React.js (Functional Components)
- useState, useEffect, useRef
- Tailwind CSS (UI styling)
- JavaScript (core logic)

---

## ⚙️ How It Works

1. User clicks a floor button
2. Floor is added to queue
3. Lift picks next request automatically
4. Moves floor by floor (2s per step)
5. Stops at target floor (3s pause)
6. Door animation plays
7. Next request starts automatically

---

## 🧩 Key Concepts Used

- Event Loop handling (setInterval + setTimeout)
- Queue data structure
- React state synchronization
- Controlled side effects
- UI + logic separation

---

## 🚀 Getting Started

```bash
# clone repo
git clone https://github.com/your-username/lift-system.git

# install dependencies
npm install

# start project
npm run dev
