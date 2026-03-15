# Proton Dealer Landing Site

一个基于 Next.js 14 的 Proton 经销商静态官网，当前定位是“车型展示 + 线索收集”的落地页，而不是完整的车型详情站。

## 当前目标

- 在首页展示 Proton 车型与卖点
- 通过 `Inquiry`、`Booking`、WhatsApp 跳转收集销售线索
- 用静态资源和 JSON 数据驱动内容，方便非开发改价、换图、改联系方式
- 以静态导出方式部署到任意静态托管平台

## 当前页面

- `/`
  - 全屏 Hero
  - Featured Vehicles 车型卡片
  - Featured Carousel 车型轮播
  - Services 服务介绍
  - Footer 联系方式与免责声明
- `/contact`
  - 门店联系方式
  - WhatsApp 快速预约表单

## 数据来源

主要内容来自 `public/data/`：

- `public/data/models.json`
  - 车型名称、价格、亮点、图片、标签、PDF 手册链接等
- `public/data/site.json`
  - 公司名称、地址、电话、WhatsApp、Instagram、营业时间、地图链接

当前代码主链路实际使用的是 `models.json` 和 `site.json`。  
`hero.json`、`home_highlights.json` 仍在仓库中，但目前未接入现有首页。

## 当前车型

当前 `models.json` 中实际启用的车型：

- Saga
- X50
- X70
- X90
- S70

注意：历史文档里提到的 `e.MAS 7`、`Persona`、`Iriz` 当前并不在现有数据中。

## 技术栈

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

## 开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

项目已配置为静态导出：

- `next.config.js` 使用 `output: 'export'`
- 图片使用 `images.unoptimized: true`

构建结果会输出为静态站点，可部署到 S3/CDN、Netlify、Vercel Static、Nginx 等环境。

## 当前代码现状

当前路由已经收敛到：

- `/`
- `/contact`

仓库里仍保留部分历史迁移或未接回主线的组件，例如：

- 旧多语言相关组件
- 旧版 Hero / Highlights 数据组件
- 价格标签 / 区域价格说明组件
- 为车型详情页准备的数据字段

这些代码说明项目原本计划做更完整的车型站，但目前线上主需求仍是经销商落地页。

## 建议维护方式

- 改车型和价格：编辑 `public/data/models.json`
- 改门店信息：编辑 `public/data/site.json`
- 改首页视觉：替换 `public/images/` 下对应图片

## 已知事项

- `npm run lint` 目前不会执行真实检查，因为仓库还没完成 ESLint 初始化
- 部分历史文档仍保留旧迁移说明，仅可作为背景参考，不能完全代表当前实现
