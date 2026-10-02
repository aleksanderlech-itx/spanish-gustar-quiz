import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
// Use a preinstalled Chromium when one is provided instead of downloading one.
if (process.env.REMOTION_BROWSER) Config.setBrowserExecutable(process.env.REMOTION_BROWSER);
