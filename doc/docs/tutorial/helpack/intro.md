---
sidebar_position: 1
---

# Helpack 简介

## 什么是 Helpack

[Helpack](https://github.com/Tencent/hel/tree/main/helpack)是一个动态化模块发布、托管服务平台。它提供了完整的模块联邦解决方案，支持模块的动态发布、版本管理和托管服务。
Helpack 是 Hel 生态系统的核心组件，为微前端架构提供了强大的模块管理能力。

![](https://tnfe.gtimg.com/hel-img/WX20251027-120047.png)

> 支持私有部署helpack，[仓库地址](https://github.com/Tencent/hel/tree/main/helpack)

## 为什么要用 Helpack

Helpack 提供了以下核心能力：

1. **动态模块发布**：支持模块的快速发布和版本管理
2. **模块托管服务**：提供稳定的模块托管和分发服务
3. **版本控制**：支持多版本管理，方便进行版本切换和回滚
4. **统一管理**：通过 Web 界面统一管理所有模块和版本
5. **API 支持**：提供丰富的 API 接口，支持前端和后端集成
6. **灵活配置**：支持多种运行模式，适应不同的使用场景

部署完毕后，对接你公司的ci&cd系统，将模块产物存储到私有cdn，元数据推送到helpack即可。
![arch](https://tnfe.gtimg.com/image/f13q7cuzxt_1652895450360.png)

通过 Helpack，你可以：
- 实现模块的快速迭代和发布
- 支持多环境、多版本的模块管理，精细化控制模块版本下发规则
- 简化微前端架构的模块管理流程
- 提供稳定的模块托管和分发服务

