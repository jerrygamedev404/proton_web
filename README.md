# Proton X50 / Proton Models MY — Extended (Next.js 14 + TS + Tailwind)

- 明亮 Fintech 主题、Hero 横幅轮播（文案覆盖、左右箭头、每张按钮可开关）
- 数据模型支持 `msrp_price_rm` / `promo_price_rm` / `promo_until` / `promo_note` / `sources`
- 车型详情带 Sticky 子导航、Region 价格说明、变体对比（最多 3 个）
- e.MAS 7 纯电加入；X50/X70/X90/S70/Persona/Iriz/Saga 价格更新至 2025-08-17（半岛马来西亚 OTR 不含保险）

## 开发
```bash
pnpm install
pnpm dev
```

## 数据
- `/public/data/models.json`：更新价格/版本/配备
- `/public/data/hero.json`：首页轮播每张卡开关按钮与链接

> 免责声明：价格与配备可能变动，请以官方为准（详情页与 /legal/price-note 已提示）。
