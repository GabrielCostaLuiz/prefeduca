/* global __DEV__ */
/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Entry point customizado para o Expo.
 *
 * Carrega os polyfills de APIs Web (EventTarget, MessageEvent, etc.)
 * necessários para o MSW 2.x funcionar no React Native (Hermes)
 * ANTES de qualquer outro módulo ser avaliado.
 */
if (__DEV__) {
  require('./core/mocks/polyfills');
}

// Entry point padrão do Expo Router
require('expo-router/entry');
