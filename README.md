# @frame/contracts

FRAME 产品之间共享、版本化的数据交换契约。

## V0.1 范围

当前只包含跨项目边界真正需要共享的 Scene Ground Truth：

- SceneGroundTruthSchema
- SceneGroundTruthBoundarySchema
- SceneGroundTruthBoundaryConfidenceSchema
- 对应 TypeScript 类型
- 生成的 JSON Schema

不包含 FRAME 算法内部结构、VLM Draft、人工 Review Session、数据库表或 Evaluator 实现。

## 单一真相源

```text
@frame/contracts
      │
 ┌────┴────┐
FRAME   GT Studio
```

生产者内部可以使用自己的 UI/DB 数据结构，但跨系统输出必须通过本包校验。

## Scene Ground Truth v0.1 约束

- schemaVersion 固定为 0.1
- timestamp 单位统一为整数毫秒
- 0 < timestampMs < durationMs
- Boundary ID 唯一
- Boundary timestamp 唯一
- Boundary 严格按 timestamp 升序
- confidence 只能为 certain / uncertain

机器可读 JSON Schema：

```text
schemas/scene-ground-truth-v0.1.schema.json
```

## 版本策略

npm package 使用 Semantic Versioning；Payload 自身通过 schemaVersion 显式声明数据格式版本。

Breaking change 不允许静默覆盖旧 Schema，必须新增 Schema Version，并在需要时提供迁移函数。

## 开发

```bash
npm install
npm test
npm run build
```
