const http = require('http');

const page = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>FLUXO — Controle total da operação</title>
  <style>
    :root{--bg:#070b2e;--bg2:#130046;--p:#7c4dff;--p2:#5d2eff;--text:#e9ebff;--muted:#a8add6}
    *{box-sizing:border-box}body{margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;background:#f6f7ff;color:#13152a}
    .hero{background:radial-gradient(circle at 20% 20%,#1d2b8f 0,#0a0f3d 40%,#070b2e 70%,#120046 100%);color:var(--text);padding:26px 0 70px}
    .container{width:min(1180px,92%);margin:0 auto}
    .nav{display:flex;justify-content:space-between;align-items:center}
    .logo{font-size:34px;font-weight:800;letter-spacing:1px}
    .logo span{color:#9a7cff}.nav a{color:#d7dcff;text-decoration:none;margin:0 10px;font-size:14px}
    .btn{padding:12px 20px;border-radius:12px;border:1px solid #6e72ab;background:transparent;color:#fff;font-weight:700}
    .btn.primary{background:linear-gradient(90deg,#6440ff,#8f4bff);border:0}
    .hero-grid{display:grid;grid-template-columns:1fr 1.1fr;gap:28px;align-items:center;margin-top:44px}
    h1{font-size:62px;line-height:1.05;margin:0 0 16px} h1 .hl{color:#9561ff}
    .sub{font-size:22px;color:#c8cfff;line-height:1.45;margin-bottom:28px}
    .panel{background:#fff;border-radius:22px;padding:24px;color:#1f2450;box-shadow:0 20px 60px rgba(0,0,0,.35)}
    .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:12px 0}
    .card{background:#f3f5ff;padding:12px;border-radius:14px}.kpi{font-weight:800;color:#2f3789}
    .line{height:68px;border-radius:14px;background:linear-gradient(180deg,#f5f7ff,#eef1ff);margin-top:10px}
    .stats{display:grid;grid-template-columns:repeat(5,1fr);gap:14px;background:#13073f;color:#ddd;border-radius:22px;padding:28px;margin-top:40px}
    .stat b{display:block;color:#fff;font-size:34px}
    .section{padding:72px 0}.title{font-size:44px;line-height:1.1;margin-bottom:10px;color:#171a38}.title .hl{color:#6f3dff}
    .features{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:26px}
    .f{background:#fff;padding:20px;border-radius:16px;border:1px solid #ebedff}.dot{width:34px;height:34px;border-radius:10px;background:#efebff;margin-bottom:10px}
    .pricing{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:24px}
    .plan{background:#fff;border:1px solid #dddffd;padding:24px;border-radius:18px}
    .plan.pro{border-color:#7c4dff;box-shadow:0 8px 26px rgba(124,77,255,.15)}
    footer{background:#060a2e;color:#d5dcff;padding:30px 0;margin-top:50px}
    @media(max-width:980px){.hero-grid{grid-template-columns:1fr}h1{font-size:46px}.features,.cards,.pricing,.stats{grid-template-columns:1fr 1fr}}
    @media(max-width:620px){.features,.cards,.pricing,.stats{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <div class="nav">
        <div class="logo"><span>∿</span> FLUXO</div>
        <div>
          <a href="#">Recursos</a><a href="#">Funcionalidades</a><a href="#">Planos</a><a href="#">Blog</a>
          <button class="btn">Entrar</button>
          <button class="btn primary">Começar Agora</button>
        </div>
      </div>
      <div class="hero-grid">
        <div>
          <h1>Controle financeiro, <span class="hl">tarefas, tráfego</span> e rotinas em um só lugar.</h1>
          <p class="sub">Mais clareza para sua operação. Mais produtividade para sua equipe.</p>
          <button class="btn primary">Começar Agora</button>
          <button class="btn" style="margin-left:8px">Ver Demonstração</button>
        </div>
        <div class="panel">
          <strong>Olá, João! 👋</strong>
          <div class="cards">
            <div class="card"><small>Receita</small><div class="kpi">R$ 58.750</div></div>
            <div class="card"><small>Despesas</small><div class="kpi">R$ 23.560</div></div>
            <div class="card"><small>Investimento</small><div class="kpi">R$ 14.230</div></div>
          </div>
          <div class="line"></div>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><b>+70%</b> produtividade operacional</div>
        <div class="stat"><b>-45%</b> retrabalho e perda de informação</div>
        <div class="stat"><b>100%</b> centralização da operação</div>
        <div class="stat"><b>+60%</b> clareza em processos</div>
        <div class="stat"><b>+50%</b> decisões baseadas em dados</div>
      </div>
    </div>
  </section>

  <section class="section container">
    <h2 class="title">Organize toda sua operação <span class="hl">em um único fluxo</span></h2>
    <div class="features">
      <div class="f"><div class="dot"></div><h3>Financeiro</h3><p>Controle total de caixa, despesas e recebíveis.</p></div>
      <div class="f"><div class="dot"></div><h3>Gestão de Tráfego</h3><p>Acompanhe CPC, CPA, CTR, ROAS e conversões.</p></div>
      <div class="f"><div class="dot"></div><h3>Tarefas da Equipe</h3><p>Kanban, checklist, prazos e responsáveis.</p></div>
      <div class="f"><div class="dot"></div><h3>Rotinas Operacionais</h3><p>Padronize processos e auditorias recorrentes.</p></div>
      <div class="f"><div class="dot"></div><h3>Relatórios e Métricas</h3><p>Dashboards completos com exportação.</p></div>
      <div class="f"><div class="dot"></div><h3>WhatsApp Integrado</h3><p>Atendimento centralizado com automações.</p></div>
    </div>

    <h2 class="title" style="margin-top:56px">Planos para cada momento</h2>
    <div class="pricing">
      <div class="plan"><h3>Plano Start</h3><p>Ideal para pequenas operações</p><h2>R$ 79/mês</h2></div>
      <div class="plan pro"><h3>Plano Pro</h3><p>Para empresas em crescimento</p><h2>R$ 149/mês</h2></div>
    </div>
  </section>

  <footer>
    <div class="container">© 2026 FLUXO — Um só fluxo. Controle total da operação.</div>
  </footer>
</body>
</html>`;

const server = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(page);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end('<h1>Página não encontrada</h1>');
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Servidor Rodando em http://localhost:3000');
});
