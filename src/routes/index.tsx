import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "登录 · 欢迎回来" },
      { name: "description", content: "登录您的账户，继续您的旅程。" },
      { property: "og:title", content: "登录 · 欢迎回来" },
      { property: "og:description", content: "登录您的账户，继续您的旅程。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const [show, setShow] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-2">
      <section className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent opacity-80" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full border-[40px] border-accent/40" />
        <span className="relative text-lg font-semibold tracking-widest">墨 · INK</span>
        <div className="relative">
          <h2 className="font-serif text-5xl leading-tight">
            每一次回来，
            <br />
            都是新的开始。
          </h2>
          <p className="mt-4 max-w-sm text-primary-foreground/70">简洁、安全、专注 —— 登录后继续您的工作。</p>
        </div>
        <span className="relative text-sm text-primary-foreground/50">© 2026 Ink Studio</span>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <form
          className="w-full max-w-sm"
          onSubmit={(e) => {
            e.preventDefault();
            setMsg("登录功能尚未接入后端，这是界面演示。");
          }}
        >
          <h1 className="font-serif text-4xl">欢迎回来</h1>
          <p className="mt-2 text-muted-foreground">请输入您的账户信息登录</p>

          <label className="mt-10 block text-sm font-medium">邮箱</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="mt-2 w-full rounded-lg border border-input bg-card px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
          />

          <div className="mt-5 flex items-center justify-between">
            <label className="text-sm font-medium">密码</label>
            <a href="#" className="text-sm text-accent hover:underline">忘记密码？</a>
          </div>
          <div className="relative mt-2">
            <input
              type={show ? "text" : "password"}
              required
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-card px-4 py-3 pr-16 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground hover:text-foreground"
            >
              {show ? "隐藏" : "显示"}
            </button>
          </div>

          <label className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" className="accent-[var(--accent)]" /> 记住我
          </label>

          <button
            type="submit"
            className="mt-8 w-full rounded-lg bg-primary py-3 font-medium text-primary-foreground transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            登录
          </button>
          {msg && <p className="mt-3 text-center text-sm text-muted-foreground">{msg}</p>}

          <div className="my-8 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />或<span className="h-px flex-1 bg-border" />
          </div>
          <button
            type="button"
            className="w-full rounded-lg border border-input py-3 font-medium transition hover:bg-secondary"
          >
            使用 Google 账号登录
          </button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            还没有账户？<a href="#" className="font-medium text-accent hover:underline">立即注册</a>
          </p>
        </form>
      </section>
    </main>
  );
}
