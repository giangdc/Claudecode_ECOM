# -*- coding: utf-8 -*-
"""Sync Playwright JSON report → TC Excel (Checkout). Backup ra _results/."""
import json, re, os, openpyxl
from openpyxl.styles import PatternFill, Font, Alignment, Border, Side

REPORT = "automation-framework/test-results/internet-checkout-report.json"
EXCEL  = "ecom-pdh/03_test-cases/functional/chucnang_checkout/AI_ISC_ecom-pdh_v1.1_TC_checkout_v1.0.xlsx"
RESULTS_DIR = "ecom-pdh/03_test-cases/_results"
DATE = "2026-06-02"
EXECUTOR = "Auto"
TCID_RE = re.compile(r'(?:TC_[A-Z0-9_]+\.\d+|API_\d+\.\d+)')

# ── 1. Parse report → {TC_ID: 'Pass'/'Fail'} ───────────────────────────────
results = {}
def walk(node):
    for s in node.get('suites', []): walk(s)
    for sp in node.get('specs', []):
        ids = TCID_RE.findall(sp.get('title', ''))
        status = 'Pass' if sp.get('ok') else 'Fail'
        for tid in ids:
            # Pass thắng nếu trùng (flaky retried pass)
            if results.get(tid) != 'Fail':
                results[tid] = status
            if status == 'Fail':
                results[tid] = 'Fail'
with open(REPORT, encoding='utf-8') as f:
    walk(json.load(f))
print("Report TC IDs:", len(results), "| Pass:", sum(v=='Pass' for v in results.values()), "Fail:", sum(v=='Fail' for v in results.values()))

# ── 2. Open Excel, fill per sheet ───────────────────────────────────────────
wb = openpyxl.load_workbook(EXCEL)
PASS_F = PatternFill("solid", fgColor="C6EFCE")
FAIL_F = PatternFill("solid", fgColor="FFC7CE")
BLOCK_F= PatternFill("solid", fgColor="FFEB9C")
thin = Side(style="thin", color="BFBFBF"); BORDER = Border(thin,thin,thin,thin) if False else Border(left=thin,right=thin,top=thin,bottom=thin)
WRAP = Alignment(wrap_text=True, vertical="top")
CTR  = Alignment(wrap_text=True, vertical="top", horizontal="center")

summary = {'Pass':0,'Fail':0,'Block':0,'block_autoN':0,'block_blocked':0,'block_notrun':0}
fails=[]; warnings=[]
matched_ids=set()

for ws in wb.worksheets:
    fid = ws['D3'].value
    # round header
    if not ws['I7'].value or 'Round 1' in str(ws['I7'].value):
        ws['I7'] = f"Round 1 — {DATE}"
    seq = 0
    for r in range(10, ws.max_row+1):
        d = ws.cell(r,4).value
        if not d:   # group header / empty
            continue
        seq += 1
        tcid = f"{fid}.{seq}"
        exp  = str(ws.cell(r,7).value or '')
        auto = str(ws.cell(r,8).value or '').strip().upper()
        result = note = ''; fill = None; bug=''
        if tcid in results:
            matched_ids.add(tcid)
            if results[tcid] == 'Pass':
                result, fill, note = 'Pass', PASS_F, f"Thực hiện tự động (Auto): {DATE}"
                summary['Pass']+=1
            else:
                result, fill = 'Fail', FAIL_F
                note = f"Thực hiện tự động (Auto): {DATE} — Fail (xem report)"
                summary['Fail']+=1; fails.append((ws.title,r,tcid))
        elif '[BLOCKED' in exp:
            result, fill, note = 'Block', BLOCK_F, "Block: [BLOCKED] - chờ BA confirm (xem Nội Dung/Expected)"
            summary['Block']+=1; summary['block_blocked']+=1
        elif auto == 'N':
            result, fill, note = 'Block', BLOCK_F, "Block: TC manual (Auto?=N) - chưa thực hiện trong run này, cần test tay"
            summary['Block']+=1; summary['block_autoN']+=1
        else:  # Auto?=Y nhưng không có trong run này
            result, fill, note = 'Block', BLOCK_F, "Block: Auto?=Y nhưng chưa tự động hóa trong run này (N/A trên Internet hoặc cần data backend — xem task_checkout.md)"
            summary['Block']+=1; summary['block_notrun']+=1
        ws.cell(r,9,result).fill=fill;  ws.cell(r,9).alignment=CTR; ws.cell(r,9).border=BORDER
        ws.cell(r,10,EXECUTOR).alignment=CTR; ws.cell(r,10).border=BORDER
        ws.cell(r,11,bug).alignment=CTR; ws.cell(r,11).border=BORDER
        ws.cell(r,12,note).alignment=WRAP; ws.cell(r,12).border=BORDER

# TC trong report nhưng không có trong Excel
for tid in results:
    if tid not in matched_ids:
        warnings.append(tid)

os.makedirs(RESULTS_DIR, exist_ok=True)
out = os.path.join(RESULTS_DIR, os.path.basename(EXCEL).replace('.xlsx', f'_results_{DATE}.xlsx'))
wb.save(out)

print("\n===== SYNC SUMMARY =====")
print(f"Excel: {out}")
print(f"Pass: {summary['Pass']} | Fail: {summary['Fail']} | Block: {summary['Block']}")
print(f"  Block breakdown: Auto?=N manual={summary['block_autoN']} | [BLOCKED]={summary['block_blocked']} | Auto=Y chưa chạy={summary['block_notrun']}")
print(f"Total filled: {summary['Pass']+summary['Fail']+summary['Block']}")
if fails:
    print("FAILS:"); [print('  ',t) for t in fails]
if warnings:
    print("WARN (report TC ID không có trong Excel):", warnings)
