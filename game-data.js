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
   圖片建議：寬 800px、WebP、每張 < 150KB、4:3
   ========================================================= */

/* 8 本書（id 請勿更改，後端紀錄與題庫都用 id 對應） */
const BOOKS = [
  {id:"coa",   short:"Moore's Clinically Oriented Anatomy 9e",               color:"#1f3a5f", abbr:"COA"},
  {id:"eca",   short:"Moore's Essential Clinical Anatomy 7e",                color:"#3f6ea8", abbr:"ECA"},
  {id:"grant", short:"Grant's Dissector 18e",                                color:"#7a4e2d", abbr:"GD"},
  {id:"gh",    short:"Gartner & Hiatt's Atlas and Text of Histology 8e",     color:"#8e3b6b", abbr:"G&H"},
  {id:"ahfc",  short:"Atlas of Histology with Functional Correlations 13e",  color:"#b0567f", abbr:"AH"},
  {id:"rubin", short:"Rubin's Pathology 8e",                                 color:"#a8323e", abbr:"RP"},
  {id:"sch",   short:"Schaechter's Mechanisms of Microbial Disease 6e",      color:"#2f8a6b", abbr:"MMD"},
  {id:"pharm", short:"Principles of Pharmacology 5e",                        color:"#d07a1f", abbr:"PP"}
];

/* 20 題題庫（目前圖片與連結為佔位，之後換成 Health Library 真實圖片與該圖連結） */
const BANK = [
  {id:1,  book:"coa",   cap:"臂神經叢分支示意圖",       img:"", link:"#"},
  {id:2,  book:"coa",   cap:"膝關節韌帶（前視圖）",     img:"", link:"#"},
  {id:3,  book:"coa",   cap:"冠狀動脈分布",             img:"", link:"#"},
  {id:4,  book:"eca",   cap:"腹腔器官相對位置",         img:"", link:"#"},
  {id:5,  book:"eca",   cap:"顱神經概覽",               img:"", link:"#"},
  {id:6,  book:"eca",   cap:"骨盆底肌群",               img:"", link:"#"},
  {id:7,  book:"grant", cap:"解剖步驟：胸壁切開",       img:"", link:"#"},
  {id:8,  book:"grant", cap:"解剖步驟：腋窩構造",       img:"", link:"#"},
  {id:9,  book:"grant", cap:"解剖步驟：前臂屈肌群",     img:"", link:"#"},
  {id:10, book:"gh",    cap:"複層鱗狀上皮切片",         img:"", link:"#"},
  {id:11, book:"gh",    cap:"骨骼肌橫切面",             img:"", link:"#"},
  {id:12, book:"gh",    cap:"腎絲球顯微構造",           img:"", link:"#"},
  {id:13, book:"ahfc",  cap:"肝小葉組織切片",           img:"", link:"#"},
  {id:14, book:"ahfc",  cap:"淋巴結皮質與髓質",         img:"", link:"#"},
  {id:15, book:"rubin", cap:"動脈粥狀硬化病灶",         img:"", link:"#"},
  {id:16, book:"rubin", cap:"急性發炎細胞浸潤",         img:"", link:"#"},
  {id:17, book:"sch",   cap:"細菌細胞壁結構比較",       img:"", link:"#"},
  {id:18, book:"sch",   cap:"病毒複製週期",             img:"", link:"#"},
  {id:19, book:"pharm", cap:"藥物動力學曲線",           img:"", link:"#"},
  {id:20, book:"pharm", cap:"自主神經受體與藥物作用點", img:"", link:"#"}
];

/* 現場模式「工作人員示範」提示（每題作答後輪流顯示） */
const BOOTH_TIPS = [
  "示範：點開圖片右上角，可直接「匯出到 PPT」，做報告超方便。",
  "示範：書中章節旁有教學影片，可邊看邊讀。",
  "示範：Self-Assessment 題庫可以考前自我檢測。",
  "示範：校外使用請透過圖書館 VPN／代理伺服器登入。",
  "示範：可用關鍵字搜尋跨 28 本書的內容。"
];
