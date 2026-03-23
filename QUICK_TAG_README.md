# 快捷标签组件替换指南

## 需要替换的文件

将以下两个文件复制到 `src/app/components/` 目录覆盖原文件：

1. **QuickTagBar.tsx** — 更新了类型定义，新增字段
2. **QuickTagModal.tsx** — 完全重写，左右分栏布局

## App.tsx 需要的修改

在 `src/app/App.tsx` 中，更新 `INITIAL_TAGS` 数据为新格式：

```tsx
// 替换原来的 INITIAL_TAGS
const INITIAL_TAGS: QuickTag[] = [
  {
    id: 't1',
    label: '头条-安卓-激活',
    color: 'blue',
    active: true,
    owner: '张三',
    mainChannels: ['大咖-头条-头条btt', '大咖-头条-头条btoutiao'],
    subChannels: ['tt00zs01', 'tt00zs02', 'tt00zs03', 'tt00fx01', 'tt00fx02'],
    vis: 'private',
    authUsers: [],
  },
  {
    id: 't2',
    label: '头条-iOS-付费',
    color: 'green',
    active: true,
    owner: '张三',
    mainChannels: ['大咖-头条-头条btt_ios'],
    subChannels: ['tt01ios_pay01', 'tt01ios_pay02'],
    vis: 'private',
    authUsers: [],
  },
  {
    id: 't3',
    label: '快手-全渠道',
    color: 'orange',
    active: false,
    owner: '李四',
    mainChannels: ['大咖-快手-快手ksa'],
    subChannels: ['ks_all_01'],
    vis: 'public',
    authUsers: [],
  },
  {
    id: 't4',
    label: '头条-安卓-注册',
    color: 'purple',
    active: false,
    owner: '张三',
    mainChannels: ['大咖-头条-头条btt'],
    subChannels: ['tt00reg01', 'tt00reg02', 'tt00reg03', 'tt00reg04', 'tt00reg05', 'tt00reg_test01'],
    vis: 'partial',
    authUsers: ['敖子良', '孙雅', '钱文', '胡波'],
  },
  {
    id: 't5',
    label: '广点通-主推',
    color: 'cyan',
    active: false,
    owner: '王五',
    mainChannels: ['大咖-广点通-广点通gdt01'],
    subChannels: ['gdt_main_a01', 'gdt_main_b02'],
    vis: 'partial',
    authUsers: [],
  },
  {
    id: 't6',
    label: '头条-全量投放',
    color: 'red',
    active: false,
    owner: '李四',
    mainChannels: ['乐乐-头条-头条ltt01'],
    subChannels: ['tt_full_launch01'],
    vis: 'public',
    authUsers: [],
  },
  {
    id: 't7',
    label: '快手-安卓-ROI',
    color: 'magenta',
    active: false,
    owner: '张三',
    mainChannels: ['大咖-快手-快手ksa', '大咖-快手-快手ksb'],
    subChannels: ['ks_roi_and01', 'ks_roi_and02', 'ks_roi_and03', 'ks_roi_opt01'],
    vis: 'private',
    authUsers: [],
  },
  {
    id: 't8',
    label: '头条+快手品牌',
    color: 'gold',
    active: false,
    owner: '王五',
    mainChannels: ['乐乐-头条-头条ltt01', '乐乐-快手-快手lks01'],
    subChannels: ['tt_brand_a01', 'tt_brand_b02', 'ks_brand_c01'],
    vis: 'public',
    authUsers: [],
  },
];
```

## 注意事项

1. **QuickTag 类型变更**：新增了 `owner`、`mainChannels`、`subChannels`、`vis`、`authUsers` 字段，`color` 类型从联合类型改为 `string`（兼容自定义颜色）

2. **import 路径不变**：App.tsx 中原来的 `import type { QuickTag } from './components/QuickTagBar'` 保持不变

3. **ME 常量**：QuickTagModal 中硬编码了 `const ME = '张三'`，如果需要动态传入当前用户，可以在 Props 中添加 `currentUser` 字段

4. **数据结构**：
   - `mainChannels`: 三级路径格式 `"游戏-媒体-主渠道"`，如 `"大咖-头条-头条btt"`
   - `subChannels`: 渠道标识码列表，如 `["tt00zs01", "tt00zs02"]`
   - `vis`: `'private' | 'partial' | 'public'`
   - `authUsers`: 用户姓名列表

5. **GAME_CHANNEL_DATA**：三级级联数据定义在 QuickTagBar.tsx 中，按需修改游戏/媒体/渠道枚举
