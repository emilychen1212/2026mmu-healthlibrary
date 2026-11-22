# 圖鑑配對碰｜說明文件

馬偕醫學大學圖書館 × 飛資得醫學資訊「Health Library 基礎醫學探索挑戰」的遊戲頁。

| 網址 | 用途 |
|---|---|
| `game.html` | 在家模式（學生自己玩，通過可拿兌換碼＋抽獎資格） |
| `game.html?mode=booth` | 擺攤現場模式（工作人員用：現場 60 秒挑戰、兌換碼核銷、活動數據） |

首頁 `index.html` 的「立即開始作答」按鈕連到 `game.html`。

## 檔案

| 檔案 | 內容 |
|---|---|
| `game.html` | 遊戲主程式。最上方 `CONFIG` 是設定區 |
| `game-data.js` | 題庫：8 本書 `BOOKS`、20 題 `BANK`、現場示範提示 `BOOTH_TIPS` |
| `gas/Code.gs` | 後端（Google Apps Script），貼到 GAS 部署 |
| `images/game/` | 題目圖片 `fig01.webp` … `fig20.webp` |

## 一、建立後端（Google Sheet ＋ Apps Script）

1. 新增一份 Google 試算表，例如「圖鑑配對碰_紀錄」。
2. 在試算表點 **擴充功能 → Apps Script**。
3. 把 `gas/Code.gs` 的全部內容貼進編輯器（取代原本的 `myFunction`），按儲存。
4. 上方函式選單選 **setup**，按 **執行**。第一次會要求授權：選你的帳號 →「進階」→「前往（不安全）」→ 允許。
   執行完後試算表會多出兩個工作表：
   - `records`：每一局的紀錄
   - `config`：工作人員 PIN
5. 到 `config` 工作表，把 `STAFF_PIN` 那一列 B 欄改成你要的 PIN（建議 6 位數以上，不要用 1212）。
6. 回到 Apps Script，右上角 **部署 → 新增部署作業**：
   - 類型：**網頁應用程式**
   - 執行身分：**我**
   - 誰可以存取：**所有人**
   - 按「部署」，複製「網頁應用程式網址」（結尾是 `/exec`）。
7. 打開 `game.html`，把網址填進設定區：
   ```js
   GAS_URL: "https://script.google.com/macros/s/xxxxxxxx/exec",
   ```
8. 推上 GitHub，等 1–2 分鐘生效。

### 之後修改 Code.gs

改完要到 **部署 → 管理部署作業 → 編輯（鉛筆）→ 版本選「新版本」→ 部署**，網址才會維持不變。
若用「新增部署作業」，會產生新網址，要再改一次 `GAS_URL`。

### records 欄位

時間戳記｜模式(home/booth)｜姓名｜學校｜科系｜學號｜Email｜答對數｜總題數｜是否通過｜兌換碼｜抽到的題目ID｜點開原圖數｜是否已兌換｜兌換時間｜局ID

- 「局ID」是每一局的唯一編號。網路不穩時前端會重送，後端用局ID 避免同一局重複寫入、發兩組兌換碼。
- 每一局不論通過與否都會寫入。抽獎時可依「是否通過＝是」篩選，並以學號去重。

## 二、修改 PIN

直接改試算表 `config` 工作表的 `STAFF_PIN`，馬上生效，不用重新部署。
已登入的工作人員下次核銷或查數據時會被要求重新輸入。

PIN 只存在後端，不會出現在網頁原始碼裡。
（`game.html` 的 `LOCAL_TEST_PIN` 只在 `GAS_URL` 空白的本機測試模式使用。）

## 三、替換題目與圖片

題目都在 `game-data.js` 的 `BANK`，每題一行：

```js
{id:1, book:"coa", cap:"臂神經叢分支示意圖", img:"images/game/fig01.webp", link:"https://…（Health Library 原圖網址）"},
```

| 欄位 | 說明 |
|---|---|
| `id` | 題號，不可重複（畫面顯示 FIG 01） |
| `book` | 正確答案的書籍 id：`coa` `eca` `grant` `gh` `ahfc` `rubin` `sch` `pharm` |
| `cap` | 圖說，不要寫出書名 |
| `img` | 圖片路徑；留空 `""` 會顯示佔位圖 |
| `link` | Health Library 原圖頁網址（學生要點進去才看得到書名） |

**圖片建議規格：寬 800px、WebP、每張 < 150KB、比例 4:3。** 檔名 `fig01.webp` … `fig20.webp`，放在 `images/game/`。

題庫可以多於 20 題，每局會從全部題目隨機抽。
若修改每局題數（`HOME_COUNT`／`BOOTH_COUNT`），`gas/Code.gs` 上方的同名設定也要一起改並重新部署。

## 四、本機測試

`GAS_URL` 留空時，資料存在瀏覽器的 localStorage，所有功能（兌換碼、核銷、數據）都能在同一台電腦、同一個瀏覽器測試。本機測試 PIN 為 `1212`。
清除測試資料：瀏覽器開發者工具 → Application → Local Storage → 刪除 `mmuhl_game_records`。

## 五、規則摘要

- 在家模式：每局隨機 7 題，答對 ≥ 6 題（80%，`Math.ceil(7 × 0.8)`）通過；作答中不公布對錯，結算只顯示 ○／✕，不公布正解；未通過可無限重玩。
- 兌換碼格式 `MMU-XXXX`（排除 0／O／1／I／L），由後端產生並確認不重複；同一碼只能核銷一次。
- 現場模式：只填學號，隨機 5 題、限時 60 秒，作答後立即公布對錯與正解並顯示工作人員示範提示。
