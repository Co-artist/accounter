const digitMap = { '零':0, '〇':0, '一':1, '二':2, '两':2, '三':3, '四':4, '五':5, '六':6, '七':7, '八':8, '九':9 }
const unitMap = { '十':10, '百':100, '千':1000, '万':10000, '亿':100000000 }

const cnIntegerToNumber = (s) => {
  if (!s) return null
  let total = 0
  let section = 0
  let number = 0
  for (const ch of s) {
    if (digitMap.hasOwnProperty(ch)) {
      number = digitMap[ch]
    } else if (unitMap.hasOwnProperty(ch)) {
      const unit = unitMap[ch]
      if (unit === 10 && number === 0) number = 1
      section += number * unit
      number = 0
      if (unit === 10000 || unit === 100000000) {
        total += section
        total *= unit
        section = 0
      }
    } else if (ch === '点') {
      break
    }
  }
  return total + section + number
}

const cnToNumber = (s) => {
  if (!s) return null
  if (/\d/.test(s)) return null
  if (s.includes('点')) {
    const [intPart, decPart] = s.split('点')
    const intNum = cnIntegerToNumber(intPart)
    if (intNum === null) return null
    let decStr = ''
    for (const ch of decPart) {
      if (digitMap.hasOwnProperty(ch)) decStr += String(digitMap[ch])
    }
    const decNum = decStr ? parseFloat('0.' + decStr) : 0
    return intNum + decNum
  }
  let val = cnIntegerToNumber(s)
  if (val === null) return null
  const wan = s.match(/^([一二两三四五六七八九])万([一二两三四五六七八九])?$/)
  if (wan) {
    const a = digitMap[wan[1]]
    const b = wan[2] ? digitMap[wan[2]] : 0
    return a * 10000 + b * 1000
  }
  const qian = s.match(/^([一二两三四五六七八九])千([一二两三四五六七八九])?$/)
  if (qian) {
    const a = digitMap[qian[1]]
    const b = qian[2] ? digitMap[qian[2]] : 0
    return a * 1000 + b * 100
  }
  const bai = s.match(/^([一二两三四五六七八九])百([一二两三四五六七八九])?$/)
  if (bai) {
    const a = digitMap[bai[1]]
    const b = bai[2] ? digitMap[bai[2]] : 0
    return a * 100 + b * 10
  }
  return val
}

const numberFromText = (text) => {
  const m = text.match(/(?:￥|¥|RMB|CNY)?\s*(-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)(\s*[亿万千百]?)\s*[元块钱人民币￥]?/)
  if (m) {
    const base = parseFloat(String(m[1]).replace(/,/g, ''))
    const unit = (m[2] || '').replace(/\s/g, '')
    const mul = unit === '亿' ? 100000000 : unit === '万' ? 10000 : unit === '千' ? 1000 : unit === '百' ? 100 : 1
    return base * mul
  }
  const m2 = text.match(/([零〇一二两三四五六七八九十百千万亿点]+)\s*[元块钱人民币￥]?/)
  if (m2) {
    const val = cnToNumber(m2[1])
    return val
  }
  return null
}

const normalizeType = (text) => {
  if (/[收入|进账|到账|发工资|工资|奖金|红包|理财|投资|退款收入|收款|打款|报销|退税|利息|分红]/.test(text)) return 'income'
  if (/[支出|花了|消费|买了|付款|付了|转账出|扣款|充值|支付|缴费|还款|房贷]/.test(text)) return 'expense'
  if (/退款/.test(text)) return 'income'
  return null
}

const categoryMap = [
  { name: '餐饮', patterns: [/吃/, /餐/, /饭/, /咖啡/, /奶茶/, /饮料/, /早餐/, /午餐/, /晚餐/] },
  { name: '交通', patterns: [/地铁/, /公交/, /打车/, /滴滴/, /油费/, /打的/, /出租/] },
  { name: '购物', patterns: [/买/, /下单/, /淘宝/, /京东/, /拼多多/, /购物/] },
  { name: '娱乐', patterns: [/电影/, /游戏/, /KTV/, /音乐/, /娱乐/] },
  { name: '房租', patterns: [/房租/, /租金/] },
  { name: '水电费', patterns: [/水费/, /电费/, /燃气/, /煤气/, /物业/] },
  { name: '医疗', patterns: [/医院/, /看病/, /药/, /医疗/] },
  { name: '教育', patterns: [/培训/, /学费/, /教育/, /课程/] },
  { name: '服饰美容', patterns: [/衣服/, /服饰/, /美妆/, /理发/, /美容/] },
  { name: '旅游出行', patterns: [/旅行/, /机票/, /酒店/, /旅游/, /出行/] },
  { name: '社交聚会', patterns: [/聚会/, /请客/, /约饭/, /社交/] },
  { name: '数码配件', patterns: [/手机壳/, /耳机/, /充电器/, /数码/, /配件/] },
  { name: '家居用品', patterns: [/家居/, /家具/, /生活用品/, /卫生纸/, /洗衣液/] },
  { name: '宠物支出', patterns: [/宠物/, /猫粮/, /狗粮/, /宠物用品/] },
  { name: '运动健身', patterns: [/健身/, /运动/, /瑜伽/, /跑步/, /球类/] },
  { name: '学习培训', patterns: [/学习/, /培训/, /网课/] },
  { name: '其他支出', patterns: [/其他支出/] },
  { name: '工资', patterns: [/工资/, /薪资/, /发工资/], type: 'income' },
  { name: '奖金', patterns: [/奖金/], type: 'income' },
  { name: '投资', patterns: [/投资/], type: 'income' },
  { name: '理财收益', patterns: [/理财收益/, /理财/], type: 'income' },
  { name: '兼职收入', patterns: [/兼职/, /外快/], type: 'income' },
  { name: '礼金红包', patterns: [/红包/, /礼金/], type: 'income' },
  { name: '退款收入', patterns: [/退款/, /退钱/], type: 'income' },
  { name: '其他副业', patterns: [/副业/], type: 'income' },
  { name: '其他收入', patterns: [/其他收入/] }
]

const detectCategory = (text, preferredType) => {
  for (const c of categoryMap) {
    if (c.type && preferredType && c.type !== preferredType) continue
    if (c.patterns.some((p) => p.test(text))) return c.name
  }
  return preferredType === 'income' ? '其他收入' : '其他支出'
}

const pad2 = (n) => String(n).padStart(2, '0')
const dayIndex = { '一':1, '二':2, '三':3, '四':4, '五':5, '六':6, '日':7, '天':7 }

const monthStart = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth(), 1)
  return x
}

const monthEnd = (d) => {
  const x = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  return x
}

const shiftDays = (d, n) => new Date(d.getTime() + n * 24 * 60 * 60 * 1000)

const parseRelativeDays = (text, today) => {
  const m = text.match(/(前|后)(\d+|[零〇一二两三四五六七八九十百千万亿]+)天/)
  if (m) {
    const dir = m[1] === '前' ? -1 : 1
    const n = /\d+/.test(m[2]) ? parseInt(m[2], 10) : cnIntegerToNumber(m[2])
    if (n != null) return shiftDays(today, dir * n).toISOString().split('T')[0]
  }
  const w = text.match(/(前|后)(\d+|[零〇一二两三四五六七八九十百千万亿]+)周/)
  if (w) {
    const dir = w[1] === '前' ? -7 : 7
    const n = /\d+/.test(w[2]) ? parseInt(w[2], 10) : cnIntegerToNumber(w[2])
    if (n != null) return shiftDays(today, dir * n).toISOString().split('T')[0]
  }
  return null
}

const weekendDate = (flag, today) => {
  const current = today.getDay() || 7
  let baseShift = 0
  if (flag === '上周末') baseShift = -7
  if (flag === '下周末') baseShift = 7
  const satDiff = 6 - current
  const d = shiftDays(today, baseShift + satDiff)
  return d.toISOString().split('T')[0]
}

const dateFromText = (text) => {
  const today = new Date()
  if (/今天/.test(text)) return today.toISOString().split('T')[0]
  if (/昨天/.test(text)) {
    const d = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }
  if (/前天/.test(text)) {
    const d = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }
  if (/明天/.test(text)) {
    const d = new Date(today.getTime() + 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }
  if (/后天/.test(text)) {
    const d = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }
  const rel = parseRelativeDays(text, today)
  if (rel) return rel
  const ymd = text.match(/(\d{4})[年\-\/\.](\d{1,2})[月\-\/\.](\d{1,2})[日]?/)
  if (ymd) {
    const yyyy = parseInt(ymd[1], 10)
    const mm = pad2(parseInt(ymd[2], 10))
    const dd = pad2(parseInt(ymd[3], 10))
    return `${yyyy}-${mm}-${dd}`
  }
  const md = text.match(/(\d{1,2})月(\d{1,2})日?/)
  if (md) {
    const year = today.getFullYear()
    const mm = pad2(parseInt(md[1], 10))
    const dd = pad2(parseInt(md[2], 10))
    return `${year}-${mm}-${dd}`
  }
  const bm = text.match(/本月(\d{1,2})日?/)
  if (bm) {
    const year = today.getFullYear()
    const mm = pad2(today.getMonth() + 1)
    const dd = pad2(parseInt(bm[1], 10))
    return `${year}-${mm}-${dd}`
  }
  const lm = text.match(/上个月(\d{1,2})日?/)
  if (lm) {
    let year = today.getFullYear()
    let month = today.getMonth()
    if (month === 0) { year -= 1; month = 12 }
    const mm = pad2(month)
    const dd = pad2(parseInt(lm[1], 10))
    return `${year}-${mm}-${dd}`
  }
  const nxm = text.match(/下个月(\d{1,2})日?/)
  if (nxm) {
    let year = today.getFullYear()
    let month = today.getMonth() + 2
    if (month === 13) { year += 1; month = 1 }
    const mm = pad2(month)
    const dd = pad2(parseInt(nxm[1], 10))
    return `${year}-${mm}-${dd}`
  }
  if (/本月初/.test(text)) {
    const d = monthStart(today)
    return d.toISOString().split('T')[0]
  }
  if (/本月底|本月末/.test(text)) {
    const d = monthEnd(today)
    return d.toISOString().split('T')[0]
  }
  if (/上月初|上个月初/.test(text)) {
    const m = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    return m.toISOString().split('T')[0]
  }
  if (/上月底|上个月底|上月末|上个月末/.test(text)) {
    const m = new Date(today.getFullYear(), today.getMonth(), 0)
    return m.toISOString().split('T')[0]
  }
  if (/下月初|下个月初/.test(text)) {
    const m = new Date(today.getFullYear(), today.getMonth() + 1, 1)
    return m.toISOString().split('T')[0]
  }
  if (/下月底|下个月底|下月末|下个月末/.test(text)) {
    const m = new Date(today.getFullYear(), today.getMonth() + 2, 0)
    return m.toISOString().split('T')[0]
  }
  const sw = text.match(/(上周|本周|下周)周([一二三四五六日天])/)
  if (sw) {
    const flag = sw[1]
    const target = dayIndex[sw[2]]
    const current = today.getDay() || 7
    let diff = target - current
    if (flag === '上周') diff -= 7
    if (flag === '下周') diff += 7
    const d = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }
  const wend = text.match(/(上周末|本周末|下周末)/)
  if (wend) {
    return weekendDate(wend[1], today)
  }
  const wonly = text.match(/周([一二三四五六日天])/)
  if (wonly) {
    const target = dayIndex[wonly[1]]
    const current = today.getDay() || 7
    let diff = target - current
    if (diff > 0) diff -= 7
    const d = new Date(today.getTime() + diff * 24 * 60 * 60 * 1000)
    return d.toISOString().split('T')[0]
  }
  return today.toISOString().split('T')[0]
}

export const parseText = (utterance) => {
  const original = (utterance || '').trim()
  const text = original.replace(/\s+/g, '')
  const warnings = []
  const amount = numberFromText(text)
  const type = normalizeType(text)
  const date = dateFromText(text)
  let category = detectCategory(text, type || 'expense')
  let note = text
  // 清理已解析内容
  note = note.replace(/[收入|进账|到账|发工资|工资|奖金|红包|理财收益|理财|投资|花了|支出|消费|买了|付款|付了|转账出|扣款]/g, '')
  note = note.replace(/(\d+(?:\.\d+)?)\s*[元块钱人民币￥]?/g, '')
  note = note.replace(/[零〇一二两三四五六七八九十百千万亿点]+[元块钱人民币￥]?/g, '')
  note = note.replace(/今天|昨天|前天|\d{1,2}月\d{1,2}日/g, '')
  note = note.replace(/\d{4}[年\-\/\.]\d{1,2}[月\-\/\.]\d{1,2}[日]?/g, '')
  note = note.replace(/本月\d{1,2}日|上个月\d{1,2}日|下个月\d{1,2}日/g, '')
  note = note.replace(/(上周|本周|下周)周[一二三四五六日天]|周[一二三四五六日天]/g, '')
  note = note.replace(/餐饮|交通|购物|娱乐|房租|水电费|医疗|教育|服饰美容|旅游出行|社交聚会|数码配件|家居用品|宠物支出|运动健身|学习培训|其他支出|工资|奖金|投资|理财收益|兼职收入|礼金红包|退款收入|其他副业|其他收入/g, '')
  note = note.slice(0, 50)
  if (amount === null) warnings.push('未识别到金额')
  let finalType = type
  if (!finalType) {
    if (category === '工资' || category === '奖金' || category === '投资' || category === '理财收益' || category === '兼职收入' || category === '礼金红包' || category === '退款收入' || category === '其他副业' || category === '其他收入') {
      finalType = 'income'
    } else {
      finalType = 'expense'
    }
  }
  const confidence = (amount !== null ? 0.6 : 0.3) + (type ? 0.3 : 0)
  return { type: finalType, amount, category, date, note, confidence, warnings }
}
