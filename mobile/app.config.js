export default {
  expo: {
    name: "Farmer Marketplace",
    slug: "farmer-marketplace",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.alokkumarswn1.farmermarketplace"
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      apiUrl: process.env.API_URL,
      socketUrl: process.env.SOCKET_URL,
      eas: {
        projectId: "f4511c46-c7eb-4773-a1c1-d97e5907737a"
      }
    },
  }
};
