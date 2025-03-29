const { execSync } = require("child_process");

try {
    // Check if adb is accessible
    const adbVersion = execSync("adb --version", { encoding: "utf-8" });
    console.log("ADB is accessible:");
    console.log(adbVersion);
} catch (error) {
    console.error("ADB is not accessible. Please check your PATH configuration.");
}

// Check if platform-tools is in the PATH
const pathEnv = process.env.PATH || process.env.Path;
console.log("Current PATH:", pathEnv);
if (pathEnv.includes("platform-tools")) {
    console.log("platform-tools is correctly added to the PATH.");
} else {
    console.error(
        "platform-tools is NOT in the PATH. Please add the platform-tools directory to your PATH."
    );
}