// On-screen copy for Newcomer Level-Up Week #2, from the campaign brief (sections 5–7).
// Start time is 17:00 UTC+8 (= 09:00 UTC), per sections 2 and 7; the CN community post's "14:00" disagrees with both.
export type Lang = 'cn' | 'en';

type Level = {task: string; amount: number; plus?: boolean; label: string; note?: string; chip: string};

export const COPY: Record<Lang, {
  title1: string; title2: string; pool: string; hook: string; shout: string; power: string; upTo: (n: number) => string;
  levels: Level[]; endKicker: string; endBig: (n: number) => string; limit: string; dates: string;
  linkLabel: string; link: string; cta: string; fine: string;
}> = {
  cn: {
    title1: '新人',
    title2: '上分周',
    pool: '15,000 USDT 福利继续开抢！',
    hook: '第一期没赶上？第二期来了！',
    shout: '升级！',
    power: '奖励能量',
    upTo: (n) => `最高 ${n} USDT`,
    levels: [
      {task: '任务 1｜指定链接注册', amount: 5, label: '合约手续费\n抵扣券', chip: '手续费抵扣券'},
      {task: '任务 2｜注册 + 完成 KYC', amount: 5, label: '合约\n体验金', note: '与任务 1 不可叠加\n按最高档发放', chip: '合约体验金'},
      {task: '任务 3｜首次单笔合约交易 ≥100 USDT', amount: 10, plus: true, label: '额外合约\n体验金', chip: '额外合约体验金'},
    ],
    endKicker: '新人上分周 #2',
    endBig: (n) => `最高 ${n} USDT`,
    limit: '仅限前 1,000 位新用户 · 先到先得',
    dates: '9/29 17:00 — 10/9 23:59（UTC+8）',
    linkLabel: '指定注册链接',
    link: 'hotcoinv5.com/r/Hccommunity',
    cta: '立即上分',
    fine: '首单任务仅统计真实资金交易 · 奖励于活动结束后 7 个工作日内发放',
  },
  en: {
    title1: 'NEWCOMER',
    title2: 'LEVEL-UP WEEK',
    pool: '15,000 USDT UP FOR GRABS',
    hook: 'Missed round 1? Round 2 is here.',
    shout: 'LEVEL UP!',
    power: 'Reward power',
    upTo: (n) => `Up to ${n} USDT`,
    levels: [
      {task: 'STEP 1 · Register via the link', amount: 5, label: 'Futures fee\nvoucher', chip: 'Futures fee voucher'},
      {task: 'STEP 2 · Register + complete KYC', amount: 5, label: 'Futures\ntrial funds', note: 'Not combined with Step 1 —\nhighest reward applies', chip: 'Futures trial funds'},
      {task: 'STEP 3 · First Futures trade ≥100 USDT', amount: 10, plus: true, label: 'Extra futures\ntrial funds', chip: 'Extra trial funds'},
    ],
    endKicker: 'Newcomer Level-Up Week #2',
    endBig: (n) => `UP TO ${n} USDT`,
    limit: 'First 1,000 eligible new users only',
    dates: 'Sep 29, 09:00 — Oct 9, 15:59 (UTC)',
    linkLabel: 'Sign up via',
    link: 'hotcoin.com/r/Hccommunity',
    cta: 'LEVEL UP',
    fine: 'First trade must use real funds · Rewards sent within 7 business days after the campaign',
  },
};
