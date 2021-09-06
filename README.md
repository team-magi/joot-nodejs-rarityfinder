# 一个可以快速启动的 express + mysql 模板

## 项目结构

```shell
├── config
│   └── cache
│   └── database
│   └── dev
│   └── index
│   └── message
│   └── oauth
│   └── site
│   └── switch
│   └── uploader
├── middlewares
│   └── router
│   └── cors
│   └── forcehttps
├── public
│   └── upload
├── test
│   └── upload
```

| 文件夹       | 说明                    | 描述                        |
| ------------ | ----------------------- | --------------------------- |
| `config`     | 配置文件                  | database 配置 |
| `middlewares` | 中间件层 | 用于存放 中间件代码 |
| `public`      | 资源文件 | 存放上传文件 |

## 开发调试

npm run dev

## 运行
npm run serve
