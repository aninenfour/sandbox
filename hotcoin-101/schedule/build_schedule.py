"""Builds the Hotcoin 101 series schedule workbook."""
import openpyxl
from datetime import datetime
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

INK = "17170F"
GREEN = "00C566"
GREEN_DEEP = "0B7A42"
PAPER = "EFE9DC"
PAPER_DEEP = "E4DCCB"

F = "Arial"

# file, pillar, title, hook, beats, key_fact, takeaway, tie_in
EP = [
("History","A Short History of Investing","Investing is 5,000 years older than the stock market.",
 "Grain loans in Uruk → shared voyages → VOC shares 1602 → the ticker 1867 → screens and 24/7 markets",
 "The Dutch East India Company (1602) was the first company with publicly tradable shares",
 "Every era solved one problem: move capital to someone who can use it and get paid for the risk.",
 "One account covering crypto, tokenized stocks and prediction markets"),
("Jargon","WAGMI, NGMI and the Rest","Crypto did not invent hype. It just gave it acronyms.",
 "WAGMI → NGMI → what each signals about positioning → why community language moves price",
 "WAGMI spread from crypto Twitter around 2021 and is now standard NFT and trading slang",
 "Slang is sentiment data. Learn to read it as positioning, not personality.",
 "Light logo end card only"),
("Trading","What a Candlestick Actually Tells You","A candle is four numbers wearing a costume.",
 "Open, high, low, close → body vs wick → what a long wick means → why timeframe changes the story",
 "Candlestick charting comes from 18th century Japanese rice traders",
 "A candle is a summary, not a signal. Read the timeframe before you read the shape.",
 "Charting available on Hotcoin spot and futures"),
("Crypto","What a Blockchain Actually Is","A blockchain is a spreadsheet nobody is allowed to edit alone.",
 "Ledger → blocks → consensus → why immutability is economic, not magical",
 "Bitcoin's genesis block was mined on 3 January 2009",
 "A blockchain does not remove trust. It moves trust from a company to a rule set.",
 "Light logo end card only"),
("TradFi","What a Stock Exchange Really Does","An exchange does not sell you shares. It matches you with someone leaving.",
 "Order matching → market makers → why spreads exist → settlement",
 "The NYSE traces to the 1792 Buttonwood Agreement signed by 24 brokers",
 "An exchange sells certainty of execution, not the asset itself.",
 "Same mechanics on Hotcoin spot books"),
("Risk","Position Sizing Beats Prediction","Most traders die of size, not of being wrong.",
 "Win rate vs size → the 1% rule → why one oversized trade erases ten good ones → sizing as the only variable you control",
 "A 50% drawdown requires a 100% gain just to break even",
 "You cannot control whether you are right. You can control how much it costs to be wrong.",
 "Risk controls and position limits on Hotcoin"),
("History","The First Bubble Had Tulips In It","In 1637 a single flower bulb cost more than a house.",
 "Tulip mania → forward contracts → the collapse → what actually repeated in later manias",
 "At the peak, rare tulip bulbs traded for several years of a craftsman's wages",
 "Bubbles are not about the asset. They are about the story that justifies the price.",
 "Light logo end card only"),
("Jargon","FUD, FOMO and the Two Moods of the Market","Every market has two emotions and a lot of vocabulary.",
 "FUD → FOMO → why both are trading signals → how to separate news from noise",
 "The 24 to 30 hour window is when most crypto news is fully priced in",
 "FUD and FOMO describe you, not the market. That is what makes them useful.",
 "Light logo end card only"),
("Crypto","Not Your Keys, Not Your Coins","There are only two ways to hold crypto, and both cost something.",
 "Self custody → exchange custody → the real trade-off is operational risk vs counterparty risk → who should use which",
 "Roughly 20% of all bitcoin is estimated to be permanently lost to inaccessible wallets",
 "Custody is a choice between losing your keys and trusting someone else with them.",
 "Hotcoin custody and withdrawal controls"),
("Trading","Market, Limit and Stop Orders","Three buttons. Most losses come from pressing the wrong one.",
 "Market order → limit order → stop and stop-limit → when each one hurts you",
 "In thin books a market order can fill several percent away from the last price",
 "Order type is a risk decision, not a convenience setting.",
 "All three order types on Hotcoin"),
("TradFi","What an Index Actually Measures","The S&P 500 is not the economy. It is 500 opinions about it.",
 "Index construction → weighting → survivorship → why the index is not the average company",
 "The S&P 500 is market cap weighted, so the largest names dominate its moves",
 "An index is a rule, not a fact. Read the rule before you read the number.",
 "Tokenized equity exposure on Hotcoin"),
("Risk","Leverage Is a Clock, Not a Multiplier","Leverage does not make you right faster. It makes you early fatally.",
 "Notional vs margin → liquidation price → funding cost → why time is the hidden variable",
 "At 20x leverage a 5% adverse move liquidates the position",
 "Leverage shortens the time your thesis is allowed to take.",
 "Advanced risk controls on Hotcoin futures"),
("History","How Paper Money Got Invented Twice","China printed money 700 years before Europe believed in it.",
 "Song dynasty jiaozi → Yuan paper currency → European banknotes → the same inflation lesson twice",
 "China issued the first government-backed paper currency in the 11th century",
 "Paper money is a technology for trust, and trust has always been the scarce part.",
 "Light logo end card only"),
("Crypto","Stablecoins, Explained","A stablecoin is a promise with a balance sheet behind it. Or not.",
 "Fiat-backed → overcollateralized → algorithmic → why the peg is a claim, not a law",
 "Terra's UST peg failed in May 2022, erasing tens of billions in days",
 "A stablecoin is only as stable as the thing standing behind it.",
 "Stablecoin pairs on Hotcoin"),
("Jargon","Whale, Shrimp, Bagholder","The market has a whole zoo and you are probably in it.",
 "Whale → shrimp → bagholder → why the labels describe behaviour, not wealth",
 "On most chains a small number of addresses hold a large majority of supply",
 "The zoo is a way of talking about concentration. Concentration is a risk factor.",
 "Light logo end card only"),
("Trading","Liquidity: Noticed Only When It Is Gone","Price is an opinion. Liquidity decides if you can act on it.",
 "Depth → spread → slippage → why liquidity vanishes exactly when you need it",
 "Order book depth typically thins sharply during high volatility",
 "Liquidity is the difference between a price and a fill.",
 "Deep books and market making on Hotcoin"),
("TradFi","Bonds, or Lending to a Government","The most boring asset on earth sets the price of everything else.",
 "Coupon → yield → price and yield move opposite → why the 10 year matters to crypto",
 "Bond prices fall when yields rise, and the relationship is mechanical",
 "The risk-free rate is the gravity every other asset is priced against.",
 "Macro calendar coverage on Hotcoin"),
("Risk","Risk of Ruin: The Maths of Blowing Up","Lose 50% and you need 100% just to get back.",
 "Drawdown maths → sequence of losses → why survival compounds → the practical fix",
 "A 70% drawdown requires a 233% gain to recover",
 "Staying solvent is not conservative. It is the whole strategy.",
 "Risk controls on Hotcoin"),
("History","A Market That Started Under a Tree","24 brokers, one tree, and the beginning of Wall Street.",
 "Buttonwood Agreement 1792 → fixed commissions → the exchange building → the floor's slow death",
 "The Buttonwood Agreement was signed by 24 brokers in New York in 1792",
 "Every exchange begins as a private agreement about who gets to trade.",
 "Light logo end card only"),
("Crypto","Gas, Blockspace and Why Moving Costs Money","You are not paying a bank. You are bidding for space.",
 "Blockspace as a scarce good → auction dynamics → why fees spike → layer 2 relief",
 "Ethereum gas fees are set by demand for limited space in each block",
 "Fees are not a tax. They are an auction you are participating in.",
 "Withdrawal fee structure on Hotcoin"),
("Jargon","Ape, Rug, Degen","Some crypto words are jokes. Some are warnings dressed as jokes.",
 "Ape in → rug pull → degen → what each term is actually describing in risk terms",
 "Rug pulls accounted for a large share of crypto scam losses in recent years",
 "When a community jokes about a risk constantly, the risk is real.",
 "Listing and review process at Hotcoin"),
("Trading","Support and Resistance Without the Mysticism","Lines on a chart are not magic. They are memory.",
 "Where levels come from → why they work → why they break → how to use them without worshipping them",
 "Levels matter because participants place orders at round and remembered prices",
 "A level is a place where people previously made decisions. That is all, and it is enough.",
 "Charting tools on Hotcoin"),
("TradFi","What a Broker Does With Your Order","Your order does not go straight to the exchange. Not always.",
 "Routing → internalization → payment for order flow → what best execution means",
 "Payment for order flow is banned in some jurisdictions and permitted in others",
 "Know who is on the other side of your order, and how they are paid.",
 "Transparent order routing on Hotcoin"),
("Risk","Most Portfolios Are One Bet in Disguise","You own eleven things and one risk.",
 "Correlation → factor exposure → why crypto portfolios cluster → practical diversification",
 "Most large-cap altcoins have historically shown high correlation to $BTC",
 "Diversification is about correlated risk, not the number of tickers.",
 "Multi-asset access on Hotcoin"),
("History","The 1929 Crash Was a Margin Story","Everyone remembers the crash. Few remember it was bought on credit.",
 "Margin buying in the 1920s → the call → forced selling → the reforms that followed",
 "Investors could buy stock with as little as 10% down before 1929",
 "Leverage does not cause bubbles. It decides how fast they end.",
 "Risk limits on Hotcoin futures"),
("Crypto","Proof of Work vs Proof of Stake","Two ways to make lying expensive.",
 "PoW energy cost → PoS capital cost → security assumptions → the real trade-offs",
 "Ethereum moved from proof of work to proof of stake in September 2022",
 "Both systems buy the same thing: the cost of attacking the network.",
 "Staking products on Hotcoin"),
("Jargon","HODL: The Typo That Became a Strategy","One forum post in 2013 named an entire philosophy.",
 "The original post → why it stuck → holding as a strategy → when it is the wrong one",
 "The word came from a misspelled 'hold' in a December 2013 forum post",
 "Holding is a strategy only when you can say what would change your mind.",
 "Light logo end card only"),
("Trading","Funding Rates: The Rent on Your Opinion","In perpetual futures, you pay to keep an opinion open.",
 "What funding is → who pays whom → why it flips → reading it as positioning data",
 "Perpetual futures use funding payments to keep the contract near spot price",
 "Funding is the market telling you which side is crowded.",
 "Funding rates visible on Hotcoin futures"),
("TradFi","Dividends and Buybacks","Two ways a company pays you. One is taxed differently.",
 "Dividend mechanics → buyback mechanics → why buybacks grew → what each signals",
 "US buybacks overtook dividends as the main way large firms return cash",
 "Both return cash. Only one asks your permission to be taxed.",
 "Tokenized equity exposure on Hotcoin"),
("Risk","Being Early Costs the Same as Being Wrong","Timing risk is just risk with better excuses.",
 "The thesis was right, the timing was not → margin and time → sizing for duration → the fix",
 "Positions financed with leverage can be liquidated long before a thesis plays out",
 "A correct call you could not hold is indistinguishable from a wrong one.",
 "Spot vs futures choice on Hotcoin"),
("History","The Day Money Stopped Being Gold","In 1971 the dollar quietly stopped being a receipt.",
 "Bretton Woods → the gold window → the Nixon shock → the world of floating currency",
 "The US ended dollar convertibility into gold in August 1971",
 "Since 1971, money has been a shared agreement rather than a claim on metal.",
 "Light logo end card only"),
("Crypto","How to Read an Order Book","Every price you see is two queues arguing.",
 "Bids and asks → depth → the spread → why the top of book is not the whole story",
 "The visible spread often understates true cost once size is included",
 "The order book is the only honest thing on the screen.",
 "Full depth view on Hotcoin"),
("Jargon","Alpha, Beta and Edge","Three words traders use to ask one question: am I actually good?",
 "Beta as market exposure → alpha as the rest → edge as repeatability → why most alpha is hidden beta",
 "Most retail outperformance in bull markets is beta, not alpha",
 "If it disappears when the market stops rising, it was never alpha.",
 "Copy trading performance data on Hotcoin"),
("Trading","Copy Trading, Explained Honestly","Copying a trader means copying their risk, not just their entries.",
 "How copy trading works → why drawdown matters more than returns → sizing → what to check first",
 "A strategy's maximum drawdown is a better filter than its total return",
 "Copy the risk profile you can survive, not the return you want.",
 "Copy trading with top providers on Hotcoin"),
("TradFi","Tokenized Stocks: What You Actually Own","A tokenized share is a claim, and the claim is the product.",
 "The wrapper → the issuer → what rights transfer → what does not",
 "Tokenized equity products give price exposure without traditional share registry ownership",
 "With tokenized assets, read who owes you what before you read the chart.",
 "Tokenized US stocks on Hotcoin"),
("Risk","Drawdown Is a Feeling Before It Is a Number","Most people quit a strategy at the exact worst moment.",
 "Drawdown depth → duration → behavioural response → planning for it in advance",
 "Strategy abandonment tends to peak near the trough of a drawdown",
 "Decide what you will do in a drawdown before you are in one.",
 "Risk dashboards on Hotcoin"),
("History","From Ticker Tape to Fibre Optics","Finance has spent 150 years buying milliseconds.",
 "1867 ticker → telephone → electronic quotes → microwave towers and colocation",
 "The stock ticker was introduced in 1867 and cut news delay from days to minutes",
 "Every generation of market technology sold the same product: less delay.",
 "Matching engine performance at Hotcoin"),
("Crypto","Wallets: Hot, Cold and In Between","A wallet does not hold coins. It holds permission.",
 "Keys vs coins → hot wallet → cold wallet → multisig and the practical middle",
 "Crypto wallets store private keys, while balances live on the chain",
 "You are not storing money. You are storing the ability to move it.",
 "Wallet and withdrawal security on Hotcoin"),
("Jargon","Pump, Dump and Wash Trading","Three old crimes with new vocabulary.",
 "Pump groups → wash trading → fake volume → how to spot manufactured activity",
 "Wash trading inflates reported volume without changing beneficial ownership",
 "If the volume has no order book behind it, the volume is a costume.",
 "Real volume and surveillance at Hotcoin"),
("Trading","Spot vs Futures","One buys the thing. One buys an argument about the thing.",
 "Ownership vs contract → leverage → funding → when each is appropriate",
 "Perpetual futures have no expiry, unlike traditional futures contracts",
 "Spot is a position. Futures is a position with a deadline attached.",
 "Spot and futures in one Hotcoin account"),
("TradFi","How a Company Goes Public","An IPO is the moment private risk becomes public property.",
 "Underwriting → book building → the pop → lockups",
 "IPO allocations are typically distributed by underwriters, not on the open market",
 "The IPO price is negotiated. The first trade is the first honest number.",
 "Tokenized equity access on Hotcoin"),
("Risk","Correlation Goes to One When It Matters","Diversification works right up until the day you need it.",
 "Normal correlation → crisis correlation → why assets converge → what actually diversifies",
 "In March 2020 most asset classes fell together before recovering separately",
 "Test a portfolio against a bad week, not an average year.",
 "Multi-asset access on Hotcoin"),
("History","Prediction Markets Are Older Than Polling","People bet on elections in New York before anyone polled them.",
 "Wall Street election betting → the polling era → modern prediction markets → why prices beat opinions",
 "Large election betting markets operated on Wall Street from the 1880s to the 1930s",
 "A market makes people pay for their opinion. That is why it is informative.",
 "Prediction market on Hotcoin"),
("Crypto","What a Smart Contract Can and Cannot Do","Code can hold money. It cannot hold intent.",
 "Deterministic execution → oracles → the limits → why exploits are logic, not hacking",
 "Most large DeFi exploits target contract logic rather than cryptography",
 "A smart contract does exactly what it says, which is rarely what you meant.",
 "Light logo end card only"),
("Jargon","TVL, Market Cap and Numbers People Misuse","Market cap is not money that went in.",
 "Market cap maths → circulating vs total supply → TVL double counting → better metrics",
 "Market cap equals price times circulating supply, not capital invested",
 "Every headline number has a denominator. Check it before you quote it.",
 "Light logo end card only"),
("Trading","Slippage, Spread and the Invisible Fee","The fee you see is rarely the fee you pay.",
 "Explicit fees → spread → slippage → market impact",
 "For large orders, market impact usually exceeds the stated trading fee",
 "Total cost is fee plus spread plus impact. Only one is advertised.",
 "Fee schedule on Hotcoin"),
("TradFi","What Central Banks Actually Control","A central bank sets one rate and hopes the rest follow.",
 "Policy rate → transmission → balance sheet → why crypto reacts to CPI and Fed days",
 "Central banks set short-term rates directly and influence longer rates indirectly",
 "Central banks set the price of time. Everything else is priced off it.",
 "Macro calendar on Hotcoin"),
("Risk","Why Backtests Lie","Every strategy is profitable in a world that already happened.",
 "Overfitting → survivorship → look-ahead bias → walk-forward testing",
 "Backtests that use the full dataset for tuning routinely overstate live results",
 "A backtest is a hypothesis, not evidence.",
 "Strategy tools on Hotcoin"),
("History","The First Index Fund Was Mocked for Years","In 1976 buying the whole market was called un-American.",
 "Vanguard's launch → the criticism → the slow win → what it proved about fees",
 "Vanguard launched the first retail index fund in 1976 and raised far less than targeted",
 "The cheapest version of an idea usually wins, eventually.",
 "Fee transparency on Hotcoin"),
("Crypto","Bridges and Where the Risk Hides","Most big crypto losses did not happen on a chain. They happened between two.",
 "Why bridges exist → lock and mint → the attack surface → safer patterns",
 "Cross-chain bridges have been among the largest single loss events in crypto",
 "The risk is not in the chains. It is in the seam between them.",
 "Deposits and withdrawals on Hotcoin"),
("Jargon","GM, Ser, Anon: The Culture Layer","Crypto talks in a dialect. Here is the phrasebook.",
 "gm → ser → anon → why pseudonymity shapes the language",
 "Crypto communities largely operate under pseudonymous identity by default",
 "The dialect is a membership test. Knowing it is not the same as understanding the market.",
 "Light logo end card only"),
("Trading","Risk-Reward Is a Ratio, Not a Vibe","A 30% win rate can be very profitable. A 70% one can bankrupt you.",
 "Expectancy → R multiples → why win rate alone is meaningless → worked example",
 "Expectancy combines win rate and average win/loss size, not win rate alone",
 "Ask what you win when right and lose when wrong, before asking how often you are right.",
 "Risk tools on Hotcoin"),
("TradFi","Commodities and Why Oil Has a Calendar","Oil is not one price. It is a queue of future prices.",
 "Spot vs futures curve → contango and backwardation → storage → why ETFs bleed",
 "In April 2020 the front month WTI contract briefly settled below zero",
 "In commodities the curve is the product, not the spot price.",
 "Macro coverage on Hotcoin"),
("Risk","Journaling: The Cheapest Edge Available","The market keeps records. Most traders do not.",
 "What to log → reviewing weekly → spotting the repeated mistake → turning it into a rule",
 "Traders who review logged decisions identify repeated errors far faster",
 "You cannot fix a pattern you never wrote down.",
 "Trade history export on Hotcoin"),
("History","Every Crash Rhymes","1637, 1929, 2000, 2008, 2022. Five crashes, one script.",
 "New technology or asset → leverage → a story that justifies any price → the margin call",
 "Each of these episodes combined a new asset narrative with expanding credit",
 "The asset changes every time. The leverage never does.",
 "Risk controls on Hotcoin"),
("Crypto","Prediction Markets, Explained","A prediction market prices probability instead of profit.",
 "How contracts settle → reading a price as a probability → why they aggregate information → limits",
 "In a binary prediction market a price of 0.62 implies roughly a 62% chance",
 "A prediction market turns opinions into prices, and prices into information.",
 "Prediction market on Hotcoin"),
("Jargon","Cope, Exit Liquidity, NGMI","The vocabulary of losing, and what it hides.",
 "Cope → exit liquidity → ngmi → why the joke is usually a confession",
 "Retail inflows often peak near local price tops",
 "When the community starts joking about being exit liquidity, check your own position.",
 "Light logo end card only"),
("Trading","A Trading Plan That Fits on One Page","If it does not fit on one page you will not follow it.",
 "Market and timeframe → setup → risk per trade → exit rules → review cadence",
 "Written rules measurably reduce discretionary deviation under stress",
 "A plan you actually follow beats a better plan you do not.",
 "Order and risk tools on Hotcoin"),
("TradFi","Fees Compound Too","1% a year for 30 years costs roughly a quarter of the outcome.",
 "Fee drag maths → why it is invisible → comparing total cost → the practical check",
 "A 1% annual fee over 30 years can consume around a quarter of final value",
 "Fees are the only return you can predict with certainty.",
 "Fee schedule on Hotcoin"),
("History","What Comes After the Exchange","Every era thought its market structure was final.",
 "Floor → screen → internet broker → 24/7 on-chain settlement → what is still missing",
 "Crypto markets trade continuously, unlike session-based traditional exchanges",
 "Market structure is not a destination. It is the current answer to an old question.",
 "All of it in one Hotcoin account"),
]

X_TEMPLATE = "{hook}\n\n{beats}\n\n{takeaway}"

wb = openpyxl.Workbook()

# ---------------------------------------------------------------- CONFIG
cfg = wb.active
cfg.title = "Config"
cfg["A1"] = "HOTCOIN 101 — SERIES CONTROL"
cfg["A1"].font = Font(name=F, size=16, bold=True, color=INK)
rows = [
    ("Series name", "Hotcoin 101"),
    ("Strapline", "Money, explained"),
    ("Episodes planned", len(EP)),
    ("Cadence (days between posts)", 1.5),
    ("First publish (local, Asia/Shanghai)", datetime(2026, 8, 26, 20, 0)),
    ("Formats rendered", "9:16 (1080x1920) and 16:9 (1920x1080)"),
    ("Runtime target", "60 to 80 seconds"),
    ("Frame rate", 30),
    ("Audio", "None baked in. Music and VO added in CapCut."),
    ("Brand green (confirm vs logo)", "#00C566"),
    ("Paper base", "#EFE9DC"),
    ("Ink", "#17170F"),
    ("Display face", "Newsreader"),
    ("UI face", "Inter"),
    ("Mono face", "IBM Plex Mono"),
]
for i, (k, v) in enumerate(rows, start=3):
    cfg.cell(i, 1, k).font = Font(name=F, size=10, bold=True)
    c = cfg.cell(i, 2, v)
    c.font = Font(name=F, size=10, color="0000FF")
    if isinstance(v, datetime):
        c.number_format = "yyyy-mm-dd hh:mm"
cfg.cell(3 + len(rows) + 1, 1, "Blue cells are inputs. Schedule dates recalculate from the first publish date and the cadence.").font = Font(name=F, size=9, italic=True, color="808080")
cfg.column_dimensions["A"].width = 34
cfg.column_dimensions["B"].width = 46

# ---------------------------------------------------------------- SCHEDULE
sh = wb.create_sheet("Schedule")
headers = ["#", "File", "Publish (local)", "Weekday", "Pillar", "Title", "Hook (cold open)",
           "Beat outline", "Key fact to verify", "Takeaway", "Hotcoin tie-in",
           "X post copy", "Formats", "Render command", "Status"]
widths = [5, 10, 20, 11, 12, 34, 46, 56, 44, 46, 30, 58, 16, 62, 12]
for j, h in enumerate(headers, start=1):
    c = sh.cell(1, j, h)
    c.font = Font(name=F, size=10, bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor=GREEN_DEEP)
    c.alignment = Alignment(vertical="center", wrap_text=True)
    sh.column_dimensions[get_column_letter(j)].width = widths[j - 1]
sh.row_dimensions[1].height = 30
sh.freeze_panes = "C2"

thin = Side(style="thin", color="D9D2C2")
border = Border(left=thin, right=thin, top=thin, bottom=thin)

for i, (pillar, title, hook, beats, fact, takeaway, tie) in enumerate(EP, start=1):
    r = i + 1
    file_no = f"FILE {i:03d}"
    slug = title.lower().replace(",", "").replace(":", "").replace("'", "").replace(" ", "-")
    sh.cell(r, 1, i)
    sh.cell(r, 2, file_no)
    # publish datetime = first publish + (n-1) * cadence days
    sh.cell(r, 3, f"=Config!$B$7+({i}-1)*Config!$B$6")
    sh.cell(r, 3).number_format = "yyyy-mm-dd hh:mm"
    sh.cell(r, 4, f'=TEXT(C{r},"ddd")')
    sh.cell(r, 5, pillar)
    sh.cell(r, 6, title)
    sh.cell(r, 7, hook)
    sh.cell(r, 8, beats)
    sh.cell(r, 9, fact)
    sh.cell(r, 10, takeaway)
    sh.cell(r, 11, tie)
    sh.cell(r, 12, X_TEMPLATE.format(hook=hook, beats="→ " + beats.replace(" → ", "\n→ "), takeaway=takeaway))
    sh.cell(r, 13, "9:16 + 16:9")
    sh.cell(r, 14, f"Build {file_no} then render {slug}-vertical and {slug}-horizontal")
    sh.cell(r, 15, "Rendered" if i == 1 else "Planned")
    for j in range(1, 16):
        cell = sh.cell(r, j)
        cell.font = Font(name=F, size=9)
        cell.alignment = Alignment(vertical="top", wrap_text=True)
        cell.border = border
        if i % 2 == 0:
            cell.fill = PatternFill("solid", fgColor="FAF7F0")
    sh.cell(r, 2).font = Font(name=F, size=9, bold=True)
    sh.cell(r, 5).font = Font(name=F, size=9, bold=True, color=GREEN_DEEP)
    sh.cell(r, 6).font = Font(name=F, size=10, bold=True)
    sh.row_dimensions[r].height = 92

# summary block
last = len(EP) + 1
s = last + 2
sh.cell(s, 6, "Series runs")
sh.cell(s, 7, f"=TEXT(C2,\"yyyy-mm-dd\")&\" to \"&TEXT(C{last},\"yyyy-mm-dd\")")
sh.cell(s + 1, 6, "Episodes")
sh.cell(s + 1, 7, f"=COUNTA(B2:B{last})")
sh.cell(s + 2, 6, "Rendered")
sh.cell(s + 2, 7, f'=COUNTIF(O2:O{last},"Rendered")')
sh.cell(s + 3, 6, "Remaining")
sh.cell(s + 3, 7, f"=B{s+1}-B{s+2}")
sh.cell(s + 3, 7).value = f"=G{s+1}-G{s+2}"
for rr in range(s, s + 4):
    sh.cell(rr, 6).font = Font(name=F, size=10, bold=True)
    sh.cell(rr, 7).font = Font(name=F, size=10)

# ---------------------------------------------------------------- PILLARS
pl = wb.create_sheet("Pillars")
pl["A1"] = "SERIES PILLARS"
pl["A1"].font = Font(name=F, size=14, bold=True)
pdata = [
    ("History", "Where a market mechanism came from and what it solved", "Serious, documentary", "Archive plates, timelines"),
    ("Crypto", "How crypto infrastructure actually works", "Plain, technical, no hype", "Diagrams, order books"),
    ("TradFi", "How traditional finance works and why crypto copied it", "Analytical", "Comparisons, charts"),
    ("Trading", "Mechanics a trader uses on any venue", "Practical", "Charts, order types"),
    ("Jargon", "Crypto and trading slang decoded", "Light, dry humour", "Glossary cards"),
    ("Risk", "Position sizing, drawdown, psychology", "Direct, slightly blunt", "Numbers, stat cards"),
]
for j, h in enumerate(["Pillar", "What it covers", "Tone", "Visual devices"], start=1):
    c = pl.cell(3, j, h)
    c.font = Font(name=F, size=10, bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor=GREEN_DEEP)
for i, row in enumerate(pdata, start=4):
    for j, v in enumerate(row, start=1):
        c = pl.cell(i, j, v)
        c.font = Font(name=F, size=10)
        c.alignment = Alignment(wrap_text=True, vertical="top")
for col, w in zip("ABCD", [16, 52, 26, 30]):
    pl.column_dimensions[col].width = w
pl.cell(11, 1, "Count by pillar")
pl.cell(11, 1).font = Font(name=F, size=10, bold=True)
for i, row in enumerate(pdata, start=12):
    pl.cell(i, 1, row[0]).font = Font(name=F, size=10)
    pl.cell(i, 2, f'=COUNTIF(Schedule!$E$2:$E${len(EP)+1},A{i})').font = Font(name=F, size=10)

# ---------------------------------------------------------------- COMMANDS
cm = wb.create_sheet("Commands")
cm["A1"] = "HOW TO BRIEF CLAUDE ON THIS SERIES"
cm["A1"].font = Font(name=F, size=14, bold=True)
cm["A2"] = "Copy a line, paste it into the chat, edit the bits in CAPS."
cm["A2"].font = Font(name=F, size=10, italic=True, color="808080")
cdata = [
    ("Make the next episode", "Build FILE 0NN from the schedule. Render 9:16 and 16:9.",
     "Pulls title, hook, beats and takeaway straight from this sheet."),
    ("Make an episode off-schedule", "New episode: PILLAR, title TITLE, hook HOOK. Same series style. Render both formats.",
     "Use for reactive or news-pegged episodes."),
    ("Change the script only", "Rewrite the beats for FILE 0NN: DESCRIBE THE CHANGE. Re-render both formats.",
     "Script lives in one data file per episode, so this is cheap."),
    ("Change the look series-wide", "Update the series tokens: CHANGE. Re-render FILE 0NN as a check.",
     "Colours, fonts, paper texture and safe areas all live in one tokens file."),
    ("Swap in the real logo", "Here is the Hotcoin logo file. Wire it into the series chrome.",
     "Drops into public/ and replaces the placeholder mark everywhere."),
    ("Add a new scene type", "Add a new beat type called NAME that shows DESCRIPTION.",
     "Beat types are reusable across all future episodes."),
    ("Preview before rendering", "Show me stills of FILE 0NN before you render the video.",
     "Fast. Stills take seconds, a full render takes minutes."),
    ("Change the pace", "Make FILE 0NN NN seconds total and rebalance the beats.",
     "Each beat has a seconds value in the script."),
    ("Batch a week", "Build FILE 0NN through FILE 0NN and render all of them in 9:16.",
     "Roughly 6 minutes of render per vertical episode."),
    ("Get the post copy", "Give me the X, Instagram and LinkedIn copy for FILE 0NN.",
     "Follows the Hotcoin format: cashtags on X, dot keywords on IG, arrows not bullets."),
    ("Change the schedule", "Shift the series to start on DATE at TIME, cadence N days.",
     "Only the two blue Config cells change, every date recalculates."),
    ("Add Chinese", "Produce FILE 0NN in Chinese as well.",
     "Needs a CJK font added to the bundle first."),
]
for j, h in enumerate(["Situation", "What to type", "Notes"], start=1):
    c = cm.cell(4, j, h)
    c.font = Font(name=F, size=10, bold=True, color="FFFFFF")
    c.fill = PatternFill("solid", fgColor=GREEN_DEEP)
for i, row in enumerate(cdata, start=5):
    for j, v in enumerate(row, start=1):
        c = cm.cell(i, j, v)
        c.font = Font(name=F, size=10)
        c.alignment = Alignment(wrap_text=True, vertical="top")
    cm.row_dimensions[i].height = 34
for col, w in zip("ABC", [30, 68, 52]):
    cm.column_dimensions[col].width = w

# ---------------------------------------------------------------- STYLE
st = wb.create_sheet("Style Bible")
st["A1"] = "HOTCOIN 101 — VISUAL RULES"
st["A1"].font = Font(name=F, size=14, bold=True)
sdata = [
    ("Surface", "Archival paper. Warm off-white, live film grain, faint letterpress grid, printer registration marks in the corners."),
    ("Ink", "Near black text. Nothing pure black, nothing pure white."),
    ("Accent", "Hotcoin green, used only for: the logo dot, one rule per page, figure numbers, the highlight marker, the progress bar, and up candles."),
    ("Type", "Newsreader for statements. Inter for explanation. IBM Plex Mono for labels, years and captions."),
    ("Chrome", "Every frame carries the same header rail (mark, HOTCOIN 101, pillar, file number) and a green progress rule at the bottom. This is what makes episodes recognisable in a feed."),
    ("Motion", "Ink rise on text, pen draw on illustrations, paper shift between pages. No slides, no zooms, no glow."),
    ("Illustration", "Procedural line engravings inside a bordered plate with FIG. NN captions. No stock imagery, no 3D, no neon."),
    ("Structure", "Cold open hook, title card, four to six figure or data beats, one comparison, one stat, takeaway. Always standalone, never references another episode."),
    ("Promotion", "One Hotcoin line in the closing frame and at most one product mention inside the body. Never a first-person brand voice."),
    ("Formats", "9:16 for Reels, TikTok, Shorts and X vertical. 16:9 for YouTube, LinkedIn and X landscape. Same script, layout adapts."),
    ("Safe areas", "Vertical keeps the top 19% and bottom 25% clear of key text so platform UI never covers it."),
    ("Audio", "Rendered silent by design. Music bed and optional VO added in CapCut so one render serves several audio variants."),
]
for i, (k, v) in enumerate(sdata, start=3):
    a = st.cell(i, 1, k)
    a.font = Font(name=F, size=10, bold=True)
    a.alignment = Alignment(vertical="top")
    b = st.cell(i, 2, v)
    b.font = Font(name=F, size=10)
    b.alignment = Alignment(wrap_text=True, vertical="top")
    st.row_dimensions[i].height = 42
st.column_dimensions["A"].width = 18
st.column_dimensions["B"].width = 104

wb.save("/home/claude/hotcoin-101/schedule/Hotcoin-101-series-schedule.xlsx")
print("saved", len(EP), "episodes")
