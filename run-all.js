const { spawn } = require("child_process");
const path = require("path");

const repos = [
  { name: "richardhan-server", folder: "richardhan-server", cmd: "npm", args: ["run", "start:dev"] },
  { name: "auth-and-kyc", folder: "auth-and-kyc", port: 3000, cmd: "npm", args: ["run", "dev", "--", "-p", "3000"] },
  { name: "super-admin-dashboard", folder: "super-admin-dashboard", port: 3001, cmd: "npm", args: ["run", "dev", "--", "-p", "3001"] },
  { name: "pet-hotel-admin-dashboard", folder: "pet-hotel-admin-dashboard", port: 3002, cmd: "npm", args: ["run", "dev", "--", "-p", "3002"] },
  { name: "vendor-admin", folder: "vendor-admin", port: 3003, cmd: "npm", args: ["run", "dev", "--", "-p", "3003"] },
  { name: "pet-sitter-admin-dashboard", folder: "pet-sitter-admin-dashboard", port: 3004, cmd: "npm", args: ["run", "dev", "--", "-p", "3004"] },
  { name: "pet-school-admin", folder: "pet-school-admin", port: 3005, cmd: "npm", args: ["run", "dev", "--", "-p", "3005"] },
  { name: "owner-dashboard", folder: "owner-dashboard", port: 3006, cmd: "npm", args: ["run", "dev", "--", "-p", "3006"] },
  { name: "marketing-landing", folder: "marketing-landing", port: 3007, cmd: "npm", args: ["run", "dev", "--", "-p", "3007"] },
];

console.log("Starting all repositories...");

const processes = [];

repos.forEach((repo) => {
  const repoPath = path.join(__dirname, repo.folder);
  console.log(`[STARTING] ${repo.name} ${repo.port ? `on port ${repo.port}` : "Backend"}...`);

  const child = spawn(repo.cmd, repo.args, {
    cwd: repoPath,
    stdio: "inherit", 
    shell: true 
  });

  child.on("error", (error) => {
    console.error(`[ERROR] Failed to start ${repo.name}:`, error);
  });

  processes.push(child);
});

// Handle termination gracefully
const terminateAll = () => {
  console.log("\nShutting down all processes...");
  processes.forEach((child) => {
    try {
      if (process.platform === "win32") {
        spawn("taskkill", ["/pid", child.pid, "/f", "/t"]);
      } else {
        process.kill(-child.pid, "SIGTERM");
        child.kill("SIGTERM");
      }
    } catch (e) {}
  });
  process.exit();
};

process.on("SIGINT", terminateAll);
process.on("SIGTERM", terminateAll);
