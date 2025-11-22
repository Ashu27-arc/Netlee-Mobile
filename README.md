# 📱 Netlee Mobile - Deployment Guide

Expo/React Native mobile application ka complete deployment guide.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Local Setup](#local-setup)
4. [API Configuration](#api-configuration)
5. [Development Testing](#development-testing)
6. [Production Build](#production-build)
7. [App Distribution](#app-distribution)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

Yeh mobile application streaming platform ka native mobile interface hai jo provide karta hai:
- User Authentication (Login/Register)
- Movie Browsing & Search
- Video Player with HLS support
- User Profile & My List
- Offline capabilities (AsyncStorage)

**Tech Stack:**
- Expo SDK 54
- React Native 0.81
- React Navigation
- Axios
- Expo AV (Video Player)
- TypeScript

---

## 🔧 Prerequisites

Deployment se pehle ensure karein:

- ✅ Node.js v18+ installed
- ✅ Backend API deployed aur running
- ✅ Expo account (free)
- ✅ Android Studio (Android build ke liye)
- ✅ Xcode (iOS build ke liye - Mac only)
- ✅ Physical device ya emulator

---

## 💻 Local Setup

### 1. Install Dependencies

```bash
cd Netlee-Mobile
npm install
```

### 2. Install Expo CLI (Optional)

```bash
npm install -g expo-cli
```

Ya directly `npx expo` use karo (recommended).

### 3. API Configuration

**Important**: `api/api.ts` file me backend URL update karo:

```typescript
// Development (Local Network)
const API = axios.create({
    baseURL: "http://YOUR_LOCAL_IP:5000/api", // ⚠️ Change this
    timeout: 10000,
});

// Production (Live Server)
const API = axios.create({
    baseURL: "https://your-backend-url.com/api", // ⚠️ Production URL
    timeout: 10000,
});
```

**Local IP kaise find karein:**
- **Windows**: `ipconfig` run karo, `IPv4 Address` dekho
- **Mac/Linux**: `ifconfig` ya `ip addr` run karo
- Example: `http://192.168.1.12:5000/api`

### 4. Run Development Server

```bash
# Start Expo development server
npm start

# Ya specific platform
npm run android  # Android emulator/device
npm run ios      # iOS simulator (Mac only)
npm run web      # Web browser
```

### 5. Test on Device

1. **Expo Go App Install karo:**
   - Android: [Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **QR Code Scan karo:**
   - Terminal me QR code dikhega
   - Expo Go app se QR code scan karo
   - App automatically load ho jayega

**Note**: Phone aur computer same WiFi network par hone chahiye!

---

## 🌐 API Configuration

### Development vs Production

#### Development Setup (Local Testing)

```typescript
// api/api.ts
const API = axios.create({
    baseURL: "http://192.168.1.12:5000/api", // Your local IP
    timeout: 10000,
});
```

**Requirements:**
- ✅ Backend `localhost:5000` par running
- ✅ Phone aur computer same WiFi par
- ✅ Firewall me port 5000 allow

#### Production Setup (Live Server)

```typescript
// api/api.ts
const API = axios.create({
    baseURL: "https://your-backend-url.com/api", // Production URL
    timeout: 10000,
});
```

**Requirements:**
- ✅ Backend deployed aur accessible
- ✅ HTTPS enabled (required for production)
- ✅ CORS configured properly

### Backend CORS Update

Backend me mobile app ke liye CORS allow karo:

```javascript
// Netlee-Backend/server.js
app.use(cors({
    origin: [
        "https://your-frontend-url.com",
        "exp://your-expo-url",  // Development
        "*"  // Production me specific URLs use karo
    ],
    credentials: true
}));
```

---

## 🧪 Development Testing

### Option 1: Expo Go (Quick Testing)

**Pros:**
- ✅ Fast setup
- ✅ No build required
- ✅ Hot reload

**Cons:**
- ❌ Limited native modules
- ❌ Not for production

**Steps:**
```bash
npm start
# QR code scan karo Expo Go app se
```

### Option 2: Development Build

**Pros:**
- ✅ All native features
- ✅ Production-like experience

**Steps:**
```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build development version
eas build --profile development --platform android
```

---

## 🚀 Production Build

### EAS Build Setup (Recommended)

#### Step 1: Install EAS CLI

```bash
npm install -g eas-cli
eas login
```

#### Step 2: Configure EAS

```bash
cd Netlee-Mobile
eas build:configure
```

Yeh `eas.json` file create karega:

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "bundleIdentifier": "com.yourcompany.netlee"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

#### Step 3: Update API URL for Production

`api/api.ts` me production URL set karo:

```typescript
const API = axios.create({
    baseURL: "https://your-backend-url.com/api", // Production URL
    timeout: 10000,
});
```

#### Step 4: Build Android APK

```bash
# Production APK
eas build --platform android --profile production

# Preview APK (testing ke liye)
eas build --platform android --profile preview
```

Build process:
1. EAS servers par build hoga
2. 10-20 minutes lag sakte hain
3. Build complete hone par download link milega
4. APK download karo

#### Step 5: Build iOS IPA (Mac Required)

```bash
eas build --platform ios --profile production
```

**Requirements:**
- ✅ Mac computer
- ✅ Apple Developer account ($99/year)
- ✅ Xcode installed

---

## 📦 App Distribution

### Option 1: Direct APK Distribution

1. **APK Download:**
   - EAS build se APK download karo
   - Ya manually build karo: `eas build --platform android --profile production`

2. **Share APK:**
   - APK file ko share karo (Google Drive, email, etc.)
   - Users directly install kar sakte hain

3. **Install on Device:**
   - Android Settings → Security → "Unknown Sources" enable karo
   - APK file open karo
   - Install button click karo

### Option 2: Google Play Store

#### Step 1: Create Play Console Account

1. [Google Play Console](https://play.google.com/console) par account banao
2. One-time registration fee: $25

#### Step 2: Create App

1. "Create app" click karo
2. App details fill karo:
   - App name
   - Default language
   - App type
   - Free/Paid

#### Step 3: Prepare Release

1. **App Bundle Build:**
   ```bash
   eas build --platform android --profile production
   ```
   Build type `aab` (Android App Bundle) hona chahiye

2. **App Signing:**
   - EAS automatically handle karta hai
   - Ya manually signing key setup karo

#### Step 4: Upload to Play Store

1. Play Console me "Production" → "Create new release"
2. AAB file upload karo
3. Release notes add karo
4. Submit for review

### Option 3: Apple App Store (iOS)

#### Step 1: Apple Developer Account

1. [Apple Developer](https://developer.apple.com) par account banao
2. Annual fee: $99

#### Step 2: Build IPA

```bash
eas build --platform ios --profile production
```

#### Step 3: Submit to App Store

```bash
eas submit --platform ios
```

Ya manually Xcode se App Store Connect me upload karo.

---

## 🔍 Troubleshooting

### Issue 1: Cannot Connect to Backend

**Error**: `Network Error` ya `ECONNREFUSED`

**Solution**:
- ✅ Backend server running hai ya nahi check karo
- ✅ API URL sahi hai ya nahi (`api/api.ts`)
- ✅ Phone aur computer same WiFi par hain
- ✅ Firewall me port 5000 allow hai
- ✅ Local IP address sahi hai

**Test:**
```bash
# Phone browser me yeh URL open karo
http://YOUR_LOCAL_IP:5000/api/movies
```

### Issue 2: CORS Error

**Error**: `CORS policy blocked`

**Solution**:
- ✅ Backend me CORS configuration check karo
- ✅ Mobile app URL CORS me include hai ya nahi
- ✅ Production me HTTPS use karo

### Issue 3: Expo Go App Not Loading

**Error**: App load nahi ho raha

**Solution**:
- ✅ Phone aur computer same network par hain
- ✅ Expo Go app latest version hai
- ✅ QR code sahi scan hua hai
- ✅ Development server running hai

### Issue 4: Build Failed

**Error**: EAS build fail ho raha hai

**Solution**:
- ✅ `eas.json` configuration check karo
- ✅ `app.json` me app details sahi hain
- ✅ Dependencies properly installed
- ✅ Build logs check karo for specific errors

### Issue 5: Video Not Playing

**Error**: Video load nahi ho raha

**Solution**:
- ✅ HLS stream URL sahi hai ya nahi
- ✅ Network connection stable hai
- ✅ Expo AV properly configured
- ✅ Video format supported hai

### Issue 6: AsyncStorage Not Working

**Error**: Data save nahi ho raha

**Solution**:
- ✅ `@react-native-async-storage/async-storage` installed hai
- ✅ Proper async/await use kar rahe hain
- ✅ Permissions sahi hain

---

## 📱 App Configuration

### app.json Settings

```json
{
  "expo": {
    "name": "Netlee",
    "slug": "netlee-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "splash": {
      "image": "./assets/images/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    },
    "android": {
      "package": "com.yourcompany.netlee",
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#000000"
      },
      "permissions": [
        "INTERNET",
        "ACCESS_NETWORK_STATE"
      ]
    },
    "ios": {
      "bundleIdentifier": "com.yourcompany.netlee"
    }
  }
}
```

---

## 🔒 Security Best Practices

1. **API Keys**: Sensitive keys ko environment variables me store karo
2. **HTTPS**: Production me always HTTPS use karo
3. **Token Storage**: JWT tokens AsyncStorage me securely store karo
4. **Code Obfuscation**: Production build me code obfuscate karo

---

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [React Native Docs](https://reactnative.dev/)
- [Expo AV](https://docs.expo.dev/versions/latest/sdk/av/)
- [React Navigation](https://reactnavigation.org/)

---

## ✅ Deployment Checklist

### Development
- [ ] Dependencies installed
- [ ] API URL configured (local IP)
- [ ] Backend running locally
- [ ] Expo Go app installed
- [ ] App tested on device

### Production
- [ ] API URL updated (production URL)
- [ ] Backend deployed & accessible
- [ ] EAS account setup
- [ ] `eas.json` configured
- [ ] `app.json` updated
- [ ] Android APK built
- [ ] iOS IPA built (if needed)
- [ ] App tested on real devices
- [ ] Play Store/App Store submission (optional)

---

## 🎯 Quick Start Commands

```bash
# Development
npm start                    # Start Expo dev server
npm run android             # Run on Android
npm run ios                 # Run on iOS

# Production Build
eas build --platform android --profile production
eas build --platform ios --profile production

# Submit to Stores
eas submit --platform android
eas submit --platform ios
```

---

**Mobile App**: APK/IPA ready for distribution  
**Backend API**: `https://your-backend-url.com/api`  
**Status**: ✅ Ready for Production

*Koi bhi issue ho to GitHub Issues me post karein!*
