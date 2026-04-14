const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Metro in Expo SDK 54 uses Array.prototype.toReversed, which is missing in Node 18.
if (!Array.prototype.toReversed) {
	Object.defineProperty(Array.prototype, "toReversed", {
		value: function toReversed() {
			return [...this].reverse();
		},
		writable: true,
		configurable: true,
	});
}

const config = getDefaultConfig(__dirname);

// config.resolver.sourceExts = ["jsx", "js", "ts", "tsx", "json"];

module.exports = withNativeWind(config, { input: "./app/global.css" });