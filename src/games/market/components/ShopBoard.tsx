import { useState, useCallback, useEffect } from "react";
import type { LangStr, PlayerState, InventoryEntry, CustomerProfile, MarketEvent } from "../data/schema";
import {
  GOODS, CUSTOMERS, MARKET_EVENTS, SHOP_UPGRADES,
  NISAB_THRESHOLD, ZAKAT_RATE,
  addToInventory, removeFromInventory,
  getCurrentPrice,
} from "../data/schema";
import { EventModal } from "./EventModal";
import { ZakatScreen } from "./ZakatScreen";
import { CartoonCharacter } from "./CartoonCharacter";
import { GoodIcon } from "./GoodIcon";

const SAVE_KEY = "market-save";

interface Props {
  lang: "ar" | "en";
  onBack: () => void;
}

function t(s: LangStr, lang: "ar" | "en") { return s[lang]; }

function createInitialState(): PlayerState {
  return {
    gold: 100,
    barakah: 10,
    shopLevel: 1,
    inventory: {},
    year: 1,
    turn: 1,
    totalEarned: 0,
    totalCharity: 0,
    transactions: [],
    completedEvents: [],
  };
}

function loadState(): PlayerState {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) return JSON.parse(saved) as PlayerState;
  } catch { /* ignore */ }
  return createInitialState();
}

export function ShopBoard({ lang, onBack }: Props) {
  const [state, setState] = useState<PlayerState>(loadState);
  const [marketFlux, setMarketFlux] = useState(() => Math.random());
  const [customer, setCustomer] = useState<{ profile: CustomerProfile; requests: { goodId: string; qty: number }[]; patienceLeft: number } | null>(null);
  const [message, setMessage] = useState<{ text: LangStr; type: "success" | "error" | "info" } | null>(null);
  const [event, setEvent] = useState<MarketEvent | null>(null);
  const [showZakat, setShowZakat] = useState(false);
  const [zakatDue, setZakatDue] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [view, setView] = useState<"shop" | "caravan" | "upgrade">("shop");

  const dir = lang === "ar" ? "rtl" : "ltr";
  const currentShop = SHOP_UPGRADES[state.shopLevel - 1];

  // Generate a customer
  const spawnCustomer = useCallback(() => {
    const profile = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
    const requests: { goodId: string; qty: number }[] = [];
    const count = profile.requestCount;
    for (let i = 0; i < count; i++) {
      const good = GOODS[Math.floor(Math.random() * GOODS.length)];
      const qty = Math.floor(Math.random() * 5) + 1;
      requests.push({ goodId: good.id, qty });
    }
    setCustomer({ profile, requests, patienceLeft: profile.patience });
  }, []);

  // Initial customer
  useEffect(() => { spawnCustomer(); }, [spawnCustomer]);

  // Persist game state
  useEffect(() => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }, [state]);

  function showMessage(text: LangStr, type: "success" | "error" | "info") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }

  // Buy from caravan
  function handleBuy(goodId: string) {
    const good = GOODS.find((g) => g.id === goodId);
    if (!good) return;
    const price = getCurrentPrice(good, state.turn, marketFlux);
    const qty = 5;
    const totalCost = price.buyPrice * qty;
    if (state.gold < totalCost) {
      showMessage(
        lang === "ar"
          ? { ar: "ليس لديك دنانير كافية!", en: "Not enough dinars!" }
          : { ar: "ليس لديك دنانير كافية!", en: "Not enough dinars!" },
        "error",
      );
      return;
    }
    setState((s) => ({
      ...s,
      gold: s.gold - totalCost,
      inventory: addToInventory(s.inventory, goodId, qty, price.buyPrice),
      totalEarned: s.totalEarned - totalCost,
      transactions: [...s.transactions, {
        turn: s.turn,
        type: "buy" as const,
        goodId,
        quantity: qty,
        unitPrice: price.buyPrice,
        total: totalCost,
        description: { ar: `شراء ${qty} ${t(good.name, lang)}`, en: `Bought ${qty} ${t(good.name, lang)}` },
      }],
    }));
    showMessage(
      { ar: `اشتريت ${qty} ${t(good.name, lang)} بسعر ${price.buyPrice} دينار للوحدة`, en: `Bought ${qty} ${t(good.name, lang)} at ${price.buyPrice} dinars each` },
      "success",
    );
  }

  // Sell to customer
  function handleSell(requestIdx: number) {
    if (!customer) return;
    const req = customer.requests[requestIdx];
    const good = GOODS.find((g) => g.id === req.goodId);
    if (!good) return;
    const entry = state.inventory[req.goodId];
    if (!entry || entry.quantity < req.qty) {
      showMessage(
        { ar: "ليس لديك كمية كافية من هذه البضاعة!", en: "Not enough stock of this item!" },
        "error",
      );
      return;
    }
    const price = getCurrentPrice(good, state.turn, marketFlux);
    const revenue = price.sellPrice * req.qty;
    const profit = (price.sellPrice - entry.avgCost) * req.qty;

    setState((s) => ({
      ...s,
      gold: s.gold + revenue,
      inventory: removeFromInventory(s.inventory, req.goodId, req.qty),
      totalEarned: s.totalEarned + revenue,
      barakah: Math.min(100, s.barakah + (profit > 0 ? 0.5 : -1)),
      transactions: [...s.transactions, {
        turn: s.turn,
        type: "sell" as const,
        goodId: req.goodId,
        quantity: req.qty,
        unitPrice: price.sellPrice,
        total: revenue,
        description: { ar: `بيع ${req.qty} ${t(good.name, lang)}`, en: `Sold ${req.qty} ${t(good.name, lang)}` },
      }],
    }));
    showMessage(
      { ar: `ربحت ${revenue} دينار! (الربح: ${profit} دينار)`, en: `Earned ${revenue} dinars! (Profit: ${profit})` },
      "success",
    );

    // Remove this request from customer
    const remaining = customer.requests.filter((_, i) => i !== requestIdx);
    if (remaining.length === 0) {
      // Customer done
      nextTurn();
    } else {
      setCustomer({ ...customer, requests: remaining });
    }
  }

  // Next turn
  function nextTurn() {
    // Decrease patience, customer leaves if 0
    setCustomer((prev) => {
      if (!prev) return prev;
      if (prev.patienceLeft <= 1) {
        showMessage(
          { ar: `${t(prev.profile.name, lang)} غادر السوق لأنك أبطأت!`, en: `${t(prev.profile.name, lang)} left the market, you were too slow!` },
          "error",
        );
        return null;
      }
      return { ...prev, patienceLeft: prev.patienceLeft - 1 };
    });

    setState((s) => {
      let newYear = s.year;
      let newTurn = s.turn + 1;
      if (newTurn > 354) {
        newYear = s.year + 1;
        newTurn = 1;
        const invVal = Object.entries(s.inventory).reduce((sum, [goodId, entry]) => {
          const good = GOODS.find((g) => g.id === goodId);
          if (!good || !good.zakatable) return sum;
          return sum + entry.quantity * entry.avgCost;
        }, 0);
        const totalWealth = s.gold + invVal;
        if (totalWealth >= NISAB_THRESHOLD) {
          const zakat = Math.round(totalWealth * ZAKAT_RATE);
          setTimeout(() => { setZakatDue(zakat); setShowZakat(true); }, 100);
        }
      }
      return { ...s, turn: newTurn, year: newYear };
    });
    setMarketFlux(Math.random());
    // Spawn new customer if none
    setCustomer((prev) => {
      if (prev) return prev;
      const profile = CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)];
      const requests: { goodId: string; qty: number }[] = [];
      for (let i = 0; i < profile.requestCount; i++) {
        const good = GOODS[Math.floor(Math.random() * GOODS.length)];
        requests.push({ goodId: good.id, qty: Math.floor(Math.random() * 5) + 1 });
      }
      return { profile, requests, patienceLeft: profile.patience };
    });
    // Random event?
    if (Math.random() < 0.25) {
      const evt = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
      if (!state.completedEvents.includes(evt.id)) {
        setEvent(evt);
      }
    }
  }

  function handleEventChoice(goldChange: number, barakahChange: number, eventId: string) {
    setState((s) => ({
      ...s,
      gold: Math.max(0, s.gold + goldChange),
      barakah: Math.max(0, Math.min(100, s.barakah + barakahChange)),
      completedEvents: [...s.completedEvents, eventId],
    }));
    setEvent(null);
  }

  function handleZakatPaid(amount: number) {
    setState((s) => ({
      ...s,
      gold: s.gold - amount,
      barakah: Math.min(100, s.barakah + 15),
      totalCharity: s.totalCharity + amount,
      transactions: [...s.transactions, {
        turn: s.turn,
        type: "zakat" as const,
        total: amount,
        description: { ar: `إخراج الزكاة: ${amount} دينار`, en: `Zakat paid: ${amount} dinars` },
      }],
    }));
    setShowZakat(false);
    showMessage(
      { ar: `أخرجت ${amount} دينار زكاة، بورك في مالك!`, en: `Paid ${amount} dinars in zakat, may your wealth be blessed!` },
      "success",
    );
  }

  function handleUpgrade() {
    const next = SHOP_UPGRADES[state.shopLevel];
    if (!next) return;
    if (state.gold < next.cost) {
      showMessage({ ar: "ليس لديك دنانير كافية للتوسع!", en: "Not enough gold to expand!" }, "error");
      return;
    }
    if (state.barakah < next.minBarakah) {
      showMessage({ ar: `مؤشر البركة太低! تحتاج ${next.minBarakah} بركة على الأقل`, en: `Barakah too low! Need at least ${next.minBarakah}` }, "error");
      return;
    }
    setState((s) => ({
      ...s,
      gold: s.gold - next.cost,
      shopLevel: s.shopLevel + 1,
    }));
    showMessage(
      { ar: `تهانينا! أصبحت ${t(next.name, lang)}`, en: `Congratulations! You are now a ${t(next.name, lang)}` },
      "success",
    );
  }

  if (gameOver) {
    return (
      <div dir={dir} style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏆</div>
        <h2 style={{ color: "var(--text)", marginBottom: "0.5rem" }}>
          {lang === "ar" ? "انتهت اللعبة!" : "Game Over!"}
        </h2>
        <p style={{ color: "var(--text-light)", marginBottom: "0.5rem" }}>
          {lang === "ar"
            ? `وصلت إلى مستوى ${t(currentShop.name, lang)} مع ${Math.floor(state.barakah)} بركة و ${state.gold} دينار`
            : `You reached ${t(currentShop.name, lang)} with ${Math.floor(state.barakah)} barakah and ${state.gold} dinars`}
        </p>
        <button onClick={() => { setState(createInitialState()); setGameOver(false); setShowZakat(false); setEvent(null); }} style={btnStyle}>
          {lang === "ar" ? "العب مرة أخرى" : "Play Again"}
        </button>
        <button onClick={onBack} style={{ ...btnStyle, background: "transparent", border: "2px solid var(--border)", color: "var(--text)" }}>
          {lang === "ar" ? "العودة" : "Back"}
        </button>
      </div>
    );
  }

  // Current prices for display
  const prices = GOODS.reduce((acc, g) => {
    acc[g.id] = getCurrentPrice(g, state.turn, marketFlux);
    return acc;
  }, {} as Record<string, { buyPrice: number; sellPrice: number }>);

  return (
    <div dir={dir} style={{ maxWidth: 800, margin: "0 auto", padding: "0.75rem" }}>
      {/* Event Modal */}
      {event && (
        <EventModal event={event} lang={lang} onChoice={handleEventChoice} />
      )}

      {/* Zakat Screen */}
      {showZakat && (
        <ZakatScreen
          due={zakatDue}
          gold={state.gold}
          lang={lang}
          onPaid={handleZakatPaid}
          onSkip={() => {
            setShowZakat(false);
            setState((s) => ({ ...s, barakah: Math.max(0, s.barakah - 20) }));
          }}
        />
      )}

      {/* Top resource bar */}
      <div style={{
        display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap",
        background: "var(--card-bg)", borderRadius: "var(--radius)",
        padding: "0.6rem 0.75rem", border: "1px solid var(--border)",
        marginBottom: "0.5rem",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--text-light)", fontSize: "0.75rem", padding: 0,
          flexShrink: 0,
        }}>
          {lang === "ar" ? "↩" : "↩"}
        </button>
        <div style={{ flex: 1, minWidth: 120 }}>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{currentShop.icon} {t(currentShop.name, lang)}</span>
        </div>
        <ResourceBadge icon="🪙" label={lang === "ar" ? "دينار" : "Gold"} value={Math.floor(state.gold)} color="#FFD700" />
        <ResourceBadge icon="⭐" label={lang === "ar" ? "بركة" : "Barakah"} value={Math.floor(state.barakah)} color="#4CAF50" />
        <ResourceBadge icon="📅" label={lang === "ar" ? "سنة" : "Year"} value={state.year} color="#2196F3" />
        <ResourceBadge icon="🔄" label={lang === "ar" ? "يوم" : "Day"} value={state.turn} color="#FF9800" />
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", marginBottom: "0.5rem" }}>
        {[
          { id: "shop" as const, label: lang === "ar" ? "🏪 الدكان" : "🏪 Shop", icon: "🏪" },
          { id: "caravan" as const, label: lang === "ar" ? "🐪 القافلة" : "🐪 Caravan", icon: "🐪" },
          { id: "upgrade" as const, label: lang === "ar" ? "📈 توسعة" : "📈 Upgrade", icon: "📈" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setView(tab.id)}
            style={{
              flex: 1, padding: "0.5rem", borderRadius: 6,
              border: view === tab.id ? "2px solid var(--green-primary)" : "2px solid var(--border)",
              background: view === tab.id ? "rgba(76,175,80,0.08)" : "var(--card-bg)",
              color: "var(--text)", fontSize: "0.8rem", fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div style={{
          padding: "0.5rem 0.75rem", borderRadius: 6, marginBottom: "0.5rem",
          background: message.type === "success" ? "#e8f5e9" : message.type === "error" ? "#fce4e4" : "#e3f2fd",
          border: `1px solid ${message.type === "success" ? "#4CAF50" : message.type === "error" ? "#e53935" : "#2196F3"}`,
          color: message.type === "success" ? "#2e7d32" : message.type === "error" ? "#c62828" : "#1565C0",
          fontSize: "0.85rem", fontWeight: 500,
        }}>
          {t(message.text, lang)}
        </div>
      )}

      {/* Content based on tab */}
      {view === "shop" && (
        <ShopView
          customer={customer}
          inventory={state.inventory}
          prices={prices}
          lang={lang}
          onSell={handleSell}
          onNextTurn={nextTurn}
        />
      )}

      {view === "caravan" && (
        <CaravanView prices={prices} lang={lang} onBuy={handleBuy} />
      )}

      {view === "upgrade" && (
        <UpgradeView
          state={state}
          lang={lang}
          onUpgrade={handleUpgrade}
        />
      )}
    </div>
  );
}

// Sub-components

function ResourceBadge({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", fontSize: "0.8rem" }}>
      <span>{icon}</span>
      <span style={{ fontWeight: 700, color }}>{value}</span>
      <span style={{ color: "var(--text-light)", fontSize: "0.75rem" }}>{label}</span>
    </div>
  );
}

function ShopView({
  customer, inventory, prices, lang, onSell, onNextTurn,
}: {
  customer: { profile: CustomerProfile; requests: { goodId: string; qty: number }[]; patienceLeft: number } | null;
  inventory: Record<string, InventoryEntry>;
  prices: Record<string, { buyPrice: number; sellPrice: number }>;
  lang: "ar" | "en";
  onSell: (idx: number) => void;
  onNextTurn: () => void;
}) {
  const t_ = (s: LangStr) => s[lang];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {/* Customer */}
      {customer ? (
        <div style={{
          background: "var(--card-bg)", borderRadius: "var(--radius)",
          padding: "0.85rem", border: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <CartoonCharacter type={customer.profile.id as any} size={56} />
            <div style={{
              background: "rgba(139,69,19,0.08)", borderRadius: 6,
              padding: "0.35rem 0.6rem", flex: 1,
            }}>
              <strong style={{ fontSize: "1.05rem", color: "#3E2723" }}>
                {t_(customer.profile.name)}
              </strong>
              <span style={{ fontSize: "0.8rem", color: "#8B4513", marginLeft: "0.5rem", fontWeight: 600 }}>
                {lang === "ar" ? `صبر متبقي: ${customer.patienceLeft}/${customer.profile.patience}` : `Patience left: ${customer.patienceLeft}/${customer.profile.patience}`}
              </span>
            </div>
          </div>
          <p style={{ fontSize: "0.85rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
            {lang === "ar" ? "يريد شراء:" : "Wants to buy:"}
          </p>
          {customer.requests.map((req, idx) => {
            const good = GOODS.find((g) => g.id === req.goodId);
            const price = prices[req.goodId];
            if (!good || !price) return null;
            const hasStock = inventory[req.goodId]?.quantity >= req.qty;
            return (
              <div key={idx} style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                padding: "0.4rem 0.5rem", borderRadius: 6,
                background: hasStock ? "rgba(76,175,80,0.05)" : "rgba(244,67,54,0.05)",
                border: `1px solid ${hasStock ? "rgba(76,175,80,0.2)" : "rgba(244,67,54,0.2)"}`,
                marginBottom: "0.25rem",
              }}>
                <GoodIcon goodId={req.goodId} size={24} />
                <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)" }}>
                  {req.qty}x {t_(good.name)}
                  <span style={{ color: "var(--text-light)", fontSize: "0.75rem", marginLeft: "0.25rem" }}>
                    ({price.sellPrice} دينار/للقطعة)
                  </span>
                </span>
                <span style={{ fontSize: "0.75rem", color: hasStock ? "var(--green-primary)" : "#e53935", fontWeight: 600 }}>
                  {hasStock
                    ? `${inventory[req.goodId].quantity} ${lang === "ar" ? "متوفر" : "in stock"}`
                    : lang === "ar" ? "غير متوفر" : "out of stock"}
                </span>
                {hasStock && (
                  <button onClick={() => onSell(idx)} style={{
                    padding: "0.25rem 0.6rem", borderRadius: 4, border: "none",
                    background: "var(--green-primary)", color: "#fff",
                    fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
                  }}>
                    {lang === "ar" ? "بيع" : "Sell"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "1rem", color: "var(--text-light)", fontSize: "0.85rem" }}>
          {lang === "ar" ? "لا يوجد زبائن حالياً" : "No customers right now"}
        </div>
      )}

      {/* Inventory */}
      <div style={{
        background: "var(--card-bg)", borderRadius: "var(--radius)",
        padding: "0.75rem", border: "1px solid var(--border)",
      }}>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)", margin: "0 0 0.5rem 0" }}>
          {lang === "ar" ? "📦 مخزوني" : "📦 My Inventory"}
        </h3>
        {Object.keys(inventory).length === 0 ? (
          <p style={{ fontSize: "0.8rem", color: "var(--text-light)" }}>
            {lang === "ar" ? "المخزون فارغ، اشترِ من القافلة!" : "Inventory empty, buy from the caravan!"}
          </p>
        ) : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
            {Object.entries(inventory).map(([goodId, entry]) => {
              const good = GOODS.find((g) => g.id === goodId);
              if (!good) return null;
              return (
                <div key={goodId} style={{
                  padding: "0.3rem 0.5rem", borderRadius: 6,
                  background: "rgba(33,150,243,0.06)", border: "1px solid rgba(33,150,243,0.15)",
                  display: "flex", alignItems: "center", gap: "0.3rem",
                }}>
                  <GoodIcon goodId={goodId} size={22} />
                  <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text)" }}>
                    {entry.quantity}
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-light)" }}>
                    @{Math.round(entry.avgCost)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Next Turn */}
      <button onClick={onNextTurn} style={{
        width: "100%", padding: "0.7rem", borderRadius: 8, border: "none",
        background: "linear-gradient(135deg, #FF9800, #F57C00)", color: "#fff",
        fontSize: "1rem", fontWeight: 700, cursor: "pointer",
      }}>
        {lang === "ar" ? "⏳ يوم جديد" : "⏳ Next Day"}
      </button>
    </div>
  );
}

function CaravanView({
  prices, lang, onBuy,
}: {
  prices: Record<string, { buyPrice: number; sellPrice: number }>;
  lang: "ar" | "en";
  onBuy: (goodId: string) => void;
}) {
  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: "var(--radius)",
      padding: "0.75rem", border: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: "1.5rem" }}>🐪</span>
        <div>
          <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", margin: 0 }}>
            {lang === "ar" ? "قافلة التجارة" : "Trade Caravan"}
          </h3>
          <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: 0 }}>
            {lang === "ar" ? "بضائع جديدة من الشام واليمن" : "New goods from Levant and Yemen"}
          </p>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {GOODS.map((good) => {
          const price = prices[good.id];
          if (!price) return null;
          return (
            <div key={good.id} style={{
              display: "flex", alignItems: "center", gap: "0.5rem",
              padding: "0.4rem 0.5rem", borderRadius: 6,
              border: "1px solid var(--border)",
            }}>
              <GoodIcon goodId={good.id} size={26} />
              <span style={{ flex: 1, fontSize: "0.85rem", color: "var(--text)" }}>
                {lang === "ar" ? good.name.ar : good.name.en}
              </span>
              <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#e53935" }}>
                {price.buyPrice} د.ج
              </span>
              <button onClick={() => onBuy(good.id)} style={{
                padding: "0.25rem 0.6rem", borderRadius: 4, border: "none",
                background: "#FF9800", color: "#fff",
                fontSize: "0.75rem", fontWeight: 600, cursor: "pointer",
              }}>
                {lang === "ar" ? "شراء 5" : "Buy 5"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function UpgradeView({
  state, lang, onUpgrade,
}: {
  state: PlayerState;
  lang: "ar" | "en";
  onUpgrade: () => void;
}) {
  const current = SHOP_UPGRADES[state.shopLevel - 1];
  const next = SHOP_UPGRADES[state.shopLevel];
  const canUpgrade = next && state.gold >= next.cost && state.barakah >= next.minBarakah;

  return (
    <div style={{
      background: "var(--card-bg)", borderRadius: "var(--radius)",
      padding: "0.75rem", border: "1px solid var(--border)",
    }}>
      <h3 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", margin: "0 0 0.75rem 0" }}>
        {lang === "ar" ? "📈 تطوير الدكان" : "📈 Shop Development"}
      </h3>

      {/* Current */}
      <div style={{ padding: "0.5rem", borderRadius: 6, background: "rgba(76,175,80,0.06)", border: "1px solid rgba(76,175,80,0.2)", marginBottom: "0.5rem" }}>
        <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
          {lang === "ar" ? "المستوى الحالي:" : "Current level:"}
        </p>
        <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--green-primary)", margin: "0.15rem 0" }}>
          {current.icon} {lang === "ar" ? current.name.ar : current.name.en}
        </p>
        <p style={{ fontSize: "0.75rem", color: "var(--text-light)", margin: 0 }}>
          {lang === "ar" ? `السعة: ${current.capacity} | الزبائن: ${current.customerPerTurn}` : `Capacity: ${current.capacity} | Customers: ${current.customerPerTurn}`}
        </p>
      </div>

      {/* Next */}
      {next ? (
        <div style={{
          padding: "0.5rem", borderRadius: 6,
          background: canUpgrade ? "rgba(255,152,0,0.06)" : "rgba(244,67,54,0.04)",
          border: `1px solid ${canUpgrade ? "rgba(255,152,0,0.3)" : "rgba(244,67,54,0.15)"}`,
        }}>
          <p style={{ fontSize: "0.8rem", color: "var(--text-light)", margin: 0 }}>
            {lang === "ar" ? "المستوى التالي:" : "Next level:"}
          </p>
          <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text)", margin: "0.15rem 0" }}>
            {next.icon} {lang === "ar" ? next.name.ar : next.name.en}
          </p>
          <div style={{ fontSize: "0.75rem", color: "var(--text-light)", marginBottom: "0.5rem" }}>
            <div>{lang === "ar" ? `التكلفة:` : `Cost:`} {next.cost} 🪙 {state.gold >= next.cost ? "✅" : "❌"}</div>
            <div>{lang === "ar" ? `البركة المطلوبة:` : `Barakah needed:`} {next.minBarakah} ⭐ {state.barakah >= next.minBarakah ? "✅" : "❌"}</div>
          </div>
          <button onClick={onUpgrade} disabled={!canUpgrade} style={{
            width: "100%", padding: "0.5rem", borderRadius: 6, border: "none",
            background: canUpgrade ? "linear-gradient(135deg, #FF9800, #F57C00)" : "#ccc",
            color: canUpgrade ? "#fff" : "#999",
            fontSize: "0.85rem", fontWeight: 700, cursor: canUpgrade ? "pointer" : "default",
          }}>
            {lang === "ar" ? `توسعة (${next.cost} دينار)` : `Upgrade (${next.cost} dinars)`}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "1rem", color: "#FFD700", fontWeight: 700, fontSize: "1rem" }}>
          {lang === "ar" ? "👑 أنت شاه بندر التجار! وصلت إلى أعلى مستوى!" : "👑 You are Shah Bandar! Max level reached!"}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: "0.6rem 1.25rem", borderRadius: 8, border: "none",
  background: "var(--green-primary)", color: "#fff",
  fontSize: "0.9rem", fontWeight: 600, cursor: "pointer", margin: "0.25rem",
};
