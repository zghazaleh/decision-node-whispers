import { createServerFn } from "@tanstack/react-start";

const GITHUB_REPO = "zghazaleh/decision-node-whispers";
const GITHUB_BRANCH = "main";
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

type GhContentEntry = {
  name: string;
  size: number;
  type: "file" | "dir" | "symlink" | "submodule";
};

type GhCommit = {
  sha: string;
  commit: { committer: { date: string } };
};

export const getConstitutionStatus = createServerFn({ method: "GET" }).handler(
  async (): Promise<ConstitutionStatus> => {
    const remoteUrl = `https://github.com/${GITHUB_REPO}`;
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "lovable-constitution-status",
    };

    let githubConnected = false;
    const files: ConstitutionFileInfo[] = [];
    const missingFiles: string[] = [...EXPECTED_FILES];
    let lastGitCommit: string | null = null;
    let lastGitCommitTime: string | null = null;

    // Verify repo reachable + list constitution dir
    try {
      const contentsRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO}/contents/${CONSTITUTION_DIR}?ref=${GITHUB_BRANCH}`,
        { headers },
      );
      if (contentsRes.ok) {
        githubConnected = true;
        const entries = (await contentsRes.json()) as GhContentEntry[];
        const presentNames = new Set<string>();
        for (const e of entries) {
          if (e.type !== "file") continue;
          presentNames.add(e.name);
          files.push({
            name: e.name,
            size: e.size,
            modifiedAt: "",
          });
        }
        for (let i = missingFiles.length - 1; i >= 0; i--) {
          if (presentNames.has(missingFiles[i])) missingFiles.splice(i, 1);
        }
      } else if (contentsRes.status === 404) {
        // Repo reachable but folder missing — still counts as connected if repo exists
        const repoRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}`,
          { headers },
        );
        githubConnected = repoRes.ok;
      }
    } catch {
      // network error — treat as disconnected
    }

    // Latest commit on the constitution dir
    if (githubConnected) {
      try {
        const commitsRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO}/commits?path=${CONSTITUTION_DIR}&sha=${GITHUB_BRANCH}&per_page=1`,
          { headers },
        );
        if (commitsRes.ok) {
          const commits = (await commitsRes.json()) as GhCommit[];
          if (commits[0]) {
            lastGitCommit = commits[0].sha;
            lastGitCommitTime = commits[0].commit.committer.date;
            // Fill in modifiedAt for files with the commit time as a best-effort
            for (const f of files) {
              if (!f.modifiedAt) f.modifiedAt = lastGitCommitTime;
            }
          }
        }
      } catch {
        // ignore
      }
    }

    return {
      githubConnected,
      githubRemoteUrl: githubConnected ? remoteUrl : null,
      files: files.sort((a, b) => a.name.localeCompare(b.name)),
      allFilesPresent: missingFiles.length === 0,
      missingFiles,
      lastGitCommit,
      lastGitCommitTime,
    };
  },
);
