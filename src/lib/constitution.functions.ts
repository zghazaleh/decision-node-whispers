import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { execSync } from "child_process";
import { readdirSync, statSync } from "fs";
import { join } from "path";

const CONSTITUTION_DIR = "constitution";
const EXPECTED_FILES = [
  "README.md",
  "00-product-philosophy.md",
  "01-first-principles.md",
  "02-design-principles.md",
  "03-decision-node-spec.md",
  "04-ai-director-philosophy.md",
  "05-decision-analysis-philosophy.md",
  "06-world-building.md",
  "07-roadmap.md",
  "08-non-negotiables.md",
  "09-history.md",
  "VERIFICATION-CHECKLIST.md",
];

export type ConstitutionFileInfo = {
  name: string;
  size: number;
  modifiedAt: string;
};

export type ConstitutionStatus = {
  githubConnected: boolean;
  githubRemoteUrl: string | null;
  files: ConstitutionFileInfo[];
  allFilesPresent: boolean;
  missingFiles: string[];
  lastGitCommit: string | null;
  lastGitCommitTime: string | null;
};

export const getConstitutionStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConstitutionStatus> => {
    // Check GitHub remotes
    let githubConnected = false;
    let githubRemoteUrl: string | null = null;
    try {
      const remotes = execSync("git remote -v", { encoding: "utf-8", timeout: 5000 });
      const lines = remotes.split("\n").filter(Boolean);
      const githubLine = lines.find((l) => l.includes("github.com"));
      if (githubLine) {
        githubConnected = true;
        githubRemoteUrl = githubLine.split(/\s+/)[1] ?? null;
      }
    } catch {
      // git not available or no remotes
    }

    // Check constitution files
    const files: ConstitutionFileInfo[] = [];
    const missingFiles: string[] = [];

    for (const name of EXPECTED_FILES) {
      const path = join(CONSTITUTION_DIR, name);
      try {
        const stats = statSync(path);
        files.push({
          name,
          size: stats.size,
          modifiedAt: stats.mtime.toISOString(),
        });
      } catch {
        missingFiles.push(name);
      }
    }

    // Extra files not in expected list
    try {
      const entries = readdirSync(CONSTITUTION_DIR);
      for (const name of entries) {
        if (!EXPECTED_FILES.includes(name)) {
          try {
            const stats = statSync(join(CONSTITUTION_DIR, name));
            files.push({
              name,
              size: stats.size,
              modifiedAt: stats.mtime.toISOString(),
            });
          } catch { /* noop */ }
        }
      }
    } catch { /* noop */ }

    // Last git commit info
    let lastGitCommit: string | null = null;
    let lastGitCommitTime: string | null = null;
    try {
      lastGitCommit = execSync("git log -1 --format=%H", {
        encoding: "utf-8",
        timeout: 5000,
      }).trim();
      lastGitCommitTime = execSync("git log -1 --format=%ci", {
        encoding: "utf-8",
        timeout: 5000,
      }).trim();
    } catch {
      // no commits
    }

    return {
      githubConnected,
      githubRemoteUrl,
      files: files.sort((a, b) => a.name.localeCompare(b.name)),
      allFilesPresent: missingFiles.length === 0,
      missingFiles,
      lastGitCommit,
      lastGitCommitTime,
    };
  },
);
