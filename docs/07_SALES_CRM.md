# Uplora: Sales CRM & Pipeline Engine

## 1. 10-Stage Conversion Funnel
Uplora's sales process maps the path from undiscovered SMB merchant to paid client:

1. **Prospect**: Identified merchant with name, category, location, and potential gap.
2. **Contacted**: Initial outbound ping (WhatsApp message, Instagram DM, cold call initiated).
3. **Connected**: Two-way engagement established; merchant acknowledged communication.
4. **Interested**: Merchant validated pain point (e.g., desires better catalog, wants online orders).
5. **Qualified**: Confirmed budget, decision maker identified, timing aligned.
6. **Proposal**: Formal quote delivered (e.g., ₹8,500 website + WhatsApp catalog).
7. **Negotiation**: Reviewing terms, payment structure (e.g., 50% advance / 50% delivery).
8. **Won (Client)**: Deposit received, project initialized, XP minted!
9. **Lost**: Explicit rejection or unresponsive past threshold; reason logged for review.
10. **Follow-up**: Scheduled reminder for future re-engagement.

---

## 2. Lead Record Schema
Each lead tracks:
* **Business Metadata**: Business Name, Owner/Contact Person, Phone Number, WhatsApp Number (one-click direct chat launcher), Instagram Profile URL, Website URL (if any), City/Location, Category (e.g., Fashion, Grocery, Restaurant, Jewelry, Electronics).
* **Diagnostic Fields**: Problem Identified (e.g., "Only sells on Instagram stories, orders lost in DMs"), Proposed Uplora Solution ("StoreIK Storefront + WhatsApp Checkout"), Estimated Deal Value (₹).
* **Operational Fields**: Lead Source (Instagram, Google Maps, Referral, Cold Walk-in), Assigned Owner (Damo / Assistant), Status/Stage, Last Contacted Date, Next Follow-Up Date, Stage History & Notes.

---

## 3. Pipeline Metrics & Conversion Analytics
The CRM calculates in real-time:
* **Total Active Pipeline Value**: Sum of estimated values across stages (Contacted through Negotiation).
* **Weighted Pipeline Value**: Value weighted by historical conversion probabilities (Proposal = 60%, Qualified = 30%, etc.).
* **Conversion Ratios**:
  * Prospect $\rightarrow$ Connected
  * Connected $\rightarrow$ Proposal
  * Proposal $\rightarrow$ Won
* **Assistant Contribution Audit**: Weekly/Monthly leads added vs. qualified vs. closed by the ₹5,000/mo assistant, measuring return on payroll.
