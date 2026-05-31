#!/usr/bin/env python3
"""
Scaffold a manual testing project with 4 core folders.
Usage:
    python3 scaffold.py \
        --project-name "my-project" \
        --project-version "v1.0" \
        --environments "DEV,STG" \
        --urls "https://dev.example.com,https://stg.example.com" \
        --test-types "Functional,Regression,Smoke,API" \
        --output-dir "."
"""

import argparse
import os
from datetime import date


def parse_args():
    parser = argparse.ArgumentParser(description="Scaffold a manual testing project")
    parser.add_argument("--project-name", required=True, help="Project name (kebab-case)")
    parser.add_argument("--project-version", default="v1.0",
                        help="Project version, e.g. v1.0, v2.3 (default: v1.0)")
    parser.add_argument("--environments", required=True, help="Comma-separated: DEV,STG,UAT,PROD")
    parser.add_argument("--urls", default="", help="Comma-separated URLs matching environments")
    parser.add_argument("--test-types", required=True,
                        help="Comma-separated: Functional,Regression,Smoke,UAT,Exploratory,Performance,API")
    parser.add_argument("--output-dir", default=".", help="Parent directory for the project")
    return parser.parse_args()


def mkdir(path):
    os.makedirs(path, exist_ok=True)


def write_file(path, content):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)


def template_claude_md(project_name, project_version, test_types, envs, urls):
    tt_str = ", ".join(test_types)
    url_list = [u.strip() for u in urls] if urls else []
    env_lines = []
    for i, env in enumerate(envs):
        url = url_list[i] if i < len(url_list) else "N/A"
        env_lines.append("- **" + env.strip().upper() + ":** " + url)
    env_str = "\n".join(env_lines) if env_lines else "- N/A"
    today = date.today().isoformat()

    out_webapp = "AI_ISC_" + project_name + "_" + project_version + "_TC_v1.0.xlsx"
    out_api    = "AI_ISC_" + project_name + "_" + project_version + "_TC_API_v1.0.xlsx"
    out_update = "AI_ISC_" + project_name + "_" + project_version + "_TC_v2.0.xlsx (v3.0...)"
    naming_tc  = "AI_ISC_" + project_name + "_" + project_version + "_TC_v[tc_version].xlsx"

    content = (
        "# " + project_name + " -- Project Context\n"
        "\n"
        "## Thong tin du an\n"
        "- **Ten du an:** " + project_name + "\n"
        "- **Version:** " + project_version + "\n"
        "- **Loai kiem thu:** " + tt_str + "\n"
        "- **Moi truong & URL:**\n"
        + env_str + "\n"
        "\n"
        "## QA Testing Pipeline\n"
        "```\n"
        "00_input/  (dat URD/BRD/SRS tu BA vao day)\n"
        "  |\n"
        "  |-> analyze-requirement  ->  02_analyze-requirements/\n"
        "  |       Output: MEMORY.md, test_scenario_map.md,\n"
        "  |               requirement_traceability.md, risk_assessment.md\n"
        "  |\n"
        "  |-> gen-testcase-webapp  ->  03_test-cases/functional/<module>/\n"
        "  |       Output: " + out_webapp + " (Web/Mobile)\n"
        "  |\n"
        "  |-> gen-testcase-api     ->  03_test-cases/api/<module>/\n"
        "  |       Output: " + out_api + " (REST API)\n"
        "  |\n"
        "  `-> update-testcase  ->  03_test-cases/functional|api/<module>/\n"
        "          Output: " + out_update + "\n"
        "```\n"
        "\n"
        "## Naming Conventions\n"
        "- **TC Excel:** `" + naming_tc + "`\n"
        "- **TC ID (web):** `TC_[MODULE].[NNN]` -- vi du: TC_LOGIN.1, TC_PAY.3\n"
        "- **TC ID (api):** `API_[NN].[NNN]` -- vi du: API_01.3\n"
        "- **Scenario ID:** `SC-[MODULE]-[NNN]` -- vi du: SC-LOGIN-001\n"
        "- **Requirement ID:** `REQ-[MODULE]-[NNN]` -- vi du: REQ-LOGIN-001\n"
        "\n"
        "## Folder Reference\n"
        "| Thu muc | Muc dich | Skill lien quan |\n"
        "|---------|----------|-----------------|\n"
        "| `00_input/` | Tai lieu dau vao: URD, SRS, specs tu BA | analyze-requirement (doc) |\n"
        "| `02_analyze-requirements/` | Output: MEMORY.md, scenario map, traceability, risk | analyze-requirement (ghi) |\n"
        "| `03_test-cases/functional/<module>/` | TC Excel Web/Mobile (1 thu muc / module, mirror 02) | gen-testcase-webapp (ghi), update-testcase (doc+ghi) |\n"
        "| `03_test-cases/api/<module>/` | TC Excel API (1 thu muc / module, mirror 02) | gen-testcase-api (ghi) |\n"
        "| `03_test-cases/_results/` | File ket qua *_results_*.xlsx tu sync-tc-results | sync-tc-results (ghi) |\n"
        "| `04_test-data/` | Du lieu test (valid / invalid) | -- |\n"
        "\n"
        "## MEMORY Files\n"
        "- `02_analyze-requirements/MEMORY.md` -- bridge file, downstream skills doc file nay\n"
        "\n"
        "## Language Rule\n"
        "- Noi dung TC, mo ta, steps: **Tieng Viet**\n"
        "- Technical terms, status (Pass/Fail/Blocked), priority (P1/P2/P3): **Tieng Anh**\n"
        "\n"
        "## Tools\n"
        "- Scaffolded by `init-manual-project` skill\n"
        "- Created: " + today + "\n"
    )
    return content


def main():
    args = parse_args()

    project = args.project_name
    version = args.project_version
    envs = [e.strip() for e in args.environments.split(",") if e.strip()]
    urls = [u.strip() for u in args.urls.split(",") if u.strip()] if args.urls else []
    test_types = [t.strip() for t in args.test_types.split(",") if t.strip()]
    root = os.path.join(args.output_dir, project)

    # Core folders
    mkdir(os.path.join(root, "00_input"))
    mkdir(os.path.join(root, "02_analyze-requirements"))

    # 03_test-cases -- subfolders theo test type da chon
    type_folder_map = {
        "Functional":  "functional",
        "Regression":  "regression",
        "Smoke":       "smoke",
        "UAT":         "uat",
        "Exploratory": "exploratory",
        "Performance": "performance",
        "API":         "api",
    }
    for tt in test_types:
        folder = type_folder_map.get(tt)
        if folder:
            mkdir(os.path.join(root, "03_test-cases", folder))
    # Luu y: ben trong moi folder loai test (functional/api/...) se co subfolder theo
    # tung module (mirror 1:1 voi 02_analyze-requirements/<module>/).
    # Cac subfolder module nay do gen-testcase-* tao on-demand khi sinh TC,
    # khong tao san o buoc init vi chua biet module nao.

    # 04_test-data
    mkdir(os.path.join(root, "04_test-data", "valid"))
    mkdir(os.path.join(root, "04_test-data", "invalid"))

    # CLAUDE.md
    write_file(os.path.join(root, "CLAUDE.md"),
               template_claude_md(project, version, test_types, envs, urls))

    # .gitkeep cho tat ca thu muc rong
    for dirpath, dirnames, filenames in os.walk(root):
        if not dirnames and not filenames:
            write_file(os.path.join(dirpath, ".gitkeep"), "")

    # Print result
    print("[OK] Project scaffolded: " + root)
    print("   Version      : " + version)
    print("   Environments : " + ", ".join(envs))
    print("   Test types   : " + ", ".join(test_types))
    print("\nFolder structure:")
    for dirpath, dirnames, filenames in sorted(os.walk(root)):
        level = dirpath.replace(root, "").count(os.sep)
        indent = "|   " * level
        basename = os.path.basename(dirpath)
        if level == 0:
            print("   " + project + "/")
        else:
            print("   " + indent + "+-- " + basename + "/")
        subindent = "|   " * (level + 1)
        for f in sorted(filenames):
            print("   " + subindent + "+-- " + f)


if __name__ == "__main__":
    main()
