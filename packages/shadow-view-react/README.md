
# ShadowViewReact
基于[`shadow-view`](https://github.com/Houfeng/shadow-view)包定制，服务于`hel-micro-react`

# 安装

```bash
npm i shadow-view-react --save
```

# 使用

```tsx
function App() {
  return (
    <ShadowView
      scoped={{
        style: `*{color:red;}`,
        imports: ["aaa.css"]
      }}
    >
      <div>这是一个测试</div>
    </ShadowView>
  );
}
```
