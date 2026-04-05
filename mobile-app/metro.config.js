import { getDefaultConfig } from "expo/metro-config";
import { withNativeWind } from "nativewind/metro-config";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(__filename);
const config = getDefaultConfig(__dirname);

export default withNativeWind(config, { 
  input: "./global.css" 
});