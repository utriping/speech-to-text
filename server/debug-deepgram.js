const DeepgramSDK = require('@deepgram/sdk');
console.log('DeepgramSDK keys:', Object.keys(DeepgramSDK));
if (DeepgramSDK.default) {
    console.log('DeepgramSDK.default keys:', Object.keys(DeepgramSDK.default));
}
try {
    const { createClient } = require('@deepgram/sdk');
    console.log('createClient type:', typeof createClient);
} catch (e) {
    console.log('createClient import failed:', e.message);
}
