export default function DeployCheck() {
    return (
        <main className="min-h-screen bg-slate-950 text-slate-50">
            <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300">
                    Deploy Check
                </div>
                <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-6xl">
                    Reativa Web no ar
                </h1>
                <p className="mt-4 max-w-xl text-base text-slate-300 sm:text-lg">
                    Se esta pagina abriu no ambiente publicado, o deploy desta versao entrou corretamente.
                </p>
                <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900 px-6 py-5 shadow-2xl shadow-black/30">
                    <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                        Rota de validacao
                    </p>
                    <p className="mt-2 text-2xl font-bold text-emerald-300">
                        /deploy-check
                    </p>
                    <div className="mt-4 space-y-1 text-sm text-slate-400">
                        <p>Atualizada em 20/04/2026</p>
                        <p>Versao base: 5ed870a</p>
                        <p>Inclui ajuste do top attendants e validacao de cache por usuario.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
