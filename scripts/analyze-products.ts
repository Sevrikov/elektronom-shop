import * as fs from 'fs';

const csvPath = 'C:\\Users\\sevri\\Сайт\\Отчет о товаре.csv';
const content = fs.readFileSync(csvPath, 'utf8');
const lines = content.split('\n');

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') { inQuotes = !inQuotes; }
    else if (char === ',' && !inQuotes) { result.push(current.trim()); current = ''; }
    else { current += char; }
  }
  result.push(current.trim());
  return result;
}

interface Product {
  title: string; itemId: string; status: string;
  price: number; effectiveBasket: number;
  clicks: number; impressions: number; spend: number;
  valueScore: number; category: string;
}

function detectCategory(title: string, price: number): { cat: string; basketMultiplier: number } {
  const t = title.toLowerCase();
  if (t.includes('гильз') || t.includes('гільз') || t.includes('наконечн') ||
      t.includes('gt-') || t.includes('dt(') || t.includes('dj4') || (t.includes('шт.') && price < 15))
    return { cat: 'Расходники', basketMultiplier: 80 };
  if (t.includes('кабель') || t.includes('провід') || t.includes('провод') ||
      t.includes('труб') || t.includes('бухт'))
    return { cat: 'Кабель', basketMultiplier: 5 };
  if (t.includes('автомат') || t.includes('дифавтомат') || t.includes('реле') ||
      t.includes('выключател') || t.includes('перемикач') || t.includes('переключател') ||
      t.includes('кнопк') || t.includes('рубильник') || t.includes('клавишн') || t.includes('узо'))
    return { cat: 'Электрика', basketMultiplier: 3 };
  if (t.includes('акумулятор') || t.includes('батарея') || t.includes('авр') ||
      t.includes('сонячн') || t.includes('solar') || t.includes('панель'))
    return { cat: 'Энергетика', basketMultiplier: 1.2 };
  if (t.includes('intertool') || t.includes('інтертул') || t.includes('щуп') ||
      t.includes('мікрометр') || t.includes('сверл') || t.includes('ключ'))
    return { cat: 'Инструмент', basketMultiplier: 1.5 };
  return { cat: 'Прочее', basketMultiplier: 1 };
}

const products: Product[] = [];
for (let i = 3; i < lines.length; i++) {
  const rawLine = lines[i];
  if (!rawLine) continue;
  const line = rawLine.trim();
  if (!line) continue;
  const parts = parseCSVLine(line);
  if (parts.length < 8) continue;
  const clicks = parseInt((parts[6] || '0').replace(/[^\d]/g, '')) || 0;
  if (clicks === 0) continue;
  const impressions = parseInt((parts[7] || '0').replace(/[^\d]/g, '')) || 0;
  const spend = parseFloat((parts[11] || '0').replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const priceRaw = parts[5] || '';
  const price = parseFloat(priceRaw.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
  const title = parts[1] || '';
  const { cat, basketMultiplier } = detectCategory(title, price);
  const effectiveBasket = Math.max(price * basketMultiplier, price > 0 ? 50 : 0);
  const basketWeight = effectiveBasket > 1000 ? 4 : effectiveBasket > 500 ? 3 : effectiveBasket > 200 ? 2 : effectiveBasket > 100 ? 1.5 : 1;
  const valueScore = (clicks * basketWeight) + (impressions * 0.005 * basketWeight);
  products.push({ title, itemId: parts[3] || '', status: parts[4] || '', price, effectiveBasket, clicks, impressions, spend, valueScore, category: cat });
}

const byId = new Map<string, Product>();
for (const p of products) {
  const existing = byId.get(p.itemId);
  if (!existing || p.valueScore > existing.valueScore) byId.set(p.itemId, p);
}
const top200 = Array.from(byId.values()).sort((a, b) => b.valueScore - a.valueScore).slice(0, 200);

// Group definitions
const groupDefs = [
  { num: 1, name: '🏆 СУПЕР-Звёзды', bid: 7.00 },
  { num: 2, name: '🥇 Топ-А', bid: 6.00 },
  { num: 3, name: '🥈 Топ-Б', bid: 5.00 },
  { num: 4, name: '⭐ Звёзды-А', bid: 4.50 },
  { num: 5, name: '⭐ Звёзды-Б', bid: 4.00 },
  { num: 6, name: '💎 Потенциал-А', bid: 3.80 },
  { num: 7, name: '💎 Потенциал-Б', bid: 3.50 },
  { num: 8, name: '✅ Хорошие-А', bid: 3.20 },
  { num: 9, name: '✅ Хорошие-Б', bid: 3.00 },
  { num: 10, name: '✅ Хорошие-В', bid: 2.80 },
  { num: 11, name: '📦 Средние-А', bid: 2.60 },
  { num: 12, name: '📦 Средние-Б', bid: 2.50 },
  { num: 13, name: '📦 Средние-В', bid: 2.40 },
  { num: 14, name: '📦 Средние-Г', bid: 2.30 },
  { num: 15, name: '📦 Средние-Д', bid: 2.20 },
  { num: 16, name: '🌱 Нач-А', bid: 2.00 },
  { num: 17, name: '🌱 Нач-Б', bid: 1.90 },
  { num: 18, name: '🌱 Нач-В', bid: 1.80 },
  { num: 19, name: '🌱 Нач-Г', bid: 1.70 },
  { num: 20, name: '🌱 Нач-Д', bid: 1.60 },
  { num: 21, name: '🌱 Нач-Е', bid: 1.50 },
  { num: 22, name: '🌱 Нач-Ж', bid: 1.40 },
  { num: 23, name: '🌱 Нач-З', bid: 1.30 },
  { num: 24, name: '🌱 Нач-И', bid: 1.20 },
  { num: 25, name: '🌱 Нач-К', bid: 1.10 },
];

// 1. Generate CSV for Google Ads manual entry
let csvOut = 'Группа №,Название группы,Ставка UAH,Item ID,Артикул (название),Цена грн,Корзина UAH,Клики,Показы,Расходы,Категория,Статус\n';
top200.forEach((p, idx) => {
  const gIdx = Math.min(Math.floor(idx / 8), 24);
  const g = groupDefs[gIdx]!;
  const status = p.status === 'Допущено' ? 'Активен' : 'Заблокирован';
  const shortTitle = p.title.replace(/,/g, ';').substring(0, 70);
  csvOut += `${g.num},"${g.name}",${g.bid},"${p.itemId}","${shortTitle}",${p.price.toFixed(2)},${p.effectiveBasket.toFixed(0)},${p.clicks},${p.impressions},${p.spend.toFixed(2)},${p.category},${status}\n`;
});

fs.writeFileSync('C:\\Users\\sevri\\Сайт\\elektronom\\scratch\\groups_for_ads.csv', '\uFEFF' + csvOut, 'utf8');

// 2. Generate simple TXT reference - grouped
let txt = 'ПЛАН НАСТРОЙКИ 25 ГРУПП ТОВАРОВ В GOOGLE ADS\n';
txt += '='.repeat(60) + '\n';
txt += 'Кампания: Shopping - ASKO-UKREM\n';
txt += 'Как добавить: Группы товаров → "Все товары" → "+" → Идентификатор позиции → Добавить вручную\n\n';

for (let g = 0; g < groupDefs.length; g++) {
  const def = groupDefs[g]!;
  const items = top200.slice(g * 8, (g + 1) * 8);
  if (items.length === 0) continue;
  const totalClicks = items.reduce((s, p) => s + p.clicks, 0);
  
  txt += `\n${'='.repeat(60)}\n`;
  txt += `ГРУППА ${def.num}: ${def.name}\n`;
  txt += `СТАВКА: ${def.bid} UAH/клик\n`;
  txt += `Кликов суммарно: ${totalClicks}\n`;
  txt += `-`.repeat(60) + '\n';
  txt += `ID ДЛЯ ВСТАВКИ В GOOGLE ADS:\n`;
  items.forEach(p => { txt += `${p.itemId}\n`; });
  txt += `\nДЕТАЛИ:\n`;
  items.forEach((p, i) => {
    const status = p.status === 'Допущено' ? '✅' : '❌';
    txt += `  ${i+1}. ${status} [${p.itemId}] ${p.clicks}кл | ${p.price}грн | корзина~${p.effectiveBasket.toFixed(0)}грн | ${p.title.substring(0, 55)}\n`;
  });
}

fs.writeFileSync('C:\\Users\\sevri\\Сайт\\elektronom\\scratch\\groups_reference.txt', txt, 'utf8');

console.log('✅ Files saved:');
console.log('  CSV (для Excel): C:\\Users\\sevri\\Сайт\\elektronom\\scratch\\groups_for_ads.csv');
console.log('  TXT (справочник): C:\\Users\\sevri\\Сайт\\elektronom\\scratch\\groups_reference.txt');
console.log('\nPreview Group 1:');
top200.slice(0, 8).forEach(p => console.log(`  ${p.itemId} | ${p.clicks} кликов | ${p.price} грн | ${p.title.substring(0,50)}`));
