const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
defaultConfig.resolver.assetExts.push('cjs');

module.exports = defaultConfig;

// import { Device } from 'expo-device';

// // 모델 이름 가져오기
// const modelName = Device.modelName;
// console.log(modelName);