import { useState, useEffect, useCallback, useMemo } from 'react';
import { Loader2, AlertCircle, Search, X } from 'lucide-react';
import { catalogService, type Product, type Category } from '@/services/catalog.service';

const CACHE_KEY = 'catalog_cache';
const CACHE_TTL = 60 * 1000;

function getCachedData(): { categories: Record<string, Category>; products: Record<string, Product>; currency: string } | null {
    try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
        return data;
    } catch {
        return null;
    }
}

function setCachedData(data: { categories: Record<string, Category>; products: Record<string, Product>; currency: string }) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
}

function formatPrice(price: string) {
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- Modal ---------- */
function ProductModal({ product, currency, onClose }: { product: Product; currency: string; onClose: () => void }) {
    const [imgReady, setImgReady] = useState(false);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[95vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-700/60 bg-[#0a173a] shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header fixo */}
                <div className="relative flex items-center justify-center border-b border-slate-700/60 p-3 sm:p-4">
                    <h2 className="text-base font-bold text-white sm:text-lg">Detalhe do Produto</h2>
                    <button
                        onClick={onClose}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Conteudo com scroll geral (imagem grande + detalhes) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                        {/* Imagem maior */}
                        <div className="relative shrink-0 overflow-hidden rounded-xl border-4 border-white bg-white p-3 sm:w-80 sm:p-4">
                            <div className="relative flex aspect-square items-center justify-center bg-slate-100">
                                {product.media?.[0] ? (
                                    <img
                                        src={product.media[0]}
                                        alt={product.name}
                                        className={`h-full w-full object-contain transition-opacity duration-500 ${imgReady ? 'opacity-100' : 'opacity-0'}`}
                                        onLoad={() => setImgReady(true)}
                                        onError={() => setImgReady(true)}
                                    />
                                ) : (
                                    <span className="text-sm text-slate-500">Sem imagem</span>
                                )}
                                {!imgReady && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-100">
                                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
                                    </div>
                                )}
                            </div>
                            <span className="absolute left-2 top-2 rounded bg-lime-400 px-2 py-0.5 text-[10px] font-bold uppercase text-[#0a173a]">
                                {product.category}
                            </span>
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white sm:text-xl">{product.name}</h3>
                                <span className="text-xs text-slate-400">#{product.code}</span>
                            </div>

                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-lime-300 sm:text-3xl">
                                    {currency} {formatPrice(product.price)}
                                </p>
                                <p className="text-sm text-slate-400">{product.points} pts</p>
                                {product.store_value && parseFloat(product.store_value) > 0 && (
                                    <p className="text-sm font-medium text-lime-400/90">
                                        Valor de afiliado: {currency} {formatPrice(product.store_value)}
                                    </p>
                                )}
                            </div>

                            {product.is_release && (
                                <span className="inline-block rounded-full bg-sky-500/10 px-3 py-1 text-xs font-semibold text-sky-400">
                                    Lancamento
                                </span>
                            )}

                            {product.description && (
                                <div className="max-h-[200px] overflow-y-auto rounded-lg bg-slate-800/60 p-3 sm:max-h-[260px] sm:p-4">
                                    <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Descricao
                                    </h4>
                                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-300">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- Pagina ---------- */
export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [currency, setCurrency] = useState('R$');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [search, setSearch] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const loadData = useCallback(async (forceRefresh = false) => {
        if (!forceRefresh) {
            const cached = getCachedData();
            if (cached) {
                setCurrency(cached.currency ?? 'R$');
                setCategories(Object.values(cached.categories ?? {}).filter(c => c.active === 1));
                setProducts(Object.values(cached.products ?? {}));
                setLoading(false);
                return;
            }
        }

        try {
            const res = await catalogService.getCatalog();
            setCurrency(res.currency ?? 'R$');
            const cats = Object.values(res.categories ?? {}).filter(c => c.active === 1);
            setCategories(cats);
            setProducts(Object.values(res.products ?? {}));
            setCachedData({ categories: res.categories, products: res.products, currency: res.currency });
        } catch {
            setError('Erro ao carregar catalogo. Tente novamente.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchCat = selectedCategory === null || p.category_id === selectedCategory;
            const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase());
            return matchCat && matchSearch;
        });
    }, [products, selectedCategory, search]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-lime-300" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-3 sm:p-6">
            {/* Filtros - mobile empilhados */}
            <div className="mb-4 space-y-3 sm:mb-5 sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:space-y-0">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Buscar produto ou cod..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-md border border-slate-700/60 bg-[#0a173a]/85 py-2 pl-10 pr-3 text-sm text-slate-200 placeholder:text-slate-500 focus:border-lime-300/40 focus:outline-none focus:ring-1 focus:ring-lime-300/20"
                    />
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${selectedCategory === null
                            ? 'bg-lime-300 text-[#0a173a]'
                            : 'bg-[#1a2332] text-slate-400 hover:text-slate-200'
                            }`}
                    >
                        Todos
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
                            className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${selectedCategory === cat.id
                                ? 'bg-lime-300 text-[#0a173a]'
                                : 'bg-[#1a2332] text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            <p className="mb-4 text-xs text-slate-500 sm:mb-5">
                {filteredProducts.length} produto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
                <div className="flex h-64 items-center justify-center">
                    <p className="text-sm text-slate-500">Nenhum produto encontrado.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product, index) => (
                        <Card
                            key={product.code ?? index}
                            product={product}
                            formatPrice={formatPrice}
                            onClick={() => setSelectedProduct(product)}
                        />
                    ))}
                </div>
            )}

            {selectedProduct && (
                <ProductModal
                    product={selectedProduct}
                    currency={currency}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </div>
    );
}

/* ---------- Card ---------- */
function Card({ product, formatPrice, onClick }: { product: Product; formatPrice: (p: string) => string; onClick: () => void }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [imgError, setImgError] = useState(false);

    return (
        <div
            onClick={onClick}
            className="group cursor-pointer rounded-lg border border-slate-700/50 bg-[#1a2332]/80 p-2 transition-all hover:border-lime-300/30 sm:p-3"
        >
            {/* Imagem com placeholder fixo e badge posicionada */}
            <div className="relative aspect-square overflow-hidden rounded-md border-4 border-white bg-slate-200">
                {/* Badge posicionada corretamente dentro da imagem */}
                <span className="absolute left-2 top-2 z-20 rounded bg-lime-400 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#0a173a] sm:px-2 sm:text-[10px]">
                    {product.category}
                </span>

                {/* Spinner enquanto carrega */}
                {!imgLoaded && !imgError && product.media?.[0] && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-200">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent sm:h-6 sm:w-6" />
                    </div>
                )}

                {product.media?.[0] && !imgError ? (
                    <img
                        src={product.media[0]}
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => setImgLoaded(true)}
                        onError={() => setImgError(true)}
                        className={`h-full w-full object-contain p-1 transition-opacity duration-300 sm:p-2 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                ) : null}
            </div>

            {/* Info */}
            <div className="mt-2 space-y-1 sm:mt-3">
                <h3 className="truncate text-sm font-semibold text-slate-100 sm:text-base">{product.name}</h3>
                {product.description && (
                    <p className="line-clamp-1 text-[10px] text-slate-400 sm:line-clamp-2 sm:text-xs">{product.description}</p>
                )}
                <div className="flex items-end justify-between pt-1 sm:pt-2">
                    <p className="text-base font-bold text-lime-300 sm:text-lg">
                        R$ {formatPrice(product.price)}
                    </p>
                    <span className="text-[9px] text-slate-500 sm:text-[10px]">{product.points} pts</span>
                </div>
            </div>
        </div>
    );
}
