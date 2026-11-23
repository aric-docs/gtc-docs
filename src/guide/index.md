# gtc 命令使用说明

`gtc` 是一个 Github / GitLab 发布流水线触发与回滚的命令行工具：通过交互菜单选择目标环境，触发对应流水线；发布出现问题时，可回滚到历史成功发布的版本。

## 快速开始

```shell
# 1. 初始化配置文件（自动识别 github / gitlab）
gtc init

# 2. 创建 GitLab 触发器，并回填 trigger_token / project_id（仅 GitLab）
#    需要先设置访问令牌环境变量，或作为参数传入
export GITLAB_TOKEN=你的访问令牌
gtc trigger

# 3. 交互选择环境，触发发布
gtc

# 4. 发布有问题时回滚（默认 beta 环境）
gtc rollback
```

## 命令一览

| 命令 | 别名 | 说明 |
| --- | --- | --- |
| `gtc` | — | 交互选择环境并触发发布 |
| `gtc init` | `i` | 初始化 `.gtc.config.yml` 配置文件 |
| `gtc trigger` | `t` | 创建 GitLab 触发器并写入配置文件（仅 GitLab） |
| `gtc rollback [env]` | `r` | 回滚到历史发布版本，默认 `beta` |
| `gtc bump [type]` | `b` | 递增 npm 版本并提交 `package.json`（不 push） |

### 全局参数（`gtc` 主命令）

| 参数 | 说明 |
| --- | --- |
| `-v, --version` | 查看当前版本号 |
| `-m, --mode string` | 触发模式：`msg`（提交标记信息）或 `trigger`（调用流水线 API） |
| `-d, --dry-run` | 只展示将要执行的动作，不实际执行 |

### `gtc init`

初始化项目根目录下的 `.gtc.config.yml`，并根据 git remote 自动判断是 Github 还是 GitLab。

| 参数 | 说明 |
| --- | --- |
| `-f, --force` | 配置文件已存在时强制覆盖 |

### `gtc trigger`

仅用于 GitLab：创建 GTC 触发器，并把 `trigger_token`、`project_id` 回填到配置文件。

- 访问令牌优先读取环境变量 `GITLAB_TOKEN`，其次取命令行第一个参数。
- 缺少令牌时会报错退出。

### `gtc rollback [env]`

列出历史成功发布记录，选择版本回滚。

| 参数 | 说明 |
| --- | --- |
| `env` | 目标环境，不传默认为 `beta`，可传 `production` |
| `--rebuild` | artifacts 过期时，基于旧 commit 临时分支重新构建后回滚 |

> 未指定 `--rebuild` 时，默认复用旧 deploy job 的 artifacts 直接 retry，秒级完成。

### `gtc bump [type]`

递增 `package.json` 版本并提交（不会 push）。

| 参数 | 说明 |
| --- | --- |
| `type` | 版本类型，如 `patch` / `minor` / `major` / `prerelease` |
| `--preid` | prerelease 标识（如 `beta`、`rc`），默认读配置 `bump.preid` |

## 配置文件 `.gtc.config.yml`

在项目根目录维护，示例：

```yml
# 默认触发模式：msg / trigger（命令行 -m 优先）
mode: ""

gtc:
  message: gtc

# bump 默认配置
bump:
  type: prerelease
  preid: beta

# 可发布的环境列表
commands:
  - label: "🍏 发布到 beta 环境"
    value: "beta"
  - label: "🍎 发布到 production 环境"
    value: "production"

# github 配置
github: false

# gitlab 配置
gitlab:
  trigger_token: "your_gitlab_trigger_token" # 由 `gtc trigger` 创建并写入
  project_id: 0
```

## CI 配置示例（GitLab CI）

流水线通过提交信息标记或 `GTC_TOKEN` 变量区分环境：

```yml
stages:
  - job1
  - job2

job_1:
  stage: job1
  script:
    - echo "Running Job 1(beta)"
    - printenv
  only:
    variables:
      - $GTC_TOKEN == "beta"
      - $CI_COMMIT_MESSAGE =~ /__@beta__/ && $GTC_TOKEN == null

job_2:
  stage: job2
  script:
    - echo "Running Job 2(production)"
    - printenv
  only:
    variables:
      - $GTC_TOKEN == "production"
      - $CI_COMMIT_MESSAGE =~ /__@production__/ && $GTC_TOKEN == null
```

## 两种触发模式

- **msg 模式**：把 `__@环境__` 标记写入提交信息，推送后由 CI 根据提交信息匹配对应任务。
- **trigger 模式**：直接调用 GitLab 流水线触发 API，通过 `GTC_TOKEN=<环境>` 变量触发对应任务（默认模式）。

## 查看帮助

```shell
gtc -h              # 查看所有命令与参数
gtc rollback -h     # 查看某个子命令的帮助
```
