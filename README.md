# VKU Study Room Booking App

VKU Study Room Booking is a high-performance mobile application built with React Native and Expo. It helps VKU students quickly discover available study rooms and computer labs, reserve study slots, manage their bookings, and use a QR booking pass for check-in.

---

## 🚀 Features & Functionality

### 1. Room Discovery & Smart Filtering
- **Real-time Availability Status:** Rooms display their current status (Available Now / Occupied) based on the exact time of day.
- **Advanced Search & Filtering:** 
  - Search by room name (e.g., "V401").
  - Filter by specific buildings (A, B, C, V).
  - Filter by minimum seat capacity (2+, 5+, 10+, 20+).
  - Filter by specific equipment (AC, Projector, High-Spec PC, Whiteboard).
- **High-Performance List:** Uses React Native's `FlatList` with optimized rendering to scroll through rooms smoothly.

### 2. Intelligent Booking System
- **7-Day Selector:** Plan ahead by booking rooms up to 7 days in advance.
- **Time Slots:** Select 2-hour study slots based on VKU schedules.
- **Conflict Prevention Engine:** The app actively checks for booking overlaps, disabling slots that have already passed or have been booked by someone else to prevent double-booking.

### 3. QR Booking Pass & Check-in
- **Digital Pass:** Each confirmed booking generates a unique, scannable QR Code containing the booking ID and room information.
- **Offline Capable Storage:** Bookings are persisted securely in local storage so your QR passes remain accessible even with a poor internet connection.

### 4. Booking Management & Reminders
- **My Bookings Tab:** A dedicated tab to view all upcoming (Active) and past (Passed/Cancelled) bookings.
- **Cancellation:** Flexibility to cancel an upcoming reservation directly from the app.
- **Local Notifications:** The app schedules an automatic local push notification to remind you exactly 15 minutes before your study session starts.

---

## 🛠 Tech Stack

- **Framework:** React Native with Expo (Expo Router for navigation).
- **Language:** TypeScript (Strict Mode).
- **State Management:** 
  - `Zustand` (with AsyncStorage persistence) for global user and booking states.
  - `TanStack Query` (React Query) for mocking async server states and caching room data.
- **UI Design System:** Custom styling powered by unified design tokens (`theme.ts`) leveraging lucide-react-native icons.
- **Push Notifications:** `expo-notifications`.
- **QR Code Generation:** `react-native-qrcode-svg`.

---

## 💻 Installation & Local Development

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Clone & Install Dependencies

```bash
cd VKU_bookroom
npm install
```

### 2. Start the Development Server

```bash
npx expo start
```

- Press `a` in the terminal to open the app on an Android Emulator.
- Press `i` to open the app on an iOS Simulator (macOS only).
- Alternatively, download the **Expo Go** app on your physical mobile device and scan the QR code in the terminal to run the app directly on your phone.

---

## 📦 Building the APK (Android)

This project is configured with **EAS (Expo Application Services)** to seamlessly build an Android `.apk` package in the cloud.

### Build Instructions:

1. Run the EAS build command for the `preview` profile:
   ```bash
   npx eas-cli@latest build -p android --profile preview
   ```
2. If this is your first time, the CLI will prompt you to log in to your Expo account.
3. EAS will upload your code and compile the APK on their cloud servers. 
4. Once completed, the CLI will provide a direct **Download Link** for your `.apk` file which you can send to your Android device to install.

---

## 📁 Project Structure

- `/src/app`: Expo Router file-based routing. Includes tabs `(tabs)` and detail screens `room/[id]`.
- `/src/components`: Reusable, design-system-compliant UI components (`Button`, `RoomCard`, `BookingCard`, `FilterChip`, etc.).
- `/src/hooks`: Custom React hooks for business logic (`useBookingSlots`, `useRoomFilters`, `useRoomsQuery`).
- `/src/store`: Zustand stores (`useBookingStore.ts`) for managing client state.
- `/src/api`: Data fetching layer.
- `/src/types`: TypeScript interfaces for the data models.
- `/src/constants`: Global constants including time slots, equipment labels, and the unified `theme.ts` design system.

