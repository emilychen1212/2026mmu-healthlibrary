/* =========================================================
   圖鑑配對碰｜題庫資料
   替換題目只需改這個檔案，不用動 game.html。
   ---------------------------------------------------------
   BANK 每題欄位：
     id    題號（數字，不可重複；畫面顯示為 FIG 01、FIG 02…）
     book  正確答案的書籍 id（須是下方 BOOKS 的 id 之一）
     cap   圖說（顯示在圖片下方，不要寫出書名）
     img   圖片路徑，例："images/game/fig01.webp"；留空 "" 會顯示佔位圖
     link  Health Library 原圖網址（學生要點進去才知道出自哪本書）
   圖片建議：WebP、每張 < 150KB；寬度 520–800px，比例不限（畫面會完整顯示整張圖）
   ========================================================= */

/* 8 本書（id 請勿更改，後端紀錄與題庫都用 id 對應；2026-11-22 依「遊戲題目.xlsx」更新）
   每題只顯示 3 個選項：正確答案＋從其他書隨機抽 2 本（數量在 game.html 的 CONFIG.OPTION_COUNT） */
const BOOKS = [
  {id:"coa",   short:"Moore's Clinically Oriented Anatomy 10e",              color:"#1f3a5f", abbr:"COA"},
  {id:"eca",   short:"Moore's Essential Clinical Anatomy 7e",                color:"#3f6ea8", abbr:"ECA"},
  {id:"gaa",   short:"Grant's Atlas of Anatomy 16e",                         color:"#4b5f8f", abbr:"GAA"},
  {id:"grant", short:"Grant's Dissector 18e",                                color:"#7a4e2d", abbr:"GD"},
  {id:"gh",    short:"Gartner & Hiatt's Atlas and Text of Histology 8e",     color:"#8e3b6b", abbr:"G&H"},
  {id:"ahfc",  short:"Atlas of Histology with Functional Correlations 13e",  color:"#b0567f", abbr:"AH"},
  {id:"rubin", short:"Rubin's Pathology: Mechanisms of Human Disease 8e",    color:"#a8323e", abbr:"RP"},
  {id:"lwwa",  short:"Lippincott Williams & Wilkins Atlas of Anatomy 1e",    color:"#2f8a6b", abbr:"LWW"}
];

/* 20 題題庫（圖片：images/game/figNN.webp；cap 為 Health Library 圖說關鍵字） */
const BANK = [
  {id:1,  book:"eca",     cap:"Brachial plexus and subclavian vessels in lateral cervical region", img:"images/game/fig01.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=255685046&bookid=3243&resultClick=1#264883819"},
  {id:2,  book:"eca",     cap:"Triple coronary artery bypass", img:"images/game/fig02.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=255685699&bookid=3243&resultClick=1#agur7-agur-7-agur-ch004-bfig016"},
  {id:3,  book:"gaa",     cap:"Medial Aspect of Knee", img:"images/game/fig03.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=258094310&bookid=3319&resultClick=1#258094420"},
  {id:4,  book:"grant",   cap:"Nine abdominal regions", img:"images/game/fig04.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=258090429&bookid=3318&resultClick=1#detton-ch004-fig005"},
  {id:5,  book:"grant",   cap:"Boundaries and contents of lateral cervical region", img:"images/game/fig05.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=258091514&bookid=3318&resultClick=1#detton-ch007-fig006"},
  {id:6,  book:"gaa",     cap:"Ureter and Relationship to Uterine Artery", img:"images/game/fig06.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=258093982&bookid=3319&resultClick=1#258094032"},
  {id:7,  book:"gh",      cap:"Muscle spindle. Mouse. Electron microscopy", img:"images/game/fig07.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=253129083&bookid=3216&resultClick=1#253129205"},
  {id:8,  book:"gh",      cap:"Diagram displaying the connective tissue components of skeletal muscle", img:"images/game/fig08.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=253129083&bookid=3216&resultClick=1#253129091"},
  {id:9,  book:"ahfc",    cap:"Diagrammatic representation of the microscopic appearance of cardiac muscle", img:"images/game/fig09.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=249370402&bookid=2992&resultClick=1#249370450"},
  {id:10, book:"ahfc",    cap:"A section of the lung is illustrated in three dimensions and in transverse section", img:"images/game/fig10.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=249372044&bookid=2992&resultClick=1#249372050"},
  {id:11, book:"ahfc",    cap:"Three types of capillaries (transverse sections)", img:"images/game/fig11.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=249370824&bookid=2992&resultClick=1#249370848"},
  {id:12, book:"gaa",     cap:"Transverse Sections through Femur, Tibia, and Fibula", img:"images/game/fig12.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=258094310&bookid=3319&resultClick=1#258094319"},
  {id:13, book:"rubin",   cap:"Lymphoid progenitors give rise to mature but naive T lymphocytes", img:"images/game/fig13.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=231391137&bookid=2766&resultClick=1#231391195"},
  {id:14, book:"rubin",   cap:"Werner syndrome", img:"images/game/fig14.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=231395536&bookid=2766&resultClick=1#strayer8-strayer-8-strayer-ch010-fig005"},
  {id:15, book:"rubin",   cap:"Retinopathy of Prematurity Results From Oxygen Toxicity", img:"images/game/fig15.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?bookId=2766&sectionId=231406814&resultClick=1#266094442"},
  {id:16, book:"rubin",   cap:"Lower Urinary Tract", img:"images/game/fig16.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=231392375&bookid=2766&resultClick=1#231392922"},
  {id:17, book:"lwwa",    cap:"Surface Projection of the Heart and Mediastinum", img:"images/game/fig17.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=249252205&bookid=2982&resultClick=1#264900982"},
  {id:18, book:"coa",     cap:"Sections of limbs", img:"images/game/fig18.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=261961590&bookid=3480&resultClick=1#261961646"},
  {id:19, book:"coa",     cap:"Somatic and visceral innervation via spinal, splanchnic, and cranial nerves", img:"images/game/fig19.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?sectionid=261961590&bookid=3480&resultClick=1#261962001"},
  {id:20, book:"coa",     cap:"Internal cranial base and openings providing passage for cranial nerves", img:"images/game/fig20.webp", link:"https://integratedsciences.lwwhealthlibrary.com/content.aspx?bookId=3480&sectionId=261969586&resultClick=1#261969600"}
];

/* 現場模式「工作人員示範」提示（每題作答後輪流顯示） */
const BOOTH_TIPS = [
  "示範：點開圖片右上角，可直接「匯出到 PPT」，做報告超方便。",
  "示範：書中章節旁有教學影片，可邊看邊讀。",
  "示範：Self-Assessment 題庫可以考前自我檢測。",
  "示範：校外使用請透過圖書館 VPN／代理伺服器登入。",
  "示範：可用關鍵字搜尋跨 28 本書的內容。"
];
