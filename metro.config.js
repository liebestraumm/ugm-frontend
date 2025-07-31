const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Filter out iOS system warnings
config.reporter = {
  ...config.reporter,
  update: (event) => {
    // Filter out common iOS system warnings
    if (event.type === 'bundle_build_done') {
      const filteredLogs = event.logs.filter(log => {
        return !log.includes('[CoreFoundation]') &&
               !log.includes('[AudioToolbox]') &&
               !log.includes('[CoreAudio]') &&
               !log.includes('[RemoteTextInput]') &&
               !log.includes('AddInstanceForFactory') &&
               !log.includes('LoudnessManager') &&
               !log.includes('HALC_ProxyIOContext') &&
               !log.includes('perform input operation');
      });
      event.logs = filteredLogs;
    }
    return event;
  }
};

module.exports = config; 