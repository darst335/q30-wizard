<div align="center">

# Q30 Wizard

**为 JCG Q30 Pro（外贸定制版）打造的全新路由器系统**
**A fresh router experience for the JCG Q30 Pro (OEM export edition)**

[简体中文](README.md) | [English](README.en.md)

*基于 ImmortalWrt 24.10 · Built on ImmortalWrt 24.10*

</div>

---

## 📖 项目背景 / Background

我在市场买到了一台**海南信通（HNXT）向 JCG 定制的 Q30 Pro 外贸版**（型号 HNXT-C101）。
机器硬件素质不错，但原厂 UI 相当简陋——于是我和 AI 助手一起启动了这个项目：
**把这台机器重刷成 ImmortalWrt 24.10，并从头设计一套普通人也能用的简洁管理界面。**

I bought an **HNXT-C101 — a JCG Q30 Pro export edition custom-built for Hainan Xintong (HNXT)**.
The hardware is solid, but the stock UI is bare-bones. So I started this project together with an AI assistant:
**flash the device with ImmortalWrt 24.10 and design a clean, consumer-friendly admin UI from scratch.**

---

## 🖥️ 硬件与原厂信息 / Hardware & Stock Firmware

| 项目 / Item | 规格 / Spec |
|---|---|
| 型号 / Model | HNXT-C101（JCG Q30 Pro OEM 外贸版） |
| SoC | MediaTek MT7981B（双核 Cortex-A53 @1.3GHz） |
| 内存 / RAM | 256 MB DDR3 |
| 闪存 / Flash | 128 MB SPI-NAND |
| 无线 / Wi-Fi | Wi-Fi 6 AX3000（2.4G 2×2 + 5G 2×2） |
| 有线 / Wired | 千兆网口 / Gigabit Ethernet |

**原厂固件 / Stock firmware**：HNXT-C101 v1.1.7，基于 OpenWrt 21.02-SNAPSHOT（内核 kernel 5.4.246），nginx + LuCI 后台，Web 弱口令 `admin/admin`，root 密码直接烧录在 squashfs 内（恢复出厂也无法清除）。

**分区布局 / Partition layout**：

```
BL2 | u-boot-env | Factory(校准数据) | FIP(u-boot) | ubi(内核+系统)
```

---

## ✨ 特色功能 / Features

- 🧙 **一分钟快速设置向导** — 首次开机自动进入；Wi-Fi 名称按 `Jcq-` + MAC 后四位自动预填（5G 为 `Jcq-XXXX-5G`），默认密码 `12345678`；管理密码留空则默认 `admin`
- 📊 **简洁管理首页** — 设备总览、上网设置（DHCP / PPPoE / 静态 IP / **有线 AP 模式**）、Wi-Fi 设置（信道 / 频宽 / 发射功率等高级参数）、Mesh 组网、无线中继、局域网设置
- 🛡️ **DDNS / 防火墙中心** — 动态域名（DynDNS / No-IP / 3322 / 花生壳 / Cloudflare / 自定义）、端口转发、DMZ、UPnP
- 🔑 **默认开启 SSH**（root / admin），方便进阶玩家
- 🏭 **保留专家模式** — 一键跳转完整 LuCI，全部高级功能都在
- 📦 **云端构建** — GitHub Actions 全自动出固件，`dist` 分支即取即刷

## 🖼️ 界面预览 / UI Preview

<details>
<summary><b>📷 点击展开界面截图（4 张）/ Click to expand screenshots</b></summary>
<br>

**Wi-Fi 设置（含高级参数）/ Wi-Fi settings with advanced parameters**

![Wi-Fi](docs/images/ui-wifi.png)

**快速设置向导 / Quick setup wizard**

![Wizard](docs/images/ui-wizard.png)

**局域网设置 / LAN settings**

![LAN](docs/images/ui-lan.png)

**登录页 / Login**

![Login](docs/images/ui-login.png)

> 克隆仓库后可用浏览器打开 `docs/preview.html` 翻页浏览。
> Open `docs/preview.html` in a browser for a paged gallery.

</details>

---

## 🛠️ 刷机之旅 / The Flashing Journey

这台机器的刷机过程相当曲折，几个关键节点：

1. **拿到 SSH** — 原厂 Web 弱口令 `admin/admin` 登录后，通过 LuCI 的 ubus 接口重设 root 密码
2. **全片备份** — 逐分区备份 BL2 / u-boot-env / Factory / FIP / ubi（Factory 校准分区万万不能丢）
3. **跨版本直接刷的坑** — 原厂 21.02 的 sysupgrade 只认 tar/ubi 格式，不能直接刷 24.10 的 `.itb`；解法是先换引导（官方 preloader + bl31-uboot.fip），再刷系统
4. **红灯"变砖"疑云** — 换完引导重启后红灯常亮。反编译 U-Boot 发现：原厂环境变量把 `bootcmd` 写死为 `bootp`（OEM 网络批量部署用），新 U-Boot 一直在等 DHCP 引导服务器。**对策：在 PC 上架 DHCP + TFTP 服务器，把官方 initramfs 救援镜像"喂"给它**——全程无需拆机、无需串口
5. **从内存系统刷入正式固件** — initramfs 启动后 SSH 进去 sysupgrade，收工

> ⚠️ 原厂 U-Boot 无签名校验（已验证 FIP 仅 magic+CRC32），Factory 分区保存无线校准数据，刷机时**切勿写入该分区**。

## 📦 获取固件 / Get the Firmware

最新固件（含本 UI）：[`dist` 分支](../../tree/dist) → `immortalwrt-24.10.6-mediatek-filogic-jcg_q30-pro-squashfs-sysupgrade.itb`

自行构建：仓库自带 [GitHub Actions 工作流](.github/workflows/build.yml)，push 即自动构建并 force-push 到 `dist` 分支。

刷入方式：LuCI 系统管理页上传 sysupgrade 镜像，或 `sysupgrade /tmp/xxx.itb`（保留配置去掉 `-n`）。

## ⚠️ 免责声明 / Disclaimer

本项目仅供学习交流。刷机有风险，操作前请做好全片备份；变砖需自担风险（建议备好 UART/串口工具）。
For study and research only. Flash at your own risk — always back up every partition first, and keep a UART adapter handy.

---

<div align="center">

*由 darst335 与 AI 助手协作完成 · Crafted by darst335 together with an AI assistant*

</div>
